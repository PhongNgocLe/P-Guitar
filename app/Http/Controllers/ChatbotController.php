<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function answer(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:500',
        ], [
            'message.required' => 'Vui lòng nhập câu hỏi.',
            'message.string' => 'Câu hỏi không hợp lệ.',
            'message.max' => 'Câu hỏi không được dài quá 500 ký tự.',
        ]);

        return response()->json([
            'answer' => $this->buildAnswer(trim($validated['message'])),
        ]);
    }

    private function buildAnswer(string $question): string
    {
        $normalized = mb_strtolower($question, 'UTF-8');

        if ($this->containsAny($normalized, ['đổi trả', 'đổi hàng', 'trả hàng', 'hoàn tiền'])) {
            return 'Nếu sản phẩm giao không đúng đơn hoặc bị hư hỏng khi vận chuyển, bạn vui lòng giữ hóa đơn, chụp ảnh/video tình trạng lúc nhận hàng và liên hệ shop sớm để được hỗ trợ. Điều kiện cụ thể tùy sản phẩm và đơn hàng. Xem thêm: ' . url('/about#return-policy');
        }

        if ($this->containsAny($normalized, ['giao hàng', 'vận chuyển', 'ship', 'phí ship', 'bao lâu nhận'])) {
            return 'Thời gian và phí giao hàng phụ thuộc vào địa chỉ nhận và phương thức vận chuyển; shop sẽ thông báo khi xác nhận đơn. Khi nhận đàn, bạn vui lòng kiểm tra kiện hàng và sản phẩm trước khi ký nhận. Xem thêm: ' . url('/about#shipping-policy');
        }

        if ($this->containsAny($normalized, ['bảo hành', 'sửa chữa', 'bảo trì'])) {
            return 'Thời hạn và phạm vi bảo hành tùy theo thương hiệu, dòng sản phẩm và thông tin trên phiếu bảo hành hoặc chứng từ mua hàng. Bạn vui lòng cung cấp thông tin đơn hàng để shop kiểm tra. Xem thêm: ' . url('/about#warranty-policy');
        }

        if ($this->containsAny($normalized, ['liên hệ', 'địa chỉ', 'hotline', 'số điện thoại', 'email', 'cửa hàng ở đâu'])) {
            return 'Bạn có thể xem thông tin và giới thiệu về P-Guitar tại ' . url('/about#store-story') . '. Thông tin liên hệ cụ thể sẽ được xác nhận cùng đơn hàng.';
        }

        if ($this->containsAny($normalized, ['xin chào', 'chào shop', 'hello', 'hi shop', 'bạn ơi'])) {
            return 'Xin chào! Mình là trợ lý P-Guitar. Mình có thể giúp bạn tìm đàn, kiểm tra giá và tồn kho, hoặc tìm hiểu chính sách đổi trả, giao hàng và bảo hành. Bạn đang cần hỗ trợ điều gì?';
        }

        if ($this->containsAny($normalized, ['đàn', 'guitar', 'sản phẩm', 'tư vấn', 'mua', 'giá', 'còn hàng', 'tồn kho'])) {
            return $this->productAnswer($normalized);
        }

        return 'Mình có thể hỗ trợ tìm sản phẩm và thông tin giá/tồn kho, hoặc giải đáp về đổi trả, giao hàng và bảo hành. Bạn có thể hỏi, ví dụ: “Shop có guitar acoustic nào?”';
    }

    private function productAnswer(string $question): string
    {
        $terms = preg_split('/[^\p{L}\p{N}]+/u', $question, -1, PREG_SPLIT_NO_EMPTY);
        $stopWords = ['mình', 'muốn', 'mua', 'tư', 'vấn', 'sản', 'phẩm', 'đàn', 'guitar', 'cây', 'nào', 'có', 'shop', 'giá', 'bao', 'nhiêu', 'còn', 'hàng', 'không', 'cho', 'tôi', 'với', 'và', 'là', 'loại'];
        $terms = array_values(array_filter(array_unique($terms), function ($term) use ($stopWords) {
            return mb_strlen($term, 'UTF-8') > 1 && ! in_array($term, $stopWords, true);
        }));

        $productsQuery = Product::query();
        if (count($terms) > 0) {
            $productsQuery->where(function ($query) use ($terms) {
                foreach ($terms as $term) {
                    $query->orWhere('name', 'like', '%' . $term . '%')
                        ->orWhere('category', 'like', '%' . $term . '%')
                        ->orWhere('tag', 'like', '%' . $term . '%');
                }
            });
        } else {
            $productsQuery->where('stock_quantity', '>', 0);
        }

        $products = $productsQuery
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'price', 'inStock', 'stock_quantity']);

        if ($products->isEmpty()) {
            return 'Mình chưa tìm thấy sản phẩm khớp với mô tả. Bạn thử cho mình biết loại đàn (acoustic, electric hoặc classic) hay tên sản phẩm nhé. Bạn cũng có thể xem toàn bộ cửa hàng tại ' . url('/#store');
        }

        $details = $products->map(function (Product $product) {
            $stock = $product->inStock
                ? 'Còn ' . (int) $product->stock_quantity . ' sản phẩm'
                : 'Hiện hết hàng';

            return '- ' . $product->name
                . ' — ' . number_format((float) $product->price, 0, ',', '.') . '₫'
                . ' (' . $stock . '): ' . route('product.show', $product->id);
        })->implode("\n");

        return "Mình tìm thấy một số sản phẩm để bạn tham khảo:\n" . $details . "\nBạn muốn tìm theo loại đàn hay khoảng giá nào?";
    }

    private function containsAny(string $text, array $phrases): bool
    {
        foreach ($phrases as $phrase) {
            if (mb_strpos($text, $phrase, 0, 'UTF-8') !== false) {
                return true;
            }
        }

        return false;
    }
}

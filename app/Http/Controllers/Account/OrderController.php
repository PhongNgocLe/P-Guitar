<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Danh sách đơn hàng của khách hàng hiện tại
     */
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless(Schema::hasTable('orders'), 500, 'Orders table not configured.');

        $orders = DB::table('orders')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $orderIds = $orders->pluck('id');

        $itemsByOrder = collect();
        if (Schema::hasTable('order_details') && $orderIds->isNotEmpty()) {
            $items = DB::table('order_details')
                ->whereIn('order_details.order_id', $orderIds)
                ->leftJoin('products', 'order_details.product_id', '=', 'products.id')
                ->select([
                    'order_details.id',
                    'order_details.order_id',
                    'order_details.product_id',
                    'order_details.price',
                    'order_details.quantity',
                    'products.name as product_name',
                    'products.img as product_img',
                    'products.category as product_category',
                ])
                ->get()
                ->groupBy('order_id');

            $itemsByOrder = $items;
        }

        $formattedOrders = $orders->map(function ($order) use ($itemsByOrder) {
            $order->items = $itemsByOrder->get($order->id, collect());
            return $order;
        });

        return Inertia::render('Account/Orders', [
            'orders' => $formattedOrders,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Khách hàng tự hủy đơn hàng khi đơn còn ở trạng thái "Đang xử lý"
     */
    public function cancel(Request $request, int $order)
    {
        $user = $request->user();

        DB::transaction(function () use ($user, $order) {
            $currentOrder = DB::table('orders')
                ->where('id', $order)
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            abort_unless($currentOrder, 404, 'Không tìm thấy đơn hàng của bạn.');

            if ($currentOrder->status !== 'Đang xử lý') {
                throw ValidationException::withMessages([
                    'order' => 'Chỉ có thể hủy đơn hàng khi đang ở trạng thái "Đang xử lý". Đơn hàng đã giao hoặc đang vận chuyển không thể tự hủy.',
                ]);
            }

            // Hoàn lại số lượng tồn kho
            $stockWasDeducted = Schema::hasColumn('orders', 'stock_deducted')
                ? (bool) $currentOrder->stock_deducted
                : false;

            if ($stockWasDeducted && Schema::hasTable('order_details')) {
                $items = DB::table('order_details')
                    ->where('order_id', $order)
                    ->get(['product_id', 'quantity']);

                $products = Product::query()
                    ->whereIn('id', $items->pluck('product_id'))
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                foreach ($items as $item) {
                    $product = $products->get($item->product_id);
                    if ($product) {
                        $product->stock_quantity += $item->quantity;
                        $product->inStock = $product->stock_quantity > 0;
                        $product->save();
                    }
                }
            }

            $updates = [
                'status' => 'Đã hủy',
            ];
            if (Schema::hasColumn('orders', 'stock_deducted')) {
                $updates['stock_deducted'] = false;
            }

            DB::table('orders')->where('id', $order)->update($updates);
        });

        return redirect()->route('account.orders')->with('success', "Đã hủy đơn hàng #{$order} thành công và hoàn trả số lượng vào kho.");
    }
}

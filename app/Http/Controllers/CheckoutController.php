<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', Rule::in(['COD', 'MoMo', 'QR Pay'])],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:2147483647'],
        ]);

        abort_unless(Schema::hasTable('orders') && Schema::hasTable('order_details'), 500, 'Order tables are not configured.');

        $cartItems = collect($validated['items']);
        $orderId = DB::transaction(function () use ($request, $validated, $cartItems) {
            $products = Product::query()
                ->whereIn('id', $cartItems->pluck('product_id'))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');
            $errors = [];

            foreach ($cartItems as $index => $item) {
                $product = $products->get($item['product_id']);
                if (! $product || $product->stock_quantity < $item['quantity']) {
                    $errors["items.{$index}.product_id"] = 'Sản phẩm đã hết hàng hoặc số lượng trong kho không đủ.';
                }
            }

            if ($errors) {
                throw ValidationException::withMessages($errors);
            }

            $total = $cartItems->sum(function ($item) use ($products) {
                return (int) round($products->get($item['product_id'])->price) * $item['quantity'];
            });

            if ($total < 1 || $total > 9999999999) {
                throw ValidationException::withMessages([
                    'items' => 'Tổng giá trị đơn hàng không hợp lệ.',
                ]);
            }

            $orderAttributes = [
                'user_id' => $request->user()->id,
                'fullname' => $validated['fullname'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'note' => $validated['note'] ?? null,
                'payment_method' => $validated['payment_method'],
                'total_money' => $total,
                'status' => 'Đang xử lý',
                'created_at' => now(),
            ];
            if (Schema::hasColumn('orders', 'stock_deducted')) {
                $orderAttributes['stock_deducted'] = true;
            }

            $orderId = DB::table('orders')->insertGetId($orderAttributes);

            $details = $cartItems->map(function ($item) use ($products, $orderId) {
                return [
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'price' => (int) round($products->get($item['product_id'])->price),
                    'quantity' => $item['quantity'],
                ];
            })->all();

            DB::table('order_details')->insert($details);

            foreach ($cartItems as $item) {
                $product = $products->get($item['product_id']);
                $product->stock_quantity -= $item['quantity'];
                $product->inStock = $product->stock_quantity > 0;
                $product->save();
            }

            return $orderId;
        });

        return redirect('/')->with('checkout_success', [
            'order_id' => $orderId,
            'payment_method' => $validated['payment_method'],
        ]);
    }
}

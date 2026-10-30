<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

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
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        abort_unless(Schema::hasTable('orders') && Schema::hasTable('order_details'), 500, 'Order tables are not configured.');

        $cartItems = collect($validated['items']);
        $products = Product::query()
            ->whereIn('id', $cartItems->pluck('product_id'))
            ->get()
            ->keyBy('id');

        foreach ($cartItems as $index => $item) {
            $product = $products->get($item['product_id']);
            if (! $product || ! $product->inStock) {
                return back()->withErrors([
                    "items.{$index}.product_id" => 'Sản phẩm không còn hàng hoặc không còn tồn tại.',
                ]);
            }
        }

        $total = $cartItems->sum(function ($item) use ($products) {
            return (int) round($products->get($item['product_id'])->price) * $item['quantity'];
        });

        if ($total < 1 || $total > 9999999999) {
            return back()->withErrors([
                'items' => 'Tổng giá trị đơn hàng không hợp lệ.',
            ]);
        }

        $orderId = DB::transaction(function () use ($request, $validated, $cartItems, $products, $total) {
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $request->user()->id,
                'fullname' => $validated['fullname'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'note' => $validated['note'] ?? null,
                'payment_method' => $validated['payment_method'],
                'total_money' => $total,
                'status' => 'Đang xử lý',
                'created_at' => now(),
            ]);

            $details = $cartItems->map(function ($item) use ($products, $orderId) {
                return [
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'price' => (int) round($products->get($item['product_id'])->price),
                    'quantity' => $item['quantity'],
                ];
            })->all();

            DB::table('order_details')->insert($details);

            return $orderId;
        });

        return redirect('/')->with('checkout_success', [
            'order_id' => $orderId,
            'payment_method' => $validated['payment_method'],
        ]);
    }
}

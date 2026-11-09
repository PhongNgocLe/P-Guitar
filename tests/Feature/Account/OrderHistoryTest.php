<?php

namespace Tests\Feature\Account;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class OrderHistoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('orders', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->string('fullname', 100);
            $table->string('phone', 20);
            $table->string('address', 255);
            $table->text('note')->nullable();
            $table->string('payment_method', 50)->nullable()->default('COD');
            $table->string('payment_status', 50)->default('unpaid');
            $table->string('vnp_transaction_no', 100)->nullable();
            $table->string('vnp_bank_code', 50)->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->decimal('total_money', 10, 0);
            $table->string('status', 50)->nullable()->default('Đang xử lý');
            $table->boolean('stock_deducted')->default(true);
            $table->dateTime('created_at')->nullable();
        });

        Schema::create('order_details', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('order_id');
            $table->unsignedInteger('product_id');
            $table->decimal('price', 10, 0);
            $table->integer('quantity');
        });
    }

    public function test_guest_cannot_access_orders_page()
    {
        $this->get(route('account.orders'))->assertRedirect(route('login'));
    }

    public function test_customer_can_view_order_history_and_items()
    {
        $customer = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Fender Stratocaster',
            'category' => 'ELECTRIC',
            'price' => 15000000,
            'stock_quantity' => 5,
            'inStock' => true,
            'img' => '/storage/fender.jpg',
        ]);

        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $customer->id,
            'fullname' => 'Nguyen Van A',
            'phone' => '0901234567',
            'address' => 'Hanoi, Vietnam',
            'payment_method' => 'Ví P-Pay',
            'payment_status' => 'paid',
            'total_money' => 15000000,
            'status' => 'Đang xử lý',
            'created_at' => now(),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $orderId,
            'product_id' => $product->id,
            'price' => 15000000,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($customer)->get(route('account.orders'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Account/Orders')
            ->has('orders', 1)
            ->where('orders.0.id', $orderId)
            ->where('orders.0.items.0.product_name', 'Fender Stratocaster')
        );
    }

    public function test_customer_can_cancel_processing_order_and_restores_stock()
    {
        $customer = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Taylor Acoustic',
            'category' => 'ACOUSTIC',
            'price' => 20000000,
            'stock_quantity' => 2,
            'inStock' => true,
            'img' => '/storage/taylor.jpg',
        ]);

        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $customer->id,
            'fullname' => 'Tran B',
            'phone' => '0912345678',
            'address' => 'Da Nang',
            'payment_method' => 'COD',
            'payment_status' => 'unpaid',
            'total_money' => 20000000,
            'status' => 'Đang xử lý',
            'stock_deducted' => true,
            'created_at' => now(),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $orderId,
            'product_id' => $product->id,
            'price' => 20000000,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($customer)->post(route('account.orders.cancel', $orderId));
        $response->assertRedirect(route('account.orders'));

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'Đã hủy',
            'stock_deducted' => false,
        ]);

        // Stock quantity restored from 2 to 4
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 4,
            'inStock' => true,
        ]);
    }

    public function test_customer_cannot_cancel_shipping_or_delivered_order()
    {
        $customer = User::factory()->create();
        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $customer->id,
            'fullname' => 'Tran B',
            'phone' => '0912345678',
            'address' => 'Da Nang',
            'payment_method' => 'COD',
            'total_money' => 1000000,
            'status' => 'Đang giao hàng',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($customer)->post(route('account.orders.cancel', $orderId));
        $response->assertSessionHasErrors('order');

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'Đang giao hàng',
        ]);
    }
}

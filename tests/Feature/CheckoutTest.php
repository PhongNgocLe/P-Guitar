<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CheckoutTest extends TestCase
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
            $table->decimal('total_money', 10, 0);
            $table->string('status', 50)->nullable()->default('Đang xử lý');
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

    public function test_customer_can_place_orders_using_cod_momo_and_qr_pay()
    {
        $customer = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Checkout Guitar',
            'category' => 'ACOUSTIC',
            'price' => 1250000,
            'stock_quantity' => 6,
            'inStock' => true,
            'img' => '/storage/checkout-guitar.jpg',
        ]);

        foreach (['COD', 'MoMo', 'QR Pay'] as $method) {
            $this->actingAs($customer)
                ->post(route('checkout.store'), [
                    'fullname' => 'Test Customer',
                    'phone' => '0901234567',
                    'address' => 'Ho Chi Minh City',
                    'payment_method' => $method,
                    'items' => [[
                        'product_id' => $product->id,
                        'quantity' => 2,
                        'price' => 1,
                    ]],
                ])
                ->assertRedirect('/');

            $this->assertDatabaseHas('orders', [
                'user_id' => $customer->id,
                'payment_method' => $method,
                'total_money' => 2500000,
                'status' => 'Đang xử lý',
            ]);
        }

        $this->assertDatabaseHas('order_details', [
            'product_id' => $product->id,
            'price' => 1250000,
            'quantity' => 2,
        ]);
        $this->assertDatabaseCount('orders', 3);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 0,
            'inStock' => false,
        ]);
    }

    public function test_checkout_requires_authentication_and_rejects_unavailable_payment_methods()
    {
        $this->get(route('checkout'))->assertRedirect(route('login'));
        $this->post(route('checkout.store'), [])->assertRedirect(route('login'));

        $customer = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Checkout Guitar',
            'category' => 'ACOUSTIC',
            'price' => 1250000,
            'stock_quantity' => 2,
            'inStock' => true,
            'img' => '/storage/checkout-guitar.jpg',
        ]);

        $this->actingAs($customer)
            ->from('/')
            ->post(route('checkout.store'), [
                'fullname' => 'Test Customer',
                'phone' => '0901234567',
                'address' => 'Ho Chi Minh City',
                'payment_method' => 'Unknown gateway',
                'items' => [['product_id' => $product->id, 'quantity' => 1]],
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors('payment_method');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_rejects_orders_over_available_stock()
    {
        $customer = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Low Stock Guitar',
            'category' => 'ACOUSTIC',
            'price' => 1250000,
            'stock_quantity' => 1,
            'inStock' => true,
            'img' => '/storage/low-stock-guitar.jpg',
        ]);

        $this->actingAs($customer)
            ->from('/')
            ->post(route('checkout.store'), [
                'fullname' => 'Test Customer',
                'phone' => '0901234567',
                'address' => 'Ho Chi Minh City',
                'payment_method' => 'COD',
                'items' => [['product_id' => $product->id, 'quantity' => 2]],
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors('items.0.product_id');

        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 1,
            'inStock' => true,
        ]);
    }
}

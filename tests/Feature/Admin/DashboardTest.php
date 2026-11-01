<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_dashboard_management_sections()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        $product = Product::query()->forceCreate([
            'name' => 'Test Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'inStock' => true,
            'img' => '/storage/test-guitar.jpg',
        ]);
        $loadedProduct = Product::query()->findOrFail($product->id);
        $this->assertFalse($loadedProduct->inStock);
        $this->assertFalse($loadedProduct->toArray()['inStock']);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('categories', 4)
            ->where('categories.0.name', 'Acoustic')
            ->where('categories.1.name', 'Electric')
            ->where('categories.2.name', 'Classic')
            ->where('categories.3.name', 'Phụ kiện')
            ->where('products.0.id', $product->id)
            ->where('products.0.stock_quantity', 0)
            ->where('products.0.inStock', false)
            ->where('users.0.id', $admin->id)
            ->where('users.1.id', $user->id)
        );
    }

    public function test_regular_users_cannot_access_admin_dashboard()
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.dashboard'))
            ->assertRedirect('/');
    }

    public function test_admin_can_create_product_with_uploaded_image()
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Uploaded Guitar',
            'category' => 'Electric',
            'tag' => 'NEW',
            'price' => 2500000,
            'origPrice' => 3000000,
            'inStock' => true,
            'img' => UploadedFile::fake()->image('guitar.jpg'),
            'specs' => "Body: Mahogany\nNeck: Maple",
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertDatabaseHas('products', [
            'name' => 'Uploaded Guitar',
            'category' => 'Electric',
            'price' => 2500000,
        ]);

        $product = Product::query()->where('name', 'Uploaded Guitar')->firstOrFail();
        $this->assertSame(0, $product->stock_quantity);
        $this->assertFalse($product->inStock);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $product->img));
    }

    public function test_admin_can_add_and_delete_unused_categories()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.categories.store'), ['name' => 'Ukulele'])
            ->assertRedirect(route('admin.dashboard'));

        $category = DB::table('categories')->where('name', 'Ukulele')->first();
        $this->assertNotNull($category);
        $this->assertSame('ukulele', $category->slug);

        $this->delete(route('admin.categories.destroy', $category->id))
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_delete_a_category_used_by_products()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = DB::table('categories')->where('name', 'Electric')->first();
        Product::query()->forceCreate([
            'name' => 'Electric Guitar',
            'category' => 'Electric',
            'price' => 1000000,
            'stock_quantity' => 0,
            'inStock' => false,
            'img' => '/storage/electric.jpg',
        ]);

        $this->actingAs($admin)
            ->from(route('admin.dashboard'))
            ->delete(route('admin.categories.destroy', $category->id))
            ->assertRedirect(route('admin.dashboard'))
            ->assertSessionHasErrors('category');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_create_a_product_with_a_category_not_in_the_category_list()
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->from(route('admin.dashboard'))
            ->post(route('admin.products.store'), [
                'name' => 'Invalid Category Guitar',
                'category' => 'CUSTOM',
                'price' => 1000000,
                'img' => UploadedFile::fake()->image('guitar.jpg'),
            ])
            ->assertRedirect(route('admin.dashboard'))
            ->assertSessionHasErrors('category');

        $this->assertDatabaseMissing('products', ['name' => 'Invalid Category Guitar']);
    }

    public function test_admin_can_create_stock_receipt_and_increase_inventory()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $guitar = Product::query()->forceCreate([
            'name' => 'Acoustic Guitar',
            'category' => 'ACOUSTIC',
            'price' => 1000000,
            'stock_quantity' => 2,
            'inStock' => true,
            'img' => '/storage/acoustic.jpg',
        ]);
        $bass = Product::query()->forceCreate([
            'name' => 'Electric Bass',
            'category' => 'ELECTRIC',
            'price' => 1500000,
            'stock_quantity' => 0,
            'inStock' => false,
            'img' => '/storage/bass.jpg',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.inventory.receipts.store'), [
                'items' => [
                    ['product_id' => $guitar->id, 'quantity' => 3],
                    ['product_id' => $bass->id, 'quantity' => 5],
                ],
            ])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseCount('stock_receipts', 1);
        $this->assertNotNull(DB::table('stock_receipts')->value('received_at'));
        $this->assertDatabaseHas('stock_receipt_items', [
            'product_id' => $guitar->id,
            'product_name' => 'Acoustic Guitar',
            'quantity' => 3,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $guitar->id,
            'stock_quantity' => 5,
            'inStock' => true,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $bass->id,
            'stock_quantity' => 5,
            'inStock' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('stockReceipts.0.items.0.quantity', '3')
                ->where('stockReceipts.0.items.1.quantity', '5')
            );
    }

    public function test_regular_users_cannot_create_stock_receipts()
    {
        $product = Product::query()->forceCreate([
            'name' => 'Protected Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'stock_quantity' => 0,
            'inStock' => false,
            'img' => '/storage/guitar.jpg',
        ]);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.inventory.receipts.store'), [
                'items' => [['product_id' => $product->id, 'quantity' => 5]],
            ])
            ->assertRedirect('/');

        $this->assertDatabaseCount('stock_receipts', 0);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock_quantity' => 0]);
    }

    public function test_admin_can_delete_a_product_and_its_uploaded_image()
    {
        Storage::fake('public');
        Storage::disk('public')->put('products/test-guitar.jpg', 'image');
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::query()->forceCreate([
            'name' => 'Test Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'inStock' => true,
            'img' => '/storage/products/test-guitar.jpg',
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.products.destroy', $product))
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
        Storage::disk('public')->assertMissing('products/test-guitar.jpg');
    }

    public function test_admin_cannot_delete_a_product_used_in_an_order()
    {
        Schema::create('order_details', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('product_id');
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::query()->forceCreate([
            'name' => 'Ordered Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'inStock' => true,
            'img' => '/storage/ordered-guitar.jpg',
        ]);
        DB::table('order_details')->insert(['product_id' => $product->id]);

        $this->actingAs($admin)
            ->from(route('admin.dashboard'))
            ->delete(route('admin.products.destroy', $product))
            ->assertRedirect(route('admin.dashboard'))
            ->assertSessionHasErrors('product');

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_regular_users_cannot_delete_products()
    {
        $product = Product::query()->forceCreate([
            'name' => 'Protected Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'inStock' => true,
            'img' => '/storage/protected-guitar.jpg',
        ]);

        $this->actingAs(User::factory()->create())
            ->delete(route('admin.products.destroy', $product))
            ->assertRedirect('/');

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_admin_can_update_and_delete_a_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $user), ['role' => 'admin'])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseHas('users', ['id' => $user->id, 'role' => 'admin']);

        $this->delete(route('admin.users.destroy', $user))
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_themselves_or_the_last_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $admin))
            ->assertSessionHasErrors('user');

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => 'admin']);
    }

    public function test_admin_cannot_delete_a_user_with_orders()
    {
        Schema::create('orders', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        DB::table('orders')->insert(['user_id' => $user->id]);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $user))
            ->assertSessionHasErrors('user');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_admin_can_update_delivery_status_and_view_revenue_chart()
    {
        Schema::create('orders', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->string('fullname');
            $table->string('phone');
            $table->string('address');
            $table->decimal('total_money', 10, 0);
            $table->string('status')->default('Đang xử lý');
            $table->dateTime('created_at')->nullable();
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $admin->id,
            'fullname' => 'Test Customer',
            'phone' => '0900000000',
            'address' => 'Ho Chi Minh City',
            'total_money' => 1250000,
            'status' => 'Đang giao hàng',
            'created_at' => now()->toDateTimeString(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('orders.0.id', (string) $orderId)
                ->where('pendingOrders', 1)
                ->where('revenueChart.11.revenue', 0)
                ->has('revenueChart', 12)
            );

        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đã giao'])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'Đã giao',
        ]);

        $this->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('revenueChart.11.revenue', 1250000)
                ->where('pendingOrders', 0)
            );
    }

    public function test_order_status_cannot_move_backwards_or_change_after_completion()
    {
        Schema::create('orders', function ($table) {
            $table->increments('id');
            $table->string('status');
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $orderId = DB::table('orders')->insertGetId(['status' => 'Đang xử lý']);

        $this->actingAs($admin)
            ->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đang giao hàng'])
            ->assertRedirect(route('admin.dashboard'));

        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đang xử lý'])
            ->assertSessionHasErrors('status');
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'Đang giao hàng']);

        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đã hủy'])
            ->assertSessionHasErrors('status');
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'Đang giao hàng']);

        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đã giao'])
            ->assertRedirect(route('admin.dashboard'));
        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đang giao hàng'])
            ->assertSessionHasErrors('status');

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'Đã giao']);
    }

    public function test_cancelling_a_processing_order_restores_stock_only_once()
    {
        Schema::create('orders', function ($table) {
            $table->increments('id');
            $table->string('status');
            $table->boolean('stock_deducted')->default(false);
        });
        Schema::create('order_details', function ($table) {
            $table->increments('id');
            $table->unsignedInteger('order_id');
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('quantity');
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::query()->forceCreate([
            'name' => 'Cancelled Guitar',
            'category' => 'ELECTRIC',
            'price' => 1000000,
            'stock_quantity' => 1,
            'inStock' => true,
            'img' => '/storage/cancelled-guitar.jpg',
        ]);
        $orderId = DB::table('orders')->insertGetId([
            'status' => 'Đang xử lý',
            'stock_deducted' => true,
        ]);
        DB::table('order_details')->insert([
            'order_id' => $orderId,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đã hủy'])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 3,
            'inStock' => true,
        ]);
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'stock_deducted' => false]);

        $this->patch(route('admin.orders.update-status', $orderId), ['status' => 'Đang xử lý'])
            ->assertSessionHasErrors('status');
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock_quantity' => 3]);
    }
}

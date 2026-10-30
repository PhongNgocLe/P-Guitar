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

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('products.0.id', $product->id)
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
            'category' => 'ELECTRIC',
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
            'category' => 'ELECTRIC',
            'price' => 2500000,
        ]);

        $product = Product::query()->where('name', 'Uploaded Guitar')->firstOrFail();
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $product->img));
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
}

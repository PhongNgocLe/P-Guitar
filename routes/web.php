<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\VirtualWalletController;
use App\Http\Controllers\Account\OrderController as CustomerOrderController;
use App\Http\Controllers\Account\ProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'products' => Product::all(),
        'categories' => DB::table('categories')
            ->orderByRaw("CASE slug WHEN 'acoustic' THEN 0 WHEN 'electric' THEN 1 WHEN 'classic' THEN 2 WHEN 'phu-kien' THEN 3 ELSE 4 END")
            ->orderBy('name')
            ->get(['id', 'name', 'slug']),
        'checkoutSuccess' => session('checkout_success'),
        'checkoutOpen' => request()->query('checkout') === '1',
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');


Route::post('/checkout', [CheckoutController::class, 'store'])
    ->middleware('auth')
    ->name('checkout.store');
Route::get('/checkout', function () {
    return redirect('/?checkout=1');
})->middleware('auth')->name('checkout');

// Trang chi tiết sản phẩm
Route::get('/product/{product}', [ProductController::class, 'show'])
    ->name('product.show');

// Cổng thanh toán VNPAY
Route::get('/vnpay/return', [PaymentController::class, 'vnpayReturn'])->name('vnpay.return');
Route::match(['get', 'post'], '/vnpay/ipn', [PaymentController::class, 'vnpayIpn'])->name('vnpay.ipn');

// Cổng Ví điện tử ảo P-Pay (Thử nghiệm đồ án LVTN)
Route::get('/wallet/scan/{order}', [VirtualWalletController::class, 'scan'])->name('wallet.scan');
Route::get('/wallet/pay/{order}', [VirtualWalletController::class, 'pay'])->name('wallet.pay');
Route::post('/api/wallet/process', [VirtualWalletController::class, 'process'])->name('wallet.process');
Route::get('/api/orders/{order}/payment-status', [VirtualWalletController::class, 'checkStatus'])->name('wallet.status');

// Quản trị viên (Admin)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/products', [DashboardController::class, 'storeProduct'])->name('products.store');
    Route::delete('/products/{product}', [DashboardController::class, 'destroyProduct'])->name('products.destroy');
    Route::post('/categories', [DashboardController::class, 'storeCategory'])->name('categories.store');
    Route::delete('/categories/{category}', [DashboardController::class, 'destroyCategory'])->name('categories.destroy');
    Route::post('/inventory/receipts', [DashboardController::class, 'storeStockReceipt'])->name('inventory.receipts.store');
    Route::patch('/orders/{order}/status', [DashboardController::class, 'updateOrderStatus'])->name('orders.update-status');
    
    Route::delete('/users/{user}', [DashboardController::class, 'destroyUser'])->name('users.destroy');
    Route::get('/admin/users/{user}', [DashboardController::class, 'showUser'])->name('admin.users.show');
});


Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'admin'])->name('dashboard');

// Khu vực khách hàng thành viên (Account)
Route::middleware('auth')->group(function () {
    Route::get('/account', function () {
        return Inertia::render('Account/Show');
    })->name('account.show');
    Route::patch('/account', [ProfileController::class, 'update'])->name('account.update');
    Route::put('/account/password', [ProfileController::class, 'updatePassword'])->name('account.password.update');

    Route::get('/account/orders', [CustomerOrderController::class, 'index'])->name('account.orders');
    Route::post('/account/orders/{order}/cancel', [CustomerOrderController::class, 'cancel'])->name('account.orders.cancel');
});


require __DIR__.'/auth.php';

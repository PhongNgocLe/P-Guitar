<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\CheckoutController;

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
        'checkoutSuccess' => session('checkout_success'),
        'checkoutOpen' => request()->query('checkout') === '1',
    ]);
});

Route::post('/checkout', [CheckoutController::class, 'store'])
    ->middleware('auth')
    ->name('checkout.store');
Route::get('/checkout', function () {
    return redirect('/?checkout=1');
})->middleware('auth')->name('checkout');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/products', [DashboardController::class, 'storeProduct'])->name('products.store');
    Route::patch('/orders/{order}/status', [DashboardController::class, 'updateOrderStatus'])->name('orders.update-status');
    Route::patch('/users/{user}', [DashboardController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{user}', [DashboardController::class, 'destroyUser'])->name('users.destroy');
});

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'admin'])->name('dashboard');

Route::get('/account', function () {
    return Inertia::render('Account/Show');
})->middleware('auth')->name('account.show');

require __DIR__.'/auth.php';

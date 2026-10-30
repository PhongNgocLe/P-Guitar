<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $chartStart = $now->copy()->subMonths(11)->startOfMonth();
        $hasOrders = Schema::hasTable('orders');
        $orders = $hasOrders
            ? DB::table('orders')->orderByDesc('created_at')->get([
                'id',
                'fullname',
                'phone',
                'address',
                'total_money',
                'status',
                'created_at',
            ])
            : collect();
        $incomeByMonth = $hasOrders
            ? DB::table('orders')
                ->where('status', 'Đã giao')
                ->whereBetween('created_at', [$chartStart, $now])
                ->get(['created_at', 'total_money'])
                ->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->format('Y-m');
                })
            : collect();
        $revenueChart = collect(range(0, 11))->map(function ($offset) use ($chartStart, $incomeByMonth) {
            $month = $chartStart->copy()->addMonths($offset);
            $revenue = $incomeByMonth->get($month->format('Y-m'), collect())
                ->sum('total_money');

            return [
                'label' => $month->format('m/y'),
                'revenue' => (int) $revenue,
            ];
        });

        return Inertia::render('Dashboard', [
            'products' => Product::query()->orderByDesc('id')->get(),
            'users' => User::query()
                ->orderBy('id')
                ->get(['id', 'username', 'fullname', 'email', 'phone', 'address', 'role']),
            'orders' => $orders,
            'revenueChart' => $revenueChart,
            'monthlyRevenue' => $revenueChart->last()['revenue'],
            'pendingOrders' => $orders->whereIn('status', ['Đang xử lý', 'Đang giao hàng'])->count(),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function updateOrderStatus(Request $request, int $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['Đang xử lý', 'Đang giao hàng', 'Đã giao', 'Đã hủy'])],
        ]);

        abort_unless(DB::table('orders')->where('id', $order)->exists(), 404);
        DB::table('orders')->where('id', $order)->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Đã cập nhật trạng thái giao hàng.');
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'tag' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'origPrice' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'inStock' => ['required', 'boolean'],
            'img' => ['required', 'image', 'max:5120'],
            'specs' => ['nullable', 'string', 'max:5000'],
        ]);

        $imagePath = $request->file('img')->store('products', 'public');

        try {
            Product::query()->create([
                'name' => $validated['name'],
                'category' => $validated['category'],
                'tag' => $validated['tag'] ?? null,
                'price' => $validated['price'],
                'origPrice' => $validated['origPrice'] ?? null,
                'inStock' => $validated['inStock'],
                'img' => Storage::disk('public')->url($imagePath),
                'specs' => $validated['specs'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($imagePath);
            throw $exception;
        }

        return redirect()->route('admin.dashboard')->with('success', 'Đã thêm sản phẩm mới.');
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['user', 'admin'])],
        ]);

        if ($user->is($request->user()) && $validated['role'] !== 'admin') {
            return back()->withErrors(['role' => 'Bạn không thể tự hạ quyền tài khoản đang đăng nhập.']);
        }

        if ($user->role === 'admin' && $validated['role'] !== 'admin' && $this->isLastAdmin($user)) {
            return back()->withErrors(['role' => 'Không thể hạ quyền quản trị viên cuối cùng.']);
        }

        $user->role = $validated['role'];
        $user->save();

        return redirect()->route('admin.dashboard')->with('success', 'Đã cập nhật quyền người dùng.');
    }

    public function destroyUser(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return back()->withErrors(['user' => 'Bạn không thể xóa tài khoản đang đăng nhập.']);
        }

        if ($user->role === 'admin' && $this->isLastAdmin($user)) {
            return back()->withErrors(['user' => 'Không thể xóa quản trị viên cuối cùng.']);
        }

        if (Schema::hasTable('orders') && DB::table('orders')->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['user' => 'Không thể xóa người dùng đã có đơn hàng.']);
        }

        $user->delete();

        return redirect()->route('admin.dashboard')->with('success', 'Đã xóa tài khoản người dùng.');
    }

    private function isLastAdmin(User $user)
    {
        return ! User::query()
            ->where('role', 'admin')
            ->where('id', '!=', $user->id)
            ->exists();
    }
}

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
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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

        $stockReceipts = DB::table('stock_receipts')
            ->orderByDesc('received_at')
            ->get(['id', 'received_at']);
        $receiptItems = DB::table('stock_receipt_items')
            ->whereIn('stock_receipt_id', $stockReceipts->pluck('id'))
            ->orderBy('id')
            ->get(['stock_receipt_id', 'product_name', 'quantity'])
            ->groupBy('stock_receipt_id');
        $stockReceipts = $stockReceipts->map(function ($receipt) use ($receiptItems) {
            $receipt->items = $receiptItems->get($receipt->id, collect());

            return $receipt;
        });

        return Inertia::render('Dashboard', [
            'products' => Product::query()->orderByDesc('id')->get(),
            'categories' => DB::table('categories')
                ->orderByRaw("CASE slug WHEN 'acoustic' THEN 0 WHEN 'electric' THEN 1 WHEN 'classic' THEN 2 WHEN 'phu-kien' THEN 3 ELSE 4 END")
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'stockReceipts' => $stockReceipts,
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

        DB::transaction(function () use ($order, $validated) {
            $currentOrder = DB::table('orders')
                ->where('id', $order)
                ->lockForUpdate()
                ->first();
            abort_unless($currentOrder, 404);

            $allowedTransitions = [
                'Đang xử lý' => ['Đang giao hàng', 'Đã hủy'],
                'Đang giao hàng' => ['Đã giao'],
                'Đã giao' => [],
                'Đã hủy' => [],
            ];

            if (! in_array($validated['status'], $allowedTransitions[$currentOrder->status] ?? [], true)) {
                throw ValidationException::withMessages([
                    'status' => 'Trạng thái đơn hàng chỉ được chuyển tiếp theo quy trình. Đơn đã giao hoặc đã hủy không thể thay đổi.',
                ]);
            }

            $stockWasDeducted = Schema::hasColumn('orders', 'stock_deducted')
                ? (bool) $currentOrder->stock_deducted
                : false;

            if ($validated['status'] === 'Đã hủy' && $stockWasDeducted && Schema::hasTable('order_details')) {
                $items = DB::table('order_details')
                    ->where('order_id', $order)
                    ->orderBy('product_id')
                    ->get(['product_id', 'quantity']);
                $products = Product::query()
                    ->whereIn('id', $items->pluck('product_id'))
                    ->orderBy('id')
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

            $orderUpdates = ['status' => $validated['status']];
            if ($validated['status'] === 'Đã hủy' && Schema::hasColumn('orders', 'stock_deducted')) {
                $orderUpdates['stock_deducted'] = false;
            }

            DB::table('orders')->where('id', $order)->update($orderUpdates);
        });

        return redirect()->route('admin.dashboard')->with('success', 'Đã cập nhật trạng thái giao hàng.');
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100', Rule::exists('categories', 'name')],
            'tag' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'origPrice' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
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
                'stock_quantity' => 0,
                'inStock' => false,
                'img' => '/storage/' . $imagePath,
                'specs' => $validated['specs'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($imagePath);
            throw $exception;
        }

        return redirect()->route('admin.dashboard')->with('success', 'Đã thêm sản phẩm mới.');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')],
        ]);
        $slug = Str::slug($validated['name']);

        if ($slug === '') {
            return back()->withErrors([
                'name' => 'Tên danh mục cần có ký tự chữ hoặc số để tạo mã danh mục.',
            ]);
        }

        if (DB::table('categories')->where('slug', $slug)->exists()) {
            return back()->withErrors([
                'name' => 'Tên danh mục này trùng mã với một danh mục hiện có.',
            ]);
        }

        DB::table('categories')->insert([
            'name' => trim($validated['name']),
            'slug' => $slug,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Đã thêm danh mục.');
    }

    public function destroyCategory(int $category)
    {
        $categoryRecord = DB::table('categories')->where('id', $category)->first();
        abort_unless($categoryRecord, 404);

        if (Product::query()->where('category', $categoryRecord->name)->exists()) {
            return back()->withErrors([
                'category' => 'Không thể xóa danh mục đang được sản phẩm sử dụng. Hãy chuyển sản phẩm sang danh mục khác trước.',
            ]);
        }

        DB::table('categories')->where('id', $category)->delete();

        return redirect()->route('admin.dashboard')->with('success', 'Đã xóa danh mục.');
    }

    public function storeStockReceipt(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:2147483647'],
        ]);

        DB::transaction(function () use ($validated) {
            $items = collect($validated['items']);
            $products = Product::query()
                ->whereIn('id', $items->pluck('product_id'))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');
            $errors = [];

            foreach ($items as $index => $item) {
                $product = $products->get($item['product_id']);
                if (! $product) {
                    $errors["items.{$index}.product_id"] = 'Sản phẩm không còn tồn tại.';
                } elseif ($product->stock_quantity + $item['quantity'] > 2147483647) {
                    $errors["items.{$index}.quantity"] = 'Số lượng nhập vượt giới hạn tồn kho.';
                }
            }

            if ($errors) {
                throw \Illuminate\Validation\ValidationException::withMessages($errors);
            }

            $now = now();
            $receiptId = DB::table('stock_receipts')->insertGetId([
                'received_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $receiptItems = [];
            foreach ($items as $item) {
                $product = $products->get($item['product_id']);
                $product->stock_quantity += $item['quantity'];
                $product->inStock = $product->stock_quantity > 0;
                $product->save();

                $receiptItems[] = [
                    'stock_receipt_id' => $receiptId,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                ];
            }

            DB::table('stock_receipt_items')->insert($receiptItems);
        });

        return redirect()->route('admin.dashboard')->with('success', 'Đã lập phiếu nhập và cập nhật tồn kho.');
    }

    public function destroyProduct(Product $product)
    {
        if (Schema::hasTable('order_details')
            && DB::table('order_details')->where('product_id', $product->id)->exists()) {
            return back()->withErrors([
                'product' => 'Không thể xóa sản phẩm đã có trong đơn hàng.',
            ]);
        }

        $imagePath = parse_url($product->img, PHP_URL_PATH);
        $storedImagePath = is_string($imagePath) && preg_match('#^/storage/products/[^/]+$#', $imagePath)
            ? substr($imagePath, strlen('/storage/'))
            : null;

        $product->delete();

        if ($storedImagePath !== null) {
            Storage::disk('public')->delete($storedImagePath);
        }

        return redirect()->route('admin.dashboard')->with('success', 'Đã xóa sản phẩm.');
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

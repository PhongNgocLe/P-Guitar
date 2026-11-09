<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VirtualWalletController extends Controller
{
    /**
     * Lấy IP mạng LAN của máy chủ (dành cho điện thoại cùng mạng Wi-Fi quét mã QR)
     */
    protected function getLocalLanIp(): string
    {
        $host = gethostname();
        $ip = gethostbyname($host);

        if ($ip && $ip !== '127.0.0.1' && ! Str::startsWith($ip, '127.')) {
            return $ip;
        }

        return '127.0.0.1';
    }

    /**
     * Màn hình máy tính: Hiển thị mã QR để khách dùng điện thoại quét mở Ví ảo
     */
    public function scan(Request $request, int $order)
    {
        abort_unless(Schema::hasTable('orders'), 500, 'Orders table not configured.');

        $orderRecord = DB::table('orders')->where('id', $order)->first();
        abort_unless($orderRecord, 404, 'Không tìm thấy đơn hàng.');

        $lanIp = $this->getLocalLanIp();
        $port = $request->getPort() ? ':' . $request->getPort() : '';
        $scheme = $request->getScheme();

        // Nếu đang truy cập qua localhost, tạo link bằng IP LAN để điện thoại cùng Wi-Fi quét được
        $host = $request->getHost();
        $isLocalhost = in_array($host, ['localhost', '127.0.0.1', '::1'], true);

        $walletHost = $isLocalhost && $lanIp !== '127.0.0.1' ? "{$scheme}://{$lanIp}{$port}" : $request->root();
        $walletPayUrl = "{$walletHost}/wallet/pay/{$order}";

        $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=15&data=' . urlencode($walletPayUrl);

        return Inertia::render('Payment/WalletScan', [
            'order' => [
                'id' => $orderRecord->id,
                'fullname' => $orderRecord->fullname,
                'phone' => $orderRecord->phone,
                'address' => $orderRecord->address,
                'total_money' => $orderRecord->total_money,
                'payment_status' => $orderRecord->payment_status ?? 'unpaid',
                'payment_method' => $orderRecord->payment_method ?? 'Ví P-Pay',
                'created_at' => $orderRecord->created_at,
            ],
            'walletPayUrl' => $walletPayUrl,
            'qrImageUrl' => $qrImageUrl,
            'lanIp' => $lanIp,
        ]);
    }

    /**
     * Giao diện App Ví Điện Tử P-Pay (Mô phỏng ứng dụng Smartphone)
     */
    public function pay(Request $request, int $order)
    {
        abort_unless(Schema::hasTable('orders'), 500, 'Orders table not configured.');

        $orderRecord = DB::table('orders')->where('id', $order)->first();
        abort_unless($orderRecord, 404, 'Không tìm thấy đơn hàng.');

        return Inertia::render('Payment/VirtualWallet', [
            'order' => [
                'id' => $orderRecord->id,
                'fullname' => $orderRecord->fullname,
                'phone' => $orderRecord->phone,
                'total_money' => $orderRecord->total_money,
                'payment_status' => $orderRecord->payment_status ?? 'unpaid',
                'vnp_transaction_no' => $orderRecord->vnp_transaction_no ?? null,
                'created_at' => $orderRecord->created_at,
            ],
        ]);
    }

    /**
     * Xử lý trừ tiền ví ảo và kích hoạt trạng thái "Đã thanh toán"
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer'],
            'pin' => ['required', 'string', 'size:6'],
        ]);

        if ($validated['pin'] !== '123456') {
            return response()->json([
                'success' => false,
                'message' => 'Mã PIN ví ảo không chính xác! (Mã mặc định thử nghiệm: 123456)',
            ], 422);
        }

        $order = DB::table('orders')->where('id', $validated['order_id'])->first();
        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không tồn tại.',
            ], 404);
        }

        if (($order->payment_status ?? '') === 'paid') {
            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng này đã được thanh toán trước đó.',
                'transaction_no' => $order->vnp_transaction_no,
            ]);
        }

        $transactionNo = 'PPAY_' . strtoupper(Str::random(8));

        DB::table('orders')->where('id', $order->id)->update([
            'payment_status' => 'paid',
            'payment_method' => 'Ví P-Pay',
            'vnp_transaction_no' => $transactionNo,
            'vnp_bank_code' => 'VÍ ĐIỆN TỬ P-PAY',
            'paid_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thanh toán đơn hàng thành công qua Ví P-Pay!',
            'transaction_no' => $transactionNo,
            'order_id' => $order->id,
            'amount' => $order->total_money,
        ]);
    }

    /**
     * API Polling để màn hình máy tính tự động phát hiện đơn đã thanh toán
     */
    public function checkStatus(int $order)
    {
        $orderRecord = DB::table('orders')->where('id', $order)->first(['id', 'payment_status', 'vnp_transaction_no']);
        if (! $orderRecord) {
            return response()->json(['status' => 'not_found'], 404);
        }

        return response()->json([
            'id' => $orderRecord->id,
            'payment_status' => $orderRecord->payment_status ?? 'unpaid',
            'transaction_no' => $orderRecord->vnp_transaction_no ?? null,
        ]);
    }
}

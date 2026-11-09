<?php

namespace App\Http\Controllers;

use App\Services\VnpayService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $vnpayService;

    public function __construct(VnpayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    /**
     * Xử lý khi khách hàng quay lại website từ cổng VNPAY (Return URL)
     */
    public function vnpayReturn(Request $request)
    {
        $allParams = $request->all();
        $isValidSignature = $this->vnpayService->validateSignature($allParams);

        $orderId = $request->query('vnp_TxnRef');
        $responseCode = $request->query('vnp_ResponseCode');
        $transactionNo = $request->query('vnp_TransactionNo');
        $bankCode = $request->query('vnp_BankCode');
        $amount = $request->query('vnp_Amount') ? ((int) $request->query('vnp_Amount')) / 100 : 0;
        $payDateStr = $request->query('vnp_PayDate');

        $paidAt = null;
        if ($payDateStr && strlen($payDateStr) === 14) {
            try {
                $paidAt = Carbon::createFromFormat('YmdHis', $payDateStr);
            } catch (\Exception $e) {
                $paidAt = now();
            }
        } else {
            $paidAt = now();
        }

        $order = null;
        if ($orderId && Schema::hasTable('orders')) {
            $order = DB::table('orders')->where('id', $orderId)->first();
        }

        $isSuccess = $isValidSignature && $responseCode === '00';

        if ($isSuccess && $order) {
            $updates = [
                'payment_status' => 'paid',
                'vnp_transaction_no' => $transactionNo,
                'vnp_bank_code' => $bankCode,
                'paid_at' => $paidAt,
            ];
            DB::table('orders')->where('id', $orderId)->update($updates);
        } elseif (! $isSuccess && $order && ($order->payment_status ?? '') !== 'paid') {
            DB::table('orders')->where('id', $orderId)->update([
                'payment_status' => 'failed',
            ]);
        }

        $message = $isSuccess
            ? 'Thanh toán đơn hàng thành công qua cổng VNPAY!'
            : ($responseCode === '24' ? 'Giao dịch bị hủy bởi khách hàng.' : 'Giao dịch thanh toán không thành công.');

        return Inertia::render('Payment/Result', [
            'success' => $isSuccess,
            'orderId' => $orderId,
            'message' => $message,
            'transactionNo' => $transactionNo,
            'bankCode' => $bankCode,
            'amount' => $amount,
            'order' => $order ? [
                'id' => $order->id,
                'fullname' => $order->fullname,
                'phone' => $order->phone,
                'address' => $order->address,
                'total_money' => $order->total_money,
                'payment_status' => $isSuccess ? 'paid' : 'failed',
            ] : null,
        ]);
    }

    /**
     * Nhận IPN Webhook ngầm từ server VNPAY (Server to Server)
     */
    public function vnpayIpn(Request $request)
    {
        $inputData = $request->all();
        Log::info('VNPAY IPN Request:', $inputData);

        $isValidSignature = $this->vnpayService->validateSignature($inputData);
        if (! $isValidSignature) {
            return response()->json([
                'RspCode' => '97',
                'Message' => 'Invalid signature',
            ]);
        }

        $orderId = $inputData['vnp_TxnRef'] ?? null;
        $amount = isset($inputData['vnp_Amount']) ? ((int) $inputData['vnp_Amount']) / 100 : 0;
        $responseCode = $inputData['vnp_ResponseCode'] ?? null;

        if (! Schema::hasTable('orders') || ! $orderId) {
            return response()->json([
                'RspCode' => '01',
                'Message' => 'Order not found',
            ]);
        }

        $order = DB::table('orders')->where('id', $orderId)->first();
        if (! $order) {
            return response()->json([
                'RspCode' => '01',
                'Message' => 'Order not found',
            ]);
        }

        // Kiểm tra số tiền khớp với đơn hàng
        if ((int) round($order->total_money) !== (int) round($amount)) {
            return response()->json([
                'RspCode' => '04',
                'Message' => 'Invalid amount',
            ]);
        }

        // Đơn đã thanh toán trước đó
        if (($order->payment_status ?? '') === 'paid') {
            return response()->json([
                'RspCode' => '02',
                'Message' => 'Order already confirmed',
            ]);
        }

        if ($responseCode === '00') {
            DB::table('orders')->where('id', $orderId)->update([
                'payment_status' => 'paid',
                'vnp_transaction_no' => $inputData['vnp_TransactionNo'] ?? null,
                'vnp_bank_code' => $inputData['vnp_BankCode'] ?? null,
                'paid_at' => now(),
            ]);
        } else {
            DB::table('orders')->where('id', $orderId)->update([
                'payment_status' => 'failed',
            ]);
        }

        return response()->json([
            'RspCode' => '00',
            'Message' => 'Confirm Success',
        ]);
    }
}

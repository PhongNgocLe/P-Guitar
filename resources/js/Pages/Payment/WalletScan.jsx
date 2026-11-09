import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

export default function WalletScan({
    order = {},
    walletPayUrl = '',
    qrImageUrl = '',
    lanIp = '127.0.0.1',
}) {
    const [timeLeft, setTimeLeft] = useState(900); // 15 phút đếm ngược
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status || 'unpaid');
    const [transactionNo, setTransactionNo] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';

    // Đếm ngược thời gian hết hạn thanh toán
    useEffect(() => {
        if (paymentStatus === 'paid' || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [paymentStatus, timeLeft]);

    // Polling tự động kiểm tra trạng thái thanh toán từ Server mỗi 2 giây
    useEffect(() => {
        if (paymentStatus === 'paid') return;

        const interval = setInterval(async () => {
            try {
                setIsChecking(true);
                const res = await axios.get(`/api/orders/${order.id}/payment-status`);
                if (res.data?.payment_status === 'paid') {
                    setPaymentStatus('paid');
                    setTransactionNo(res.data.transaction_no);
                    clearInterval(interval);
                }
            } catch (err) {
                // Ignore polling errors
            } finally {
                setIsChecking(false);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [order.id, paymentStatus]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="min-h-screen bg-[#0B0B0B] px-4 py-8 sm:px-6 sm:py-12 text-[#F4F0E8] font-['Inter',sans-serif]">
            <Head title="Thanh toán qua Ví điện tử P-Pay" />

            <main className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F4F0E8] transition-colors">
                        ← Về trang chủ P-Guitar
                    </Link>
                    <span className="text-xs text-[#9B9B9B]">
                        Mã đơn: <strong className="text-[#D4AF37]">#{order.id}</strong>
                    </span>
                </div>

                <div className="border border-white/10 bg-[#141414] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
                    {/* Header line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#996515]" />

                    {paymentStatus === 'paid' ? (
                        /* GIAO DIỆN THANH TOÁN THÀNH CÔNG (TỰ ĐỘNG CHUYỂN KHI BẤM TRÊN ĐIỆN THOẠI) */
                        <div className="py-10 text-center animate-fadeIn">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="mt-6 text-xs uppercase tracking-[0.3em] font-semibold text-emerald-400">
                                XÁC NHẬN THANH TOÁN THÀNH CÔNG!
                            </p>
                            <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Cảm ơn bạn đã mua sắm tại P-Guitar
                            </h1>
                            <p className="mt-3 text-sm text-[#9B9B9B] max-w-md mx-auto">
                                Đơn hàng <strong className="text-white">#{order.id}</strong> đã được thanh toán hoàn tất qua <strong className="text-[#D4AF37]">Ví điện tử P-Pay</strong>.
                            </p>

                            <div className="mt-8 mx-auto max-w-md border border-white/10 bg-[#0B0B0B] p-5 text-left text-xs space-y-2.5 rounded">
                                <div className="flex justify-between">
                                    <span className="text-[#9B9B9B]">Mã giao dịch ví:</span>
                                    <span className="font-mono text-[#E6C76A] font-semibold">{transactionNo || 'PPAY_SUCCESS'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#9B9B9B]">Số tiền thanh toán:</span>
                                    <span className="font-semibold text-[#D4AF37] text-sm">{formatVND(order.total_money)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#9B9B9B]">Người nhận:</span>
                                    <span className="text-white">{order.fullname} ({order.phone})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#9B9B9B]">Trạng thái:</span>
                                    <span className="text-emerald-400 font-semibold uppercase">Đã thanh toán · Chờ giao</span>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:opacity-90 transition-opacity"
                                >
                                    Tiếp tục mua hàng
                                </Link>
                                <Link
                                    href="/account"
                                    className="border border-white/20 px-8 py-3.5 text-xs uppercase tracking-widest text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                                >
                                    Xem tài khoản
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* GIAO DIỆN CHỜ QUÉT MÃ QR */
                        <div>
                            <div className="text-center mb-8">
                                <span className="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-3">
                                    Cổng Ví Điện Tử P-Pay Simulator
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Quét Mã QR Để Thanh Toán
                                </h1>
                                <p className="text-xs text-[#9B9B9B] mt-1.5">
                                    Mở Camera điện thoại hoặc App quét QR để mở Ví P-Pay và hoàn tất trừ tiền ảo.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center border border-white/10 bg-[#0B0B0B] p-6 sm:p-8 rounded-lg">
                                {/* Cột Trái: Ảnh QR Code */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative p-3 bg-white rounded-xl shadow-2xl border-4 border-[#D4AF37]">
                                        <img
                                            src={qrImageUrl}
                                            alt="QR Ví P-Pay"
                                            className="w-56 h-56 object-contain"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-[#111] text-[#D4AF37] border border-[#D4AF37] rounded-full px-2 py-0.5 text-[10px] font-bold shadow">
                                                P-PAY
                                            </div>
                                        </div>
                                    </div>

                                    {/* Đồng hồ đếm ngược */}
                                    <div className="mt-4 flex items-center space-x-2 text-xs text-[#9B9B9B]">
                                        <span>Giao dịch hết hạn sau:</span>
                                        <span className="font-mono text-sm font-bold text-[#E6C76A]">{formattedTime}</span>
                                    </div>

                                    <div className="mt-2 flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                        <span className="text-[11px] text-emerald-400">
                                            Đang chờ tín hiệu quét từ điện thoại...
                                        </span>
                                    </div>
                                </div>

                                {/* Cột Phải: Thông tin đơn hàng & Lựa chọn mở trực tiếp */}
                                <div className="space-y-4 text-xs border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                                    <div className="pb-3 border-b border-white/10">
                                        <p className="text-[#9B9B9B]">Tổng số tiền cần thanh toán</p>
                                        <p className="text-2xl font-bold text-[#D4AF37] mt-1">{formatVND(order.total_money)}</p>
                                    </div>

                                    <div className="space-y-2 text-[#B8B1A2]">
                                        <p><strong className="text-[#F4F0E8]">Đơn hàng:</strong> #{order.id}</p>
                                        <p><strong className="text-[#F4F0E8]">Khách hàng:</strong> {order.fullname}</p>
                                        <p><strong className="text-[#F4F0E8]">Số điện thoại:</strong> {order.phone}</p>
                                        <p><strong className="text-[#F4F0E8]">Địa chỉ:</strong> {order.address}</p>
                                    </div>

                                    {/* Hướng dẫn test */}
                                    <div className="p-3.5 bg-[#151515] border border-white/10 rounded space-y-1.5 text-[11px] text-[#9B9B9B]">
                                        <p className="font-semibold text-[#E6C76A]">📱 Hướng dẫn thử nghiệm đồ án:</p>
                                        <p>• <strong>Cách 1:</strong> Dùng điện thoại kết nối chung Wi-Fi, mở camera quét mã QR bên cạnh.</p>
                                        <p>• <strong>Cách 2 (Tiện lợi):</strong> Bấm nút bên dưới để mở giao diện App Ví P-Pay ngay trên máy tính này.</p>
                                    </div>

                                    {/* Nút mở trực tiếp không cần điện thoại */}
                                    <a
                                        href={`/wallet/pay/${order.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 border border-[#D4AF37]/60 bg-[#D4AF37]/10 py-3 text-xs uppercase tracking-wider text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
                                    >
                                        <span>📲 Mở App Ví P-Pay trên máy tính này →</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

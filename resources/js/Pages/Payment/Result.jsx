import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PaymentResult({
    success = false,
    orderId = null,
    message = '',
    transactionNo = null,
    bankCode = null,
    amount = 0,
    order = null,
}) {
    // Xóa giỏ hàng nếu thanh toán thành công
    useEffect(() => {
        if (success) {
            try {
                window.localStorage.removeItem('pguitar-cart');
            } catch (e) {
                // ignore
            }
        }
    }, [success]);

    const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';

    return (
        <div className="min-h-screen bg-[#0B0B0B] px-6 py-12 text-[#F4F0E8] font-['Inter',sans-serif]">
            <Head title={success ? 'Thanh toán thành công' : 'Thanh toán thất bại'} />

            <main className="mx-auto max-w-2xl">
                <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F4F0E8] transition-colors">
                    ← Về trang chủ P-Guitar
                </Link>

                <div className="mt-8 border border-white/10 bg-[#151515] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Đường viền ánh kim phía trên */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${success ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]' : 'bg-red-500'}`} />

                    <div className="text-center py-4">
                        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 ${
                            success ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-red-500 bg-red-500/10 text-red-400'
                        }`}>
                            {success ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        <p className={`mt-5 text-xs uppercase tracking-[0.25em] font-semibold ${success ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                            {success ? 'GIAO DỊCH VNPAY THÀNH CÔNG' : 'GIAO DỊCH KHÔNG THÀNH CÔNG'}
                        </p>

                        <h1 className="mt-2 text-2xl sm:text-3xl text-[#F4F0E8]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {success ? 'Cảm ơn bạn đã thanh toán' : 'Thanh toán chưa hoàn tất'}
                        </h1>

                        <p className="mt-2 text-xs sm:text-sm text-[#9B9B9B] max-w-md mx-auto">
                            {message}
                        </p>
                    </div>

                    {/* Chi tiết giao dịch */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <h2 className="text-xs uppercase tracking-widest text-[#B8B1A2] mb-4">Chi tiết giao dịch</h2>
                        <dl className="divide-y divide-white/5 text-sm">
                            {orderId && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-xs text-[#9B9B9B]">Mã đơn hàng</dt>
                                    <dd className="font-semibold text-[#D4AF37]">#{orderId}</dd>
                                </div>
                            )}

                            {amount > 0 && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-xs text-[#9B9B9B]">Số tiền thanh toán</dt>
                                    <dd className="font-semibold text-[#F4F0E8]">{formatVND(amount)}</dd>
                                </div>
                            )}

                            {transactionNo && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-xs text-[#9B9B9B]">Mã giao dịch VNPAY</dt>
                                    <dd className="font-mono text-xs text-[#E6C76A]">{transactionNo}</dd>
                                </div>
                            )}

                            {bankCode && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-xs text-[#9B9B9B]">Ngân hàng thực hiện</dt>
                                    <dd className="text-xs text-[#F4F0E8] font-medium">{bankCode}</dd>
                                </div>
                            )}

                            <div className="flex justify-between py-3">
                                <dt className="text-xs text-[#9B9B9B]">Cổng thanh toán</dt>
                                <dd className="text-xs text-[#008FE5] font-semibold">VNPAY Sandbox (NCB / QR)</dd>
                            </div>

                            {order && (
                                <>
                                    <div className="flex justify-between py-3">
                                        <dt className="text-xs text-[#9B9B9B]">Người nhận</dt>
                                        <dd className="text-xs text-[#F4F0E8]">{order.fullname} ({order.phone})</dd>
                                    </div>
                                    <div className="flex justify-between py-3">
                                        <dt className="text-xs text-[#9B9B9B]">Địa chỉ giao</dt>
                                        <dd className="text-xs text-[#B8B1A2] max-w-xs text-right truncate">{order.address}</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>

                    {/* Nút điều hướng */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-white/10 pt-6">
                        <Link
                            href="/"
                            className="flex-1 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] py-3 text-center text-xs font-bold uppercase tracking-widest text-black transition hover:opacity-95"
                        >
                            Tiếp tục mua sắm
                        </Link>
                        {!success ? (
                            <Link
                                href="/?checkout=1"
                                className="flex-1 border border-[#D4AF37]/50 py-3 text-center text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                Thử đặt hàng lại
                            </Link>
                        ) : (
                            <Link
                                href="/account"
                                className="flex-1 border border-white/20 py-3 text-center text-xs uppercase tracking-widest text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                            >
                                Xem tài khoản
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

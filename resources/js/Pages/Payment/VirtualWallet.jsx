import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function VirtualWallet({ order = {} }) {
    const [balance, setBalance] = useState(50000000); // 50 triệu đồng ví ảo
    const [pin, setPin] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(order.payment_status === 'paid');
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionResult, setTransactionResult] = useState(null);

    const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';
    const amount = Number(order.total_money || 0);

    const handleKeyPress = (num) => {
        if (pin.length < 6) {
            setPin((prev) => prev + num);
            setErrorMessage('');
        }
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
        setErrorMessage('');
    };

    const submitPayment = async (overridePin = null) => {
        const finalPin = overridePin || pin;
        if (finalPin.length !== 6) {
            setErrorMessage('Vui lòng nhập đủ 6 chữ số mã PIN (mặc định: 123456)');
            return;
        }

        if (balance < amount) {
            setErrorMessage('Số dư ví ảo không đủ để thanh toán. Vui lòng bấm "Nạp thêm tiền ảo" bên trên.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const res = await axios.post('/api/wallet/process', {
                order_id: order.id,
                pin: finalPin,
            });

            if (res.data?.success) {
                setBalance((prev) => Math.max(0, prev - amount));
                setIsSuccess(true);
                setTransactionResult(res.data);
            } else {
                setErrorMessage(res.data?.message || 'Giao dịch thất bại.');
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý ví ảo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const topUpVirtualBalance = () => {
        setBalance((prev) => prev + 50000000);
        setErrorMessage('');
    };

    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center p-3 sm:p-6 font-['Inter',sans-serif] text-[#F4F0E8]">
            <Head title={`Ví Điện Tử P-Pay · Thanh toán đơn #${order.id}`} />

            {/* Khung mô phỏng Smartphone cực đẹp */}
            <div className="w-full max-w-sm rounded-[40px] border-4 border-[#2A2A2A] bg-[#121212] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden relative">
                {/* Loa thoại & Camera trước */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#2A2A2A] rounded-full z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#181818] mr-2" />
                    <div className="w-10 h-1 bg-[#181818] rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="pt-7 px-6 pb-2 flex justify-between items-center text-[11px] text-[#888] font-medium select-none">
                    <span>19:45</span>
                    <div className="flex items-center space-x-1.5">
                        <span>5G</span>
                        <div className="w-4 h-2.5 border border-[#888] rounded-sm p-0.5 flex items-center">
                            <div className="h-full w-full bg-emerald-400 rounded-2xs" />
                        </div>
                    </div>
                </div>

                {/* Header App Ví P-Pay */}
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#996515] flex items-center justify-center font-serif font-bold text-black text-xs">
                            P
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-wider text-[#F4F0E8]">VÍ P-PAY</p>
                            <p className="text-[9px] text-[#888]">Ví Điện Tử Thử Nghiệm</p>
                        </div>
                    </div>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                        Trực tuyến
                    </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                    {/* Thẻ Ví Ảo Sang Trọng */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-[#1E1E1E] via-[#2A2416] to-[#121212] p-4 border border-[#D4AF37]/30 shadow-lg overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-[#D4AF37]/10 blur-xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-[#B8B1A2]">Số dư ví ảo</p>
                                <p className="text-xl font-bold text-[#E6C76A] mt-0.5 font-mono">
                                    {formatVND(balance)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={topUpVirtualBalance}
                                className="text-[10px] uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-1 rounded hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                + Nạp tiền
                            </button>
                        </div>

                        <div className="mt-4 flex justify-between items-end text-[10px] text-[#888]">
                            <span className="font-mono tracking-wider">**** **** **** 8888</span>
                            <span className="text-[#D4AF37] font-semibold">P-GUITAR MEMBER</span>
                        </div>
                    </div>

                    {isSuccess ? (
                        /* MÀN HÌNH BIÊN LAI THÀNH CÔNG */
                        <div className="py-4 text-center space-y-3 animate-fadeIn">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 text-2xl">
                                ✓
                            </div>
                            <h2 className="text-base font-bold text-[#F4F0E8]">THANH TOÁN THÀNH CÔNG!</h2>
                            <p className="text-xs text-[#9B9B9B]">
                                Đã trừ <strong className="text-[#D4AF37]">{formatVND(amount)}</strong> từ số dư ví ảo P-Pay.
                            </p>

                            <div className="border border-white/10 bg-[#161616] p-3 rounded-xl text-left text-xs space-y-1.5 text-[#B8B1A2]">
                                <div className="flex justify-between">
                                    <span>Mã đơn hàng:</span>
                                    <strong className="text-white">#{order.id}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mã giao dịch:</span>
                                    <strong className="font-mono text-[#E6C76A]">{transactionResult?.transaction_no || order.vnp_transaction_no || 'PPAY_SUCCESS'}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Người nhận:</span>
                                    <span className="text-white">P-Guitar Official</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span className="text-white">Vừa xong</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-emerald-400/90 pt-1">
                                ✓ Màn hình máy tính của bạn đã được cập nhật sang Đặt hàng thành công!
                            </p>

                            <Link
                                href="/"
                                className="block w-full py-3 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] text-black font-bold text-xs uppercase tracking-widest rounded-xl text-center shadow-lg"
                            >
                                Hoàn tất & Về trang chủ
                            </Link>
                        </div>
                    ) : (
                        /* MÀN HÌNH XÁC NHẬN THANH TOÁN VÀ BÀN PHÍM PIN */
                        <div className="space-y-3.5">
                            {/* Chi tiết đơn hàng */}
                            <div className="border border-white/10 bg-[#181818] p-3 rounded-xl text-xs space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-[#888]">Thanh toán đơn:</span>
                                    <strong className="text-[#D4AF37]">#{order.id}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#888]">Đơn vị nhận:</span>
                                    <span className="text-[#F4F0E8]">P-Guitar Việt Nam</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-white/5 text-sm">
                                    <span className="text-[#888]">Số tiền trừ:</span>
                                    <strong className="text-[#D4AF37] font-bold">{formatVND(amount)}</strong>
                                </div>
                            </div>

                            {/* Ô nhập mã PIN (6 dấu chấm) */}
                            <div className="text-center pt-1">
                                <p className="text-[11px] text-[#B8B1A2] mb-2">Nhập mã PIN ví (Mặc định: <strong className="text-[#E6C76A]">123456</strong>)</p>
                                <div className="flex justify-center space-x-2.5">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-7 h-8 rounded border flex items-center justify-center text-sm font-bold ${
                                                pin[i]
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                                                    : 'border-white/20 bg-[#0B0B0B]'
                                            }`}
                                        >
                                            {pin[i] ? '•' : ''}
                                        </div>
                                    ))}
                                </div>
                                {errorMessage && (
                                    <p className="mt-1.5 text-[11px] text-red-400 animate-shake">{errorMessage}</p>
                                )}
                            </div>

                            {/* Bàn phím số điện thoại ảo */}
                            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-bold text-sm">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => handleKeyPress(String(n))}
                                        className="h-10 rounded-lg bg-[#1E1E1E] text-white hover:bg-[#2A2A2A] active:bg-[#D4AF37] active:text-black transition-colors"
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => submitPayment('123456')}
                                    className="h-10 rounded-lg bg-[#2A2210] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-semibold uppercase hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center justify-center"
                                >
                                    Auto PIN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleKeyPress('0')}
                                    className="h-10 rounded-lg bg-[#1E1E1E] text-white hover:bg-[#2A2A2A] active:bg-[#D4AF37] active:text-black transition-colors"
                                >
                                    0
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="h-10 rounded-lg bg-[#1E1E1E] text-red-400 hover:bg-[#2A2A2A] active:bg-red-500 active:text-white transition-colors flex items-center justify-center"
                                >
                                    ⌫
                                </button>
                            </div>

                            {/* Nút bấm xác nhận */}
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => submitPayment()}
                                className="w-full py-3 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md"
                            >
                                {isProcessing ? 'Đang xử lý trừ tiền ví…' : 'Xác nhận thanh toán ngay'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Thanh Home Bar dưới cùng của điện thoại */}
                <div className="py-2 flex justify-center">
                    <div className="w-24 h-1 bg-white/20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

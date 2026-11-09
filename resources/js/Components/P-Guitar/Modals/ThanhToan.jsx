import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

const fieldClass = 'mt-2 w-full border border-white/15 bg-[#0B0B0B] px-4 py-3 text-sm text-[#F4F0E8] outline-none transition focus:border-[#D4AF37]';
const paymentMethods = [
    {
        id: 'P-PAY',
        name: 'Ví điện tử ảo P-Pay (Quét QR - Mô phỏng chuẩn Luận văn)',
        short: 'P-PAY',
        detail: 'Hệ thống sinh mã QR ví điện tử. Bạn có thể dùng điện thoại quét mã hoặc mở app ví ảo nhập mã PIN 123456 để trừ tiền và tự động hoàn tất đơn hàng trong tích tắc!',
        highlight: true,
        tag: 'Khuyên dùng bảo vệ LVTN',
    },
    {
        id: 'QR Pay',
        name: 'Chuyển khoản VietQR (Vietcombank - Quét bằng mọi App Ngân hàng)',
        short: 'QR Pay',
        detail: 'Hiển thị mã QR chuẩn Napas 24/7. Bạn có thể mở bất kỳ app ngân hàng thật nào (Vietcombank, MB, Techcombank, MoMo...) để chuyển tiền.',
    },
    {
        id: 'VNPAY',
        name: 'Cổng VNPAY (Thẻ ATM Test Sandbox & Cổng Quốc gia)',
        short: 'VNPAY',
        detail: 'Chuyển hướng đến cổng thanh toán VNPAY Sandbox để dùng thẻ ngân hàng thử nghiệm (NCB, Agribank...).',
    },
    {
        id: 'COD',
        name: 'Thanh toán khi nhận hàng (COD)',
        short: 'COD',
        detail: 'Thanh toán trực tiếp bằng tiền mặt cho nhân viên giao hàng khi nhận đàn.',
    },
];

export default function ThanhToan({ isOpen, onClose, cart, setCart, auth, formatVND }) {
    const [orderComplete, setOrderComplete] = useState(false);
    const form = useForm({
        fullname: auth?.user?.fullname || auth?.user?.name || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || '',
        note: '',
        payment_method: 'P-PAY',
        items: [],
    });

    useEffect(() => {
        form.setData('items', cart.map((item) => ({
            product_id: item.id,
            quantity: item.qty,
        })));
    }, [cart]);

    if (!isOpen) return null;

    const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const selectedMethod = paymentMethods.find((method) => method.id === form.data.payment_method);

    const closeCheckout = () => {
        setOrderComplete(false);
        onClose();
    };

    const submitOrder = (event) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            items: cart.map((item) => ({ product_id: item.id, quantity: item.qty })),
        }));

        if (form.data.payment_method === 'VNPAY' || form.data.payment_method === 'P-PAY') {
            window.localStorage.removeItem('pguitar-cart');
        }

        form.post(route('checkout.store'), {
            preserveScroll: true,
            onSuccess: () => {
                window.localStorage.removeItem('pguitar-cart');
                setCart([]);
                setOrderComplete(true);
                form.reset('note');
            },
        });
    };

    const vietQrUrl = `https://img.vietqr.io/image/VCB-1023025258-compact2.png?amount=${total}&addInfo=${encodeURIComponent('PGUITAR ' + (form.data.phone || 'DH'))}`;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button type="button" aria-label="Đóng thanh toán" className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm" onClick={closeCheckout} />
            <div className="relative mx-auto my-6 w-[calc(100%-2rem)] max-w-3xl border border-[#D4AF37]/30 bg-[#111111] p-5 shadow-2xl sm:my-10 sm:p-8">
                <div className="flex items-start justify-between border-b border-white/10 pb-5">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">P-Guitar · Thanh toán</p>
                        <h2 id="checkout-title" className="mt-2 text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {orderComplete ? 'Đặt hàng thành công' : 'Thông tin đặt hàng'}
                        </h2>
                    </div>
                    <button type="button" aria-label="Đóng" onClick={closeCheckout} className="px-2 text-xl text-[#9B9B9B] hover:text-white">×</button>
                </div>

                {orderComplete ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37] text-2xl text-[#D4AF37]">✓</div>
                        <p className="mt-4 text-lg text-[#F4F0E8]">Cảm ơn bạn đã đặt hàng tại P-Guitar.</p>
                        <p className="mt-1 text-sm text-[#9B9B9B]">Đơn hàng đã được ghi nhận vào hệ thống thành công.</p>

                        {form.data.payment_method === 'QR Pay' && (
                            <div className="mt-6 mx-auto max-w-sm border border-[#D4AF37]/40 bg-[#151515] p-5 text-left shadow-xl">
                                <p className="text-center text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3">Mã VietQR chuyển khoản (Vietcombank)</p>
                                <img
                                    src={vietQrUrl}
                                    alt="VietQR Vietcombank"
                                    className="mx-auto w-48 h-auto rounded border border-white/20 bg-white p-2 shadow-lg"
                                />
                                <div className="mt-4 space-y-1.5 text-xs text-[#B8B1A2]">
                                    <p><span className="text-[#9B9B9B]">Ngân hàng:</span> <strong className="text-white">Vietcombank (VCB)</strong></p>
                                    <p><span className="text-[#9B9B9B]">Số tài khoản:</span> <strong className="font-mono text-[#E6C76A]">1023025258</strong></p>
                                    <p><span className="text-[#9B9B9B]">Số tiền:</span> <strong className="font-semibold text-[#D4AF37]">{formatVND(total)}</strong></p>
                                    <p><span className="text-[#9B9B9B]">Nội dung CK:</span> <strong className="font-mono text-[#E6C76A]">PGUITAR {form.data.phone || 'DH'}</strong></p>
                                </div>
                            </div>
                        )}

                        <button type="button" onClick={closeCheckout} className="mt-7 bg-[#D4AF37] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-[#E6C76A]">
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submitOrder} className="mt-6 grid gap-7 md:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            {!auth?.user && (
                                <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 text-sm leading-6 text-[#B8B1A2]">
                                    Vui lòng <Link href={route('login')} className="text-[#E6C76A] underline">đăng nhập</Link> hoặc <Link href={route('register')} className="text-[#E6C76A] underline">tạo tài khoản</Link> để đặt hàng. Giỏ hàng sẽ được giữ lại.
                                </div>
                            )}
                            <div>
                                <label htmlFor="checkout-fullname" className="text-xs uppercase tracking-wider text-[#B8B1A2]">Họ và tên người nhận *</label>
                                <input id="checkout-fullname" className={fieldClass} autoComplete="name" maxLength="100" required value={form.data.fullname} onChange={(event) => form.setData('fullname', event.target.value)} />
                                {form.errors.fullname && <p className="mt-1 text-xs text-red-400">{form.errors.fullname}</p>}
                            </div>
                            <div>
                                <label htmlFor="checkout-phone" className="text-xs uppercase tracking-wider text-[#B8B1A2]">Số điện thoại *</label>
                                <input id="checkout-phone" type="tel" className={fieldClass} autoComplete="tel" maxLength="20" required value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} />
                                {form.errors.phone && <p className="mt-1 text-xs text-red-400">{form.errors.phone}</p>}
                            </div>
                            <div>
                                <label htmlFor="checkout-address" className="text-xs uppercase tracking-wider text-[#B8B1A2]">Địa chỉ nhận hàng *</label>
                                <textarea id="checkout-address" className={`${fieldClass} min-h-20`} autoComplete="street-address" maxLength="255" required value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} />
                                {form.errors.address && <p className="mt-1 text-xs text-red-400">{form.errors.address}</p>}
                            </div>
                            <div>
                                <label htmlFor="checkout-note" className="text-xs uppercase tracking-wider text-[#B8B1A2]">Ghi chú</label>
                                <textarea id="checkout-note" className={`${fieldClass} min-h-16`} maxLength="1000" value={form.data.note} onChange={(event) => form.setData('note', event.target.value)} />
                                {form.errors.note && <p className="mt-1 text-xs text-red-400">{form.errors.note}</p>}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#B8B1A2]">Phương thức thanh toán</p>
                                <div className="mt-3 space-y-2">
                                    {paymentMethods.map((method) => (
                                        <label key={method.id} className={`flex cursor-pointer items-center gap-3 border p-3 transition ${form.data.payment_method === method.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/30'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.id}
                                                checked={form.data.payment_method === method.id}
                                                onChange={(event) => form.setData('payment_method', event.target.value)}
                                                className="h-4 w-4 accent-[#D4AF37]"
                                            />
                                            <span className={`flex h-9 w-16 shrink-0 items-center justify-center border text-[11px] font-bold ${
                                                method.id === 'P-PAY'
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                                                    : method.id === 'VNPAY'
                                                        ? 'border-[#005BAA] bg-[#005BAA]/20 text-[#008FE5]'
                                                        : method.id === 'QR Pay'
                                                            ? 'border-emerald-600 bg-emerald-950/40 text-emerald-400'
                                                            : 'border-white/10 bg-[#0B0B0B] text-[#D4AF37]'
                                            }`}>
                                                {method.short}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-[#F4F0E8]">{method.name}</p>
                                                {method.tag && (
                                                    <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                                                        ✦ {method.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {form.errors.payment_method && <p className="mt-1 text-xs text-red-400">{form.errors.payment_method}</p>}

                                {selectedMethod && (
                                    <div className="mt-3 border border-white/10 bg-[#0B0B0B] p-3 text-xs leading-5 text-[#9B9B9B]">
                                        {selectedMethod.id === 'P-PAY' ? (
                                            <div className="space-y-1">
                                                <p className="text-[#D4AF37] font-semibold text-xs">✨ Ví ảo P-Pay (Thử nghiệm 0đ - Tiền test 50.000.000đ)</p>
                                                <p>{selectedMethod.detail}</p>
                                            </div>
                                        ) : selectedMethod.id === 'QR Pay' ? (
                                            <div className="space-y-3">
                                                <p className="text-emerald-400 font-semibold text-xs">⚡ Quét mã VietQR chuyển khoản (Vietcombank)</p>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 border border-white/10 bg-[#151515] p-3 rounded">
                                                    <img
                                                        src={vietQrUrl}
                                                        alt="VietQR Vietcombank"
                                                        className="w-36 h-auto rounded bg-white p-1.5 shadow shrink-0"
                                                    />
                                                    <div className="space-y-1.5 text-xs text-[#B8B1A2] text-left">
                                                        <p><span className="text-[#9B9B9B]">Ngân hàng:</span> <strong className="text-white">Vietcombank (VCB)</strong></p>
                                                        <p><span className="text-[#9B9B9B]">Số TK:</span> <strong className="font-mono text-[#E6C76A]">1023025258</strong></p>
                                                        <p><span className="text-[#9B9B9B]">Số tiền:</span> <strong className="text-[#D4AF37]">{formatVND(total)}</strong></p>
                                                        <p><span className="text-[#9B9B9B]">Nội dung:</span> <strong className="font-mono text-[#E6C76A]">PGUITAR {form.data.phone || 'DH'}</strong></p>
                                                        <p className="text-[11px] text-[#888] pt-1 leading-4">Quét bằng ứng dụng bất kỳ ngân hàng nào để chuyển tiền nhanh 24/7.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : selectedMethod.id === 'VNPAY' ? (
                                            <div>
                                                <p className="text-[#E6C76A] mb-1 font-medium">⚡ Cổng thanh toán quốc gia VNPAY</p>
                                                <p>{selectedMethod.detail}</p>
                                            </div>
                                        ) : (
                                            <p>{selectedMethod.detail}</p>
                                        )}
                                    </div>
                                )}
                                {form.errors.items && <p className="mt-2 text-xs text-red-400">{form.errors.items}</p>}
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <p className="mb-3 text-xs uppercase tracking-wider text-[#B8B1A2]">Đơn hàng ({cart.reduce((sum, item) => sum + item.qty, 0)} sản phẩm)</p>
                                <div className="max-h-36 space-y-2 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between gap-3 text-xs">
                                            <span className="text-[#B8B1A2]">{item.name} × {item.qty}</span>
                                            <span className="whitespace-nowrap text-[#F4F0E8]">{formatVND(Number(item.price) * item.qty)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
                                    <span className="text-xs uppercase tracking-wider text-[#B8B1A2]">Tổng thanh toán</span>
                                    <span className="font-semibold text-[#D4AF37]">{formatVND(total)}</span>
                                </div>
                            </div>

                            {auth?.user ? (
                                <button
                                    type="submit"
                                    disabled={form.processing || cart.length === 0}
                                    className="w-full bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Đang xử lý...'
                                        : form.data.payment_method === 'P-PAY'
                                            ? 'Thanh toán qua Ví ảo P-Pay →'
                                            : form.data.payment_method === 'VNPAY'
                                                ? 'Thanh toán ngay qua VNPAY →'
                                                : form.data.payment_method === 'QR Pay'
                                                    ? 'Xác nhận đặt hàng & Chuyển khoản QR'
                                                    : 'Xác nhận đặt hàng'}
                                </button>
                            ) : (
                                <Link href={route('login')} className="block w-full bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-black">
                                    Đăng nhập để đặt hàng
                                </Link>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

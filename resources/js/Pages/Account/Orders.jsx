import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Orders({ orders = [], flash = {} }) {
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';

    const tabs = [
        { id: 'ALL', label: 'Tất cả', count: orders.length },
        { id: 'Đang xử lý', label: 'Đang xử lý', count: orders.filter((o) => o.status === 'Đang xử lý').length },
        { id: 'Đang giao hàng', label: 'Đang giao', count: orders.filter((o) => o.status === 'Đang giao hàng').length },
        { id: 'Đã giao', label: 'Đã giao', count: orders.filter((o) => o.status === 'Đã giao').length },
        { id: 'Đã hủy', label: 'Đã hủy', count: orders.filter((o) => o.status === 'Đã hủy').length },
    ];

    const filteredOrders = selectedTab === 'ALL'
        ? orders
        : orders.filter((o) => o.status === selectedTab);

    const handleConfirmCancel = () => {
        if (!cancellingOrder) return;
        setIsCancelling(true);
        router.post(
            route('account.orders.cancel', cancellingOrder.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsCancelling(false);
                    setCancellingOrder(null);
                },
            }
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'bg-amber-950/70 text-amber-400 border border-amber-600/40';
            case 'Đang giao hàng':
                return 'bg-sky-950/70 text-sky-400 border border-sky-600/40';
            case 'Đã giao':
                return 'bg-emerald-950/70 text-emerald-400 border border-emerald-600/40';
            case 'Đã hủy':
                return 'bg-rose-950/70 text-rose-400 border border-rose-600/40';
            default:
                return 'bg-white/5 text-[#B8B1A2] border border-white/10';
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] px-4 py-8 sm:px-6 sm:py-12 text-[#F4F0E8] font-['Inter',sans-serif]">
            <Head title="Đơn hàng của tôi · P-Guitar" />

            <main className="mx-auto max-w-4xl">
                {/* Header Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.2em]">
                    <div className="flex items-center space-x-4">
                        <Link href="/account" className="text-[#D4AF37] hover:text-[#F4F0E8] transition-colors">
                            ← Tài khoản
                        </Link>
                        <span className="text-white/20">/</span>
                        <Link href="/" className="text-[#9B9B9B] hover:text-[#F4F0E8] transition-colors">
                            Trang chủ
                        </Link>
                    </div>
                    <Link
                        href="/"
                        className="border border-[#D4AF37]/50 px-3 py-1.5 text-[10px] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                        + Mua sắm thêm
                    </Link>
                </div>

                {/* Tiêu đề trang */}
                <div className="mt-8 mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Lịch sử giao dịch</p>
                    <h1 className="mt-1 text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Đơn Hàng Của Tôi
                    </h1>
                    <p className="mt-2 text-xs text-[#9B9B9B]">
                        Theo dõi trạng thái giao hàng, danh sách sản phẩm và quản lý các đơn hàng đã đặt tại P-Guitar.
                    </p>
                </div>

                {/* Thông báo Flash nếu có */}
                {flash?.success && (
                    <div className="mb-6 border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400 flex items-center gap-2">
                        <span>✓</span>
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-400 flex items-center gap-2">
                        <span>⚠</span>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Tabs Bộ lọc trạng thái */}
                <div className="flex overflow-x-auto border-b border-white/10 gap-1 pb-px mb-6 scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedTab(tab.id)}
                            className={`shrink-0 px-4 py-2.5 text-xs transition border-b-2 font-medium ${
                                selectedTab === tab.id
                                    ? 'border-[#D4AF37] text-[#D4AF37]'
                                    : 'border-transparent text-[#9B9B9B] hover:text-white'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Danh sách Đơn hàng */}
                {filteredOrders.length === 0 ? (
                    <div className="border border-dashed border-white/15 bg-[#121212] p-12 text-center rounded">
                        <p className="text-3xl text-[#D4AF37] mb-2">✦</p>
                        <p className="text-sm text-white font-medium">Không tìm thấy đơn hàng nào</p>
                        <p className="mt-1 text-xs text-[#9B9B9B]">Bạn chưa có đơn hàng nào trong mục này.</p>
                        <Link
                            href="/"
                            className="mt-6 inline-block bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black"
                        >
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <section
                                key={order.id}
                                className="border border-white/10 bg-[#141414] shadow-xl overflow-hidden transition hover:border-white/20"
                            >
                                {/* Thanh Header của Đơn hàng */}
                                <div className="border-b border-white/10 bg-[#181818] px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="font-serif font-bold text-sm text-[#D4AF37]">#{order.id}</span>
                                        <span className="text-[#888]">·</span>
                                        <span className="text-[#9B9B9B]">
                                            {order.created_at ? new Date(order.created_at.replace(' ', 'T')).toLocaleString('vi-VN') : '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Badge Trạng thái thanh toán */}
                                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                                            order.payment_status === 'paid'
                                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-600/40'
                                                : 'bg-amber-950/70 text-amber-400 border border-amber-600/40'
                                        }`}>
                                            {order.payment_status === 'paid'
                                                ? `Đã TT · ${order.payment_method || 'VNPAY'}`
                                                : (order.payment_method || 'Chưa thanh toán')}
                                        </span>

                                        {/* Badge Trạng thái giao hàng */}
                                        <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded ${getStatusBadge(order.status)}`}>
                                            {order.status || 'Đang xử lý'}
                                        </span>
                                    </div>
                                </div>

                                {/* Danh sách sản phẩm trong đơn */}
                                <div className="p-4 sm:p-6 divide-y divide-white/5">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item) => (
                                            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                                                {item.product_img ? (
                                                    <img
                                                        src={item.product_img}
                                                        alt={item.product_name}
                                                        className="w-16 h-16 object-cover rounded border border-white/10 shrink-0 bg-[#0B0B0B]"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded border border-white/10 bg-[#0B0B0B] flex items-center justify-center text-xs text-[#888] shrink-0">
                                                        Guitar
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-[#F4F0E8] truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                        {item.product_name || `Sản phẩm #${item.product_id}`}
                                                    </h3>
                                                    {item.product_category && (
                                                        <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] mt-0.5">
                                                            {item.product_category}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-[#9B9B9B] mt-1">
                                                        Số lượng: <strong className="text-white">{item.quantity}</strong> × {formatVND(item.price)}
                                                    </p>
                                                </div>

                                                <div className="text-right whitespace-nowrap">
                                                    <span className="text-xs sm:text-sm font-semibold text-[#F4F0E8]">
                                                        {formatVND(Number(item.price) * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-3 text-xs text-[#888]">Thông tin sản phẩm đang được tải…</p>
                                    )}
                                </div>

                                {/* Thông tin giao hàng & Tổng tiền */}
                                <div className="border-t border-white/10 bg-[#0E0E0E] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-xs text-[#9B9B9B] space-y-1">
                                        <p>
                                            <span className="text-[#888]">Giao đến:</span> <strong className="text-white">{order.fullname}</strong> ({order.phone})
                                        </p>
                                        <p className="truncate max-w-md">
                                            <span className="text-[#888]">Địa chỉ:</span> {order.address}
                                        </p>
                                        {order.note && (
                                            <p className="italic text-[#888]">Ghi chú: "{order.note}"</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                        <div className="text-left sm:text-right">
                                            <span className="text-xs text-[#9B9B9B]">Tổng tiền đơn hàng: </span>
                                            <span className="text-base sm:text-lg font-bold text-[#D4AF37]">
                                                {formatVND(order.total_money)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Nút hủy đơn nếu trạng thái là 'Đang xử lý' */}
                                            {order.status === 'Đang xử lý' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setCancellingOrder(order)}
                                                    className="border border-rose-500/40 bg-rose-950/20 px-3.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                            )}

                                            {/* Nút thanh toán lại nếu chưa thanh toán */}
                                            {order.payment_status !== 'paid' && order.status !== 'Đã hủy' && (
                                                order.payment_method === 'Ví P-Pay' ? (
                                                    <Link
                                                        href={`/wallet/scan/${order.id}`}
                                                        className="bg-[#D4AF37] px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-[#E6C76A] transition-colors"
                                                    >
                                                        Thanh toán Ví P-Pay →
                                                    </Link>
                                                ) : null
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* MODAL XÁC NHẬN HỦY ĐƠN HÀNG */}
                {cancellingOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                        <div className="w-full max-w-md border border-[#D4AF37]/40 bg-[#161616] p-6 shadow-2xl relative">
                            <h3 className="font-serif text-lg font-bold text-[#F4F0E8] mb-2">
                                Xác nhận hủy đơn hàng #{cancellingOrder.id}?
                            </h3>
                            <p className="text-xs text-[#9B9B9B] leading-5 mb-5">
                                Bạn có chắc chắn muốn hủy đơn hàng trị giá <strong className="text-[#D4AF37]">{formatVND(cancellingOrder.total_money)}</strong> không? Số lượng sản phẩm trong kho sẽ được tự động hoàn trả.
                            </p>

                            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={() => setCancellingOrder(null)}
                                    className="border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={handleConfirmCancel}
                                    className="bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                                >
                                    {isCancelling ? 'Đang hủy đơn…' : 'Xác nhận hủy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

const fieldClass = 'mt-2 w-full border border-white/15 bg-[#0B0B0B] px-4 py-3 text-sm text-[#F4F0E8] outline-none transition focus:border-[#D4AF37]';
const labelClass = 'block text-xs uppercase tracking-[0.16em] text-[#B8B1A2]';
const goldButtonClass = 'inline-flex items-center justify-center bg-[#D4AF37] px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-[#E6C76A] disabled:cursor-not-allowed disabled:opacity-50';
const statuses = ['Đang xử lý', 'Đang giao hàng', 'Đã giao', 'Đã hủy'];
const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`;

function SectionTitle({ eyebrow, children, detail }) {
    return (
        <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">{eyebrow}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>{children}</h2>
            {detail && <p className="mt-2 text-xs text-[#9B9B9B]">{detail}</p>}
        </div>
    );
}

function RevenueChart({ data }) {
    const chart = data || [];
    const maxRevenue = Math.max(1, ...chart.map((item) => Number(item.revenue)));
    const points = chart.map((item, index) => {
        const x = chart.length < 2 ? 360 : 56 + (index * 608) / (chart.length - 1);
        const y = 206 - (Number(item.revenue) / maxRevenue) * 150;
        return { ...item, x, y };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = points.length ? `56,210 ${line} 664,210` : '';

    return (
        <div className="overflow-hidden">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#F4F0E8]">Doanh thu đơn đã giao</p>
                    <p className="mt-1 text-xs text-[#858585]">12 tháng gần nhất · Không tính đơn đang xử lý hoặc đã hủy</p>
                </div>
                <span className="text-xs text-[#858585]">Đơn vị: VNĐ</span>
            </div>
            <svg viewBox="0 0 720 260" role="img" aria-label="Biểu đồ doanh thu theo tháng trong mười hai tháng gần nhất" className="h-56 w-full overflow-visible">
                {[56, 106, 156, 206].map((y) => (
                    <line key={y} x1="56" y1={y} x2="664" y2={y} stroke="rgba(255,255,255,0.09)" strokeDasharray="3 5" />
                ))}
                {points.length > 1 && <polygon points={area} fill="rgba(212,175,55,0.12)" />}
                {points.length > 1 && <polyline points={line} fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
                {points.map((point) => (
                    <g key={point.label}>
                        <circle cx={point.x} cy={point.y} r="5" fill="#0B0B0B" stroke="#E6C76A" strokeWidth="3">
                            <title>{`${point.label}: ${money(point.revenue)}`}</title>
                        </circle>
                        <text x={point.x} y="238" textAnchor="middle" fill="#9B9B9B" fontSize="11">{point.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function DeliveryRow({ order }) {
    const statusForm = useForm({ status: order.status || 'Đang xử lý' });

    const updateStatus = (event) => {
        event.preventDefault();
        statusForm.patch(route('admin.orders.update-status', order.id), { preserveScroll: true });
    };

    return (
        <tr className="border-t border-white/10 align-top">
            <td className="px-4 py-4 text-sm text-[#D4AF37]">#{order.id}</td>
            <td className="px-4 py-4 text-sm">
                <p className="text-[#F4F0E8]">{order.fullname}</p>
                <p className="mt-1 text-xs text-[#9B9B9B]">{order.phone}</p>
            </td>
            <td className="max-w-56 px-4 py-4 text-xs leading-5 text-[#B8B1A2]">{order.address}</td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-[#F4F0E8]">{money(order.total_money)}</td>
            <td className="whitespace-nowrap px-4 py-4 text-xs text-[#9B9B9B]">
                {order.created_at ? new Date(order.created_at.replace(' ', 'T')).toLocaleDateString('vi-VN') : '—'}
            </td>
            <td className="px-4 py-4">
                <form onSubmit={updateStatus} className="flex min-w-56 flex-wrap items-center gap-2">
                    <select
                        aria-label={`Trạng thái đơn hàng ${order.id}`}
                        value={statusForm.data.status}
                        onChange={(event) => statusForm.setData('status', event.target.value)}
                        disabled={statusForm.processing}
                        className="border border-white/15 bg-[#0B0B0B] px-3 py-2 text-xs text-[#F4F0E8] focus:border-[#D4AF37] focus:outline-none"
                    >
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button
                        type="submit"
                        disabled={statusForm.processing || statusForm.data.status === order.status}
                        className="text-xs uppercase tracking-wider text-[#D4AF37] hover:text-[#E6C76A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {statusForm.processing ? 'Đang lưu…' : 'Cập nhật'}
                    </button>
                    {statusForm.errors.status && <p className="basis-full text-xs text-red-400">{statusForm.errors.status}</p>}
                </form>
            </td>
        </tr>
    );
}

function UserRow({ user, currentUserId }) {
    const roleForm = useForm({ role: user.role });
    const deleteForm = useForm({});
    const isCurrentUser = user.id === currentUserId;

    const updateRole = (event) => {
        event.preventDefault();
        roleForm.patch(route('admin.users.update', user.id), { preserveScroll: true });
    };

    const deleteUser = () => {
        if (window.confirm(`Xóa tài khoản "${user.username}"? Thao tác này không thể hoàn tác.`)) {
            deleteForm.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    return (
        <tr className="border-t border-white/10 align-top">
            <td className="px-4 py-4">
                <p className="font-medium text-[#F4F0E8]">{user.fullname || user.username}</p>
                <p className="mt-1 text-xs text-[#9B9B9B]">@{user.username}</p>
            </td>
            <td className="px-4 py-4 text-sm text-[#B8B1A2]">
                <p>{user.email || '—'}</p>
                <p className="mt-1 text-xs">{user.phone || 'Chưa có số điện thoại'}</p>
            </td>
            <td className="px-4 py-4">
                <form onSubmit={updateRole} className="flex flex-wrap items-center gap-2">
                    <select
                        aria-label={`Quyền của ${user.username}`}
                        value={roleForm.data.role}
                        onChange={(event) => roleForm.setData('role', event.target.value)}
                        disabled={isCurrentUser || roleForm.processing}
                        className="border border-white/15 bg-[#0B0B0B] px-3 py-2 text-xs text-[#F4F0E8] focus:border-[#D4AF37] focus:outline-none disabled:opacity-60"
                    >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                    <button type="submit" disabled={isCurrentUser || roleForm.processing || roleForm.data.role === user.role} className="text-xs uppercase tracking-wider text-[#D4AF37] disabled:opacity-40">
                        Lưu quyền
                    </button>
                    {roleForm.errors.role && <p className="basis-full text-xs text-red-400">{roleForm.errors.role}</p>}
                </form>
            </td>
            <td className="px-4 py-4 text-right">
                <button type="button" onClick={deleteUser} disabled={isCurrentUser || deleteForm.processing} className="text-xs uppercase tracking-wider text-red-400 disabled:opacity-40">
                    {deleteForm.processing ? 'Đang xóa…' : 'Xóa'}
                </button>
                {deleteForm.errors.user && <p className="mt-2 text-left text-xs text-red-400">{deleteForm.errors.user}</p>}
            </td>
        </tr>
    );
}

export default function Dashboard({ auth, products, users, orders, revenueChart, monthlyRevenue, pendingOrders, flash }) {
    const [activeSection, setActiveSection] = useState('overview');
    const productForm = useForm({
        name: '',
        category: '',
        tag: '',
        price: '',
        origPrice: '',
        inStock: true,
        img: null,
        specs: '',
    });

    const submitProduct = (event) => {
        event.preventDefault();
        productForm.post(route('admin.products.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => productForm.reset(),
        });
    };

    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'shipping', label: `Giao hàng${pendingOrders ? ` (${pendingOrders})` : ''}` },
        { id: 'products', label: `Sản phẩm (${products.length})` },
        { id: 'users', label: `Người dùng (${users.length})` },
    ];

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] selection:bg-[#D4AF37] selection:text-black">
            <Head title="Quản trị P-Guitar" />
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
            </Head>

            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
                    <Link href="/" className="text-lg font-bold tracking-[0.2em] text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>P-GUITAR</Link>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="text-[#B8B1A2]">{auth.user.fullname || auth.user.username}</span>
                        <Link href="/" className="text-[#D4AF37] hover:text-[#E6C76A]">Trang chủ</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-[#F4F0E8] hover:text-[#D4AF37]">Đăng xuất</Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Khu vực quản trị</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
                </div>

                {flash?.success && (
                    <div role="status" className="border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#E6C76A]">
                        {flash.success}
                    </div>
                )}

                <nav aria-label="Các mục quản trị" className="flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            aria-current={activeSection === tab.id ? 'page' : undefined}
                            onClick={() => setActiveSection(tab.id)}
                            className={`shrink-0 px-4 py-2 text-xs transition ${activeSection === tab.id ? 'bg-[#D4AF37] font-semibold text-black' : 'text-[#B8B1A2] hover:bg-white/5 hover:text-[#F4F0E8]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {activeSection === 'overview' && (
                    <section className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                { label: 'Doanh thu tháng này', value: money(monthlyRevenue) },
                                { label: 'Đơn cần xử lý', value: pendingOrders },
                                { label: 'Sản phẩm đang quản lý', value: products.length },
                            ].map((stat) => (
                                <div key={stat.label} className="border border-white/10 bg-[#151515] p-5">
                                    <p className="text-xs text-[#9B9B9B]">{stat.label}</p>
                                    <p className="mt-2 text-2xl font-medium text-[#D4AF37]">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-white/10 bg-[#151515] p-5 sm:p-7">
                            <RevenueChart data={revenueChart} />
                        </div>
                    </section>
                )}

                {activeSection === 'shipping' && (
                    <section className="border border-white/10 bg-[#151515] p-5 sm:p-7">
                        <SectionTitle eyebrow="Đơn hàng" detail={`${orders.length} đơn hàng · Có thể cập nhật trạng thái xử lý và giao hàng.`}>Quản lý giao hàng</SectionTitle>
                        {orders.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] text-left">
                                    <thead className="text-[10px] uppercase tracking-[0.16em] text-[#9B9B9B]">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Mã đơn</th>
                                            <th className="px-4 py-3 font-medium">Người nhận</th>
                                            <th className="px-4 py-3 font-medium">Địa chỉ</th>
                                            <th className="px-4 py-3 font-medium">Tổng tiền</th>
                                            <th className="px-4 py-3 font-medium">Ngày đặt</th>
                                            <th className="px-4 py-3 font-medium">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>{orders.map((order) => <DeliveryRow key={order.id} order={order} />)}</tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="border border-dashed border-white/15 px-4 py-10 text-center text-sm text-[#9B9B9B]">Chưa có đơn hàng nào.</p>
                        )}
                    </section>
                )}

                {activeSection === 'products' && (
                    <section className="space-y-5">
                        <details className="border border-white/10 bg-[#151515] p-5 sm:p-7">
                            <summary className="cursor-pointer list-none text-lg text-[#D4AF37]">
                                <span className="mr-2">+</span> Thêm sản phẩm mới
                            </summary>
                            <form onSubmit={submitProduct} className="mt-6 grid gap-4 sm:grid-cols-2">
                                <label className={labelClass}>
                                    Tên sản phẩm *
                                    <input className={fieldClass} value={productForm.data.name} onChange={(event) => productForm.setData('name', event.target.value)} required maxLength="255" />
                                    {productForm.errors.name && <span className="mt-2 block text-xs text-red-400">{productForm.errors.name}</span>}
                                </label>
                                <label className={labelClass}>
                                    Danh mục *
                                    <input className={fieldClass} value={productForm.data.category} onChange={(event) => productForm.setData('category', event.target.value.toUpperCase())} placeholder="ELECTRIC, ACOUSTIC..." required maxLength="100" />
                                    {productForm.errors.category && <span className="mt-2 block text-xs text-red-400">{productForm.errors.category}</span>}
                                </label>
                                <label className={labelClass}>
                                    Giá bán (₫) *
                                    <input type="number" min="0" step="1000" className={fieldClass} value={productForm.data.price} onChange={(event) => productForm.setData('price', event.target.value)} required />
                                    {productForm.errors.price && <span className="mt-2 block text-xs text-red-400">{productForm.errors.price}</span>}
                                </label>
                                <label className={labelClass}>
                                    Giá gốc (₫)
                                    <input type="number" min="0" step="1000" className={fieldClass} value={productForm.data.origPrice} onChange={(event) => productForm.setData('origPrice', event.target.value)} />
                                    {productForm.errors.origPrice && <span className="mt-2 block text-xs text-red-400">{productForm.errors.origPrice}</span>}
                                </label>
                                <label className={labelClass}>
                                    Nhãn
                                    <input className={fieldClass} value={productForm.data.tag} onChange={(event) => productForm.setData('tag', event.target.value)} maxLength="100" />
                                </label>
                                <label className={labelClass}>
                                    Ảnh sản phẩm *
                                    <input type="file" accept="image/*" className={`${fieldClass} file:mr-4 file:border-0 file:bg-[#D4AF37] file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-black`} onChange={(event) => productForm.setData('img', event.target.files[0] || null)} required />
                                    <span className="mt-2 block normal-case tracking-normal text-[#777]">PNG, JPG hoặc WEBP, tối đa 5 MB.</span>
                                    {productForm.errors.img && <span className="mt-2 block text-xs text-red-400">{productForm.errors.img}</span>}
                                </label>
                                <label className="flex items-center gap-3 text-sm text-[#B8B1A2]">
                                    <input type="checkbox" checked={productForm.data.inStock} onChange={(event) => productForm.setData('inStock', event.target.checked)} className="h-4 w-4 accent-[#D4AF37]" />
                                    Đang còn hàng
                                </label>
                                <label className={`${labelClass} sm:col-span-2`}>
                                    Thông số kỹ thuật
                                    <textarea className={`${fieldClass} min-h-24`} value={productForm.data.specs} onChange={(event) => productForm.setData('specs', event.target.value)} placeholder={'Body: Mahogany\nNeck: Maple'} maxLength="5000" />
                                    {productForm.errors.specs && <span className="mt-2 block text-xs text-red-400">{productForm.errors.specs}</span>}
                                </label>
                                <div className="sm:col-span-2">
                                    <button type="submit" className={goldButtonClass} disabled={productForm.processing}>
                                        {productForm.processing ? 'Đang lưu…' : 'Thêm sản phẩm'}
                                    </button>
                                </div>
                            </form>
                        </details>

                        <div className="border border-white/10 bg-[#151515] p-5 sm:p-7">
                            <SectionTitle eyebrow="Kho hàng">{products.length} sản phẩm</SectionTitle>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-left">
                                    <thead className="text-[10px] uppercase tracking-[0.16em] text-[#9B9B9B]">
                                        <tr><th className="px-4 py-3 font-medium">Sản phẩm</th><th className="px-4 py-3 font-medium">Danh mục</th><th className="px-4 py-3 font-medium">Giá</th><th className="px-4 py-3 font-medium">Tồn kho</th></tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-t border-white/10">
                                                <td className="px-4 py-4 text-sm">{product.name}</td>
                                                <td className="px-4 py-4 text-xs uppercase text-[#B8B1A2]">{product.category}</td>
                                                <td className="px-4 py-4 text-sm text-[#D4AF37]">{money(product.price)}</td>
                                                <td className="px-4 py-4 text-xs text-[#B8B1A2]">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {!products.length && <p className="py-8 text-center text-sm text-[#9B9B9B]">Chưa có sản phẩm nào.</p>}
                            </div>
                        </div>
                    </section>
                )}

                {activeSection === 'users' && (
                    <section className="border border-white/10 bg-[#151515] p-5 sm:p-7">
                        <SectionTitle eyebrow="Tài khoản" detail="Không thể xóa chính mình, quản trị viên cuối cùng hoặc tài khoản có đơn hàng.">Quản lý người dùng</SectionTitle>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left">
                                <thead className="text-[10px] uppercase tracking-[0.16em] text-[#9B9B9B]">
                                    <tr><th className="px-4 py-3 font-medium">Tài khoản</th><th className="px-4 py-3 font-medium">Liên hệ</th><th className="px-4 py-3 font-medium">Quyền</th><th className="px-4 py-3 font-medium text-right">Thao tác</th></tr>
                                </thead>
                                <tbody>{users.map((user) => <UserRow key={user.id} user={user} currentUserId={auth.user.id} />)}</tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

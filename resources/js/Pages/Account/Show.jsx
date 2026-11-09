import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const fieldClass = 'mt-1.5 w-full border border-white/15 bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#F4F0E8] outline-none transition focus:border-[#D4AF37]';
const labelClass = 'text-xs uppercase tracking-wider text-[#9B9B9B]';

export default function ShowAccount() {
    const { auth, flash = {} } = usePage().props;
    const user = auth.user;

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Form cập nhật thông tin cá nhân
    const profileForm = useForm({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    // Form đổi mật khẩu
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('account.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('account.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setIsChangingPassword(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] px-4 py-8 sm:px-6 sm:py-12 text-[#F4F0E8] font-['Inter',sans-serif]">
            <Head title="Thông tin tài khoản · P-Guitar" />

            <main className="mx-auto max-w-3xl">
                {/* Header navigation */}
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                    <Link href="/" className="text-[#D4AF37] hover:text-[#F4F0E8] transition-colors">
                        ← Về trang chủ
                    </Link>
                    <Link href={route('account.orders')} className="text-[#E6C76A] hover:underline">
                        Đơn hàng của tôi →
                    </Link>
                </div>

                {/* Card Container */}
                <section className="mt-8 border border-white/10 bg-[#151515] p-6 sm:p-10 shadow-2xl relative">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">TÀI KHOẢN P-GUITAR</p>
                    
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                        <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Thông tin tài khoản
                        </h1>

                        {!isEditing && !isChangingPassword && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 py-1.5 text-xs uppercase tracking-wider text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
                                >
                                    ✏️ Chỉnh sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(true)}
                                    className="border border-white/20 px-3.5 py-1.5 text-xs uppercase tracking-wider text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                                >
                                    🔑 Đổi mật khẩu
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Thông báo thành công */}
                    {flash?.success && (
                        <div className="mt-6 border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
                            <span>✓</span>
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* 1. CHẾ ĐỘ CHỈNH SỬA THÔNG TIN */}
                    {isEditing ? (
                        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5 animate-fadeIn">
                            <div className="grid gap-1 pb-3 border-b border-white/5 sm:grid-cols-[12rem_1fr] sm:items-center">
                                <span className={labelClass}>Tên đăng nhập</span>
                                <span className="text-sm text-[#888] font-mono">{user.username} (Cố định)</span>
                            </div>

                            <div>
                                <label htmlFor="fullname" className={labelClass}>Họ và tên *</label>
                                <input
                                    id="fullname"
                                    type="text"
                                    required
                                    maxLength="100"
                                    className={fieldClass}
                                    value={profileForm.data.fullname}
                                    onChange={(e) => profileForm.setData('fullname', e.target.value)}
                                />
                                {profileForm.errors.fullname && (
                                    <p className="mt-1 text-xs text-red-400">{profileForm.errors.fullname}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className={labelClass}>Địa chỉ Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    maxLength="255"
                                    className={fieldClass}
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                />
                                {profileForm.errors.email && (
                                    <p className="mt-1 text-xs text-red-400">{profileForm.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className={labelClass}>Số điện thoại</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    maxLength="20"
                                    placeholder="Ví dụ: 0901234567"
                                    className={fieldClass}
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                />
                                {profileForm.errors.phone && (
                                    <p className="mt-1 text-xs text-red-400">{profileForm.errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="address" className={labelClass}>Địa chỉ nhận hàng</label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    maxLength="255"
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                                    className={fieldClass}
                                    value={profileForm.data.address}
                                    onChange={(e) => profileForm.setData('address', e.target.value)}
                                />
                                {profileForm.errors.address && (
                                    <p className="mt-1 text-xs text-red-400">{profileForm.errors.address}</p>
                                )}
                            </div>

                            <div className="grid gap-1 pb-3 border-b border-white/5 sm:grid-cols-[12rem_1fr] sm:items-center">
                                <span className={labelClass}>Vai trò</span>
                                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">{user.role}</span>
                            </div>

                            <div className="pt-4 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:opacity-90 disabled:opacity-50"
                                >
                                    {profileForm.processing ? 'Đang lưu…' : 'Lưu thông tin'}
                                </button>
                                <button
                                    type="button"
                                    disabled={profileForm.processing}
                                    onClick={() => {
                                        profileForm.reset();
                                        setIsEditing(false);
                                    }}
                                    className="border border-white/20 px-5 py-2.5 text-xs uppercase tracking-widest text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    ) : isChangingPassword ? (
                        /* 2. CHẾ ĐỘ ĐỔI MẬT KHẨU */
                        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 animate-fadeIn max-w-md">
                            <div>
                                <label htmlFor="current_password" className={labelClass}>Mật khẩu hiện tại *</label>
                                <input
                                    id="current_password"
                                    type="password"
                                    required
                                    className={fieldClass}
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-xs text-red-400">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="new_password" className={labelClass}>Mật khẩu mới (tối thiểu 8 ký tự) *</label>
                                <input
                                    id="new_password"
                                    type="password"
                                    required
                                    className={fieldClass}
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                />
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-xs text-red-400">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className={labelClass}>Xác nhận mật khẩu mới *</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    className={fieldClass}
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                />
                                {passwordForm.errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-400">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="pt-3 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:opacity-90 disabled:opacity-50"
                                >
                                    {passwordForm.processing ? 'Đang đổi…' : 'Cập nhật mật khẩu'}
                                </button>
                                <button
                                    type="button"
                                    disabled={passwordForm.processing}
                                    onClick={() => {
                                        passwordForm.reset();
                                        setIsChangingPassword(false);
                                    }}
                                    className="border border-white/20 px-5 py-2.5 text-xs uppercase tracking-widest text-[#B8B1A2] hover:text-white hover:border-white transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* 3. CHẾ ĐỘ XEM THÔNG TIN (MẶC ĐỊNH) */
                        <dl className="mt-6 divide-y divide-white/10">
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Tên đăng nhập</dt>
                                <dd className="break-words text-sm font-mono text-[#F4F0E8]">{user.username}</dd>
                            </div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Họ và tên</dt>
                                <dd className="break-words text-sm font-medium text-[#F4F0E8]">{user.fullname || 'Chưa cập nhật'}</dd>
                            </div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Email</dt>
                                <dd className="break-words text-sm text-[#F4F0E8]">{user.email || 'Chưa cập nhật'}</dd>
                            </div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Số điện thoại</dt>
                                <dd className="break-words text-sm text-[#F4F0E8]">
                                    {user.phone ? (
                                        <span className="font-mono text-[#E6C76A]">{user.phone}</span>
                                    ) : (
                                        <span className="text-[#777] italic">Chưa cập nhật</span>
                                    )}
                                </dd>
                            </div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Địa chỉ nhận hàng</dt>
                                <dd className="break-words text-sm text-[#F4F0E8]">
                                    {user.address ? (
                                        user.address
                                    ) : (
                                        <span className="text-[#777] italic">Chưa cập nhật</span>
                                    )}
                                </dd>
                            </div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className={labelClass}>Vai trò</dt>
                                <dd className="break-words text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">{user.role}</dd>
                            </div>
                        </dl>
                    )}

                    {/* Thanh nút bấm hành động dưới chân trang */}
                    <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                        <Link
                            href={route('account.orders')}
                            className="bg-[#D4AF37] px-5 py-3 text-xs uppercase tracking-widest font-semibold text-black hover:bg-[#E6C76A] transition-colors"
                        >
                            📦 Đơn hàng của tôi
                        </Link>

                        {user?.role === 'user' && (
                            <Link
                                href="/"
                                className="border border-[#D4AF37]/60 px-5 py-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        )}

                        {user?.role === 'admin' && (
                            <Link
                                href="/dashboard"
                                className="border border-[#D4AF37]/60 px-5 py-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                Khu vực Quản trị viên (Dashboard)
                            </Link>
                        )}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest text-[#9B9B9B] hover:border-white hover:text-white transition-colors"
                        >
                            Đăng xuất
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ThanhDieuHuong({ 
    cartCount, 
    wishlistCount, 
    onOpenSearch, 
    onOpenCart, 
    onOpenWishlist, 
    onOpenCustomModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    auth // Nhận dữ liệu auth từ Laravel truyền vào
}) {
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/85 backdrop-blur-[12px] border-b border-white/10 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    {/* Logo Monogram */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 border border-[#D4AF37]/40 flex items-center justify-center transition-colors group-hover:border-[#D4AF37]">
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#E6C76A] via-[#D4AF37] to-[#996515]" style={{ fontFamily: "'Playfair Display', serif" }}>P</span>
                        </div>
                        <span className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            P-GUITAR
                        </span>
                    </Link>

                    {/* Menu Điều Hướng Desktop */}
                    <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-semibold tracking-[0.25em] uppercase text-[#F4F0E8]/80">
                        <a href="#home" className="hover:text-[#D4AF37] transition-colors">Trang chủ</a>
                        <a href="#store" className="hover:text-[#D4AF37] transition-colors">Cửa hàng</a>
                        <a href="#collections" className="hover:text-[#D4AF37] transition-colors">Bộ sưu tập</a>
                        <button onClick={onOpenCustomModal} className="hover:text-[#D4AF37] transition-colors uppercase">Custom Shop</button>
                        <a href="#about" className="hover:text-[#D4AF37] transition-colors">Về chúng tôi</a>
                    </nav>
                    
                    {/* Action Icons */}
                    <div className="flex items-center space-x-6 text-[#F4F0E8]/90">
                        <button onClick={onOpenSearch} aria-label="Tìm kiếm" className="hover:text-[#D4AF37] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>

                        {/* Kiểm tra trạng thái đăng nhập từ bảng users */}
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-expanded={isAccountMenuOpen}
                                    aria-label="Mở menu tài khoản"
                                    onClick={() => setIsAccountMenuOpen((open) => !open)}
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#F4F0E8] font-semibold"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="hidden sm:inline max-w-28 truncate">{auth.user.fullname || auth.user.username}</span>
                                </button>
                                {isAccountMenuOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-56 border border-white/10 bg-[#151515] py-2 shadow-2xl">
                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-[#F4F0E8]">{auth.user.fullname || auth.user.username}</p>
                                            <p className="truncate text-xs text-[#9B9B9B]">@{auth.user.username}</p>
                                        </div>
                                        
                                        
                                        <Link
                                            href={route('account.show')}
                                            onClick={() => setIsAccountMenuOpen(false)}
                                            className="block px-4 py-3 text-xs uppercase tracking-wider text-[#F4F0E8] hover:bg-white/5 hover:text-[#D4AF37]"
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            onClick={() => setIsAccountMenuOpen(false)}
                                            className="block w-full px-4 py-3 text-left text-xs uppercase tracking-wider text-[#F4F0E8] hover:bg-white/5 hover:text-[#D4AF37]"
                                        >
                                            Đăng xuất
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" aria-label="Đăng nhập hoặc đăng ký" title="Đăng nhập hoặc đăng ký" className="hover:text-[#D4AF37] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </Link>
                        )}

                        <button onClick={onOpenWishlist} aria-label="Yêu thích" className="hover:text-[#D4AF37] transition-colors relative">
                            <svg className="W-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>
                        <button onClick={onOpenCart} aria-label="Giỏ hàng" className="hover:text-[#D4AF37] transition-colors relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gradient-to-r from-[#E6C76A] to-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden hover:text-[#D4AF37]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
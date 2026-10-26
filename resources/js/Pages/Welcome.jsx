import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');

    const toggleWishlist = (id) => {
        if (wishlist.includes(id)) {
            setWishlist(wishlist.filter(itemId => itemId !== id));
        } else {
            setWishlist([...wishlist, id]);
        }
    };

    const products = [
        { id: 1, name: "Gibson Les Paul Custom", category: "ELECTRIC", tag: "FLAGSHIP MAHOGANY", price: "125.000.000", origPrice: "135.000.000", inStock: true, img: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?w=800&auto=format&fit=crop" },
        { id: 2, name: "Fender Stratocaster Elite", category: "ELECTRIC", tag: "SIGNATURE SERIES", price: "85.000.000", inStock: true, img: "https://images.unsplash.com/photo-1564182842517-487bb4e2076d?w=800&auto=format&fit=crop" },
        { id: 3, name: "Taylor 914ce V-Class", category: "ACOUSTIC", tag: "MASTERPIECE ACOUSTIC", price: "112.000.000", inStock: true, img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop" },
        { id: 4, name: "PRS Custom 24-08 Quilt", category: "CUSTOM", tag: "LIMITED EDITION", price: "148.000.000", inStock: false, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop" }
    ];

    const filteredProducts = activeFilter === 'ALL' 
        ? products 
        : products.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] font-['Inter',sans-serif] selection:bg-[#D4AF37] selection:text-black antialiased">
            <Head>
                <title>P-GUITAR LUXURY — Kiệt Tác Nhạc Cụ & Di Sản Âm Nhạc</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
            </Head>

            {/* --- 1. HEADER VÀ HỆ THỐNG ĐIỀU HƯỚNG (GLASSMORPHISM) --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/85 backdrop-blur-[12px] border-b border-white/10 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    {/* Monogram Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 border border-[#D4AF37]/40 flex items-center justify-center transition-colors group-hover:border-[#D4AF37]">
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#E6C76A] via-[#D4AF37] to-[#996515]" style={{ fontFamily: "'Playfair Display', serif" }}>P</span>
                        </div>
                        <span className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            P-GUITAR
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-semibold tracking-[0.25em] uppercase text-[#F4F0E8]/80">
                        <a href="#home" className="hover:text-[#D4AF37] transition-colors duration-300">Trang chủ</a>
                        <a href="#store" className="hover:text-[#D4AF37] transition-colors duration-300">Cửa hàng</a>
                        <a href="#collections" className="hover:text-[#D4AF37] transition-colors duration-300">Acoustic</a>
                        <a href="#collections" className="hover:text-[#D4AF37] transition-colors duration-300">Electric</a>
                        <a href="#custom" className="hover:text-[#D4AF37] transition-colors duration-300">Custom Shop</a>
                        <a href="#about" className="hover:text-[#D4AF37] transition-colors duration-300">Về chúng tôi</a>
                    </nav>

                    {/* Action Functions */}
                    <div className="flex items-center space-x-7 text-[#F4F0E8]/90">
                        <button aria-label="Tìm kiếm" className="hover:text-[#D4AF37] transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        <Link href="/login" aria-label="Tài khoản" className="hover:text-[#D4AF37] transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </Link>
                        <button aria-label="Sản phẩm yêu thích" className="hover:text-[#D4AF37] transition-colors duration-300 relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </button>
                        <button aria-label="Giỏ hàng" className="hover:text-[#D4AF37] transition-colors duration-300 relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gradient-to-r from-[#E6C76A] to-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 2. HERO SECTION --- */}
            <section id="home" className="relative h-[850px] flex items-center justify-center text-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000&auto=format&fit=crop" 
                        alt="Hero Luxury Guitar" 
                        className="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] ease-out hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/65 to-black/40"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <span className="inline-block text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 font-semibold border-b border-[#D4AF37]/30 pb-1">
                        THE ART OF SOUND
                    </span>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-normal tracking-tight mb-8 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Không chỉ là một cây đàn. <br />
                        Đó là một <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] italic font-semibold">di sản.</span>
                    </h1>
                    <p className="text-[#9B9B9B] text-base md:text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Mỗi cây đàn là sự giao thoa giữa nghệ thuật chế tác thủ công, chất liệu quý tuyển chọn và cảm xúc mãnh liệt của người nghệ sĩ.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <a href="#store" className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] hover:opacity-95 text-black font-semibold text-xs uppercase tracking-[0.25em] rounded-none shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-300 text-center">
                            KHÁM PHÁ BỘ SƯU TẬP
                        </a>
                        <a href="#about" className="w-full sm:w-auto px-9 py-4 bg-transparent hover:bg-white/5 text-[#F4F0E8] border border-white/20 font-semibold text-xs uppercase tracking-[0.25em] rounded-none transition-all duration-300 text-center">
                            CÂU CHUYỆN CỦA CHÚNG TÔI
                        </a>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-60">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#9B9B9B]">CUỘN XUỐNG</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse"></div>
                </div>
            </section>

            {/* --- 3. BRAND VALUES SECTION --- */}
            <section className="py-12 bg-[#151515] border-y border-white/10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                    {[
                        { title: "TUYỂN CHỌN CHÍNH HÃNG", desc: "100% nhập khẩu chính ngạch từ Gibson, Fender, Taylor." },
                        { title: "TƯ VẤN CHUYÊN SÂU", desc: "Đội ngũ nghệ sĩ am hiểu âm thanh trực tiếp tư vấn 1:1." },
                        { title: "BẢO HÀNH TRỌN ĐỜI", desc: "Chăm sóc, cân chỉnh cần đàn và bảo dưỡng định kỳ." },
                        { title: "VẬN CHUYỂN AN TOÀN", desc: "Đóng gói chuyên dụng chống va đập, bảo hiểm 100%." }
                    ].map((val, idx) => (
                        <div key={idx} className="space-y-1">
                            <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">{val.title}</h4>
                            <p className="text-xs text-[#9B9B9B] font-light leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 4. EDITORIAL CATEGORY GRID --- */}
            <section id="collections" className="py-28 max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="text-center mb-16 space-y-3">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">PHONG CÁCH ÂM NHẠC</span>
                    <h2 className="text-3xl md:text-5xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Tìm thấy chất âm của riêng bạn
                    </h2>
                    <p className="text-[#9B9B9B] text-sm max-w-xl mx-auto font-light">
                        Mỗi dòng đàn mang một cá tính, một chất âm và một câu chuyện truyền cảm hứng riêng biệt.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "ACOUSTIC", subtitle: "Guitar Acoustic & Electro-Acoustic", desc: "Mộc mạc, vang sáng, ngân vang từng giai điệu tự nhiên.", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop" },
                        { title: "ELECTRIC", subtitle: "Vintage & Modern Electric", desc: "Uy lực, sắc sảo, sân khấu của những bản solo bùng nổ.", img: "https://images.unsplash.com/photo-1550985616-1ed81338ff9c?w=800&auto=format&fit=crop" },
                        { title: "CUSTOM SHOP", subtitle: "Độc Bản Chế Tác Theo Yêu Cầu", desc: "Chất liệu gỗ cực hiếm, hoàn thiện thủ công dành riêng cho bạn.", img: "https://images.unsplash.com/photo-1525055437640-d9e2646d8928?w=800&auto=format&fit=crop" }
                    ].map((cat, idx) => (
                        <div key={idx} className="relative h-[580px] overflow-hidden group cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500">
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent opacity-90"></div>
                            
                            <div className="absolute bottom-10 left-8 right-8 transition-transform duration-500 group-hover:-translate-y-2">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">{cat.subtitle}</span>
                                <h3 className="text-3xl font-normal mt-2 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{cat.title}</h3>
                                <p className="text-xs text-[#9B9B9B] font-light leading-relaxed mb-6">{cat.desc}</p>
                                <span className="inline-flex items-center space-x-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F4F0E8] group-hover:text-[#D4AF37] transition-colors">
                                    <span>KHÁM PHÁ {cat.title}</span>
                                    <span>→</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 5. PRODUCT LISTING & GALLERY --- */}
            <section id="store" className="py-24 bg-[#151515] border-t border-white/10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">TUYỂN CHỌN ĐẶC BIỆT</span>
                            <h2 className="text-3xl md:text-5xl font-normal mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Sản Phẩm <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] to-[#D4AF37]">Nổi Bật</span>
                            </h2>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-2">
                            {['ALL', 'ACOUSTIC', 'ELECTRIC', 'CUSTOM'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-4 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all ${
                                        activeFilter === tab 
                                            ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                                            : 'text-[#9B9B9B] hover:text-[#F4F0E8]'
                                    }`}
                                >
                                    {tab === 'ALL' ? 'TẤT CẢ' : tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((p) => (
                            <div key={p.id} className="group relative bg-[#0B0B0B] border border-white/10 p-5 hover:border-[#D4AF37]/50 transition-all duration-400 hover:-translate-y-1">
                                {/* Action Buttons */}
                                <div className="absolute top-7 right-7 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button 
                                        onClick={() => toggleWishlist(p.id)}
                                        aria-label="Yêu thích" 
                                        className={`w-9 h-9 bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors ${
                                            wishlist.includes(p.id) ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
                                        }`}
                                    >
                                        ♥
                                    </button>
                                </div>

                                {/* Image Container */}
                                <div className="h-72 overflow-hidden mb-6 bg-[#151515] flex items-center justify-center relative">
                                    <img 
                                        src={p.img} 
                                        alt={p.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                    />
                                    {p.origPrice && (
                                        <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                                            LIMITED
                                        </span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B9B9B] font-semibold">{p.tag}</span>
                                <h3 className="font-normal text-lg mt-1 mb-2 text-[#F4F0E8] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {p.name}
                                </h3>
                                
                                <div className="flex items-baseline space-x-3 mb-6">
                                    <span className="text-[#D4AF37] font-bold text-base">{p.price} VND</span>
                                    {p.origPrice && (
                                        <span className="text-xs text-[#9B9B9B] line-through font-light">{p.origPrice} VND</span>
                                    )}
                                </div>

                                {/* Add to Cart CTA */}
                                <button 
                                    onClick={() => setCartCount(cartCount + 1)}
                                    className="w-full py-3 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 font-semibold text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 6. NEWSLETTER SECTION --- */}
            <section className="py-28 max-w-[1440px] mx-auto px-6 md:px-12 text-center border-t border-white/10">
                <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">ĐĂNG KÝ BẢN TIN</span>
                    <h2 className="text-3xl md:text-5xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Những tuyệt tác, dành cho người thực sự yêu âm nhạc.
                    </h2>
                    <p className="text-[#9B9B9B] text-xs md:text-sm font-light leading-relaxed">
                        Nhận thông tin đặc quyền về những bộ sưu tập giới hạn, sự kiện thử đàn private và câu chuyện chế tác phía sau mỗi di sản.
                    </p>

                    <form onSubmit={(e) => e.preventDefault()} className="pt-6 flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Nhập địa chỉ email của bạn" 
                            className="flex-1 bg-[#151515] border border-white/20 px-6 py-4 text-xs text-[#F4F0E8] placeholder-[#9B9B9B] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                        />
                        <button type="submit" className="px-8 py-4 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] text-black font-bold text-[10px] uppercase tracking-[0.25em] rounded-none hover:opacity-95 transition-opacity">
                            ĐĂNG KÝ
                        </button>
                    </form>
                </div>
            </section>

            {/* --- 7. FOOTER CAO CẤP --- */}
            <footer className="bg-[#151515] border-t border-white/10 py-20 text-xs text-[#9B9B9B]">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Story */}
                    <div className="space-y-4">
                        <span className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] to-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            P-GUITAR
                        </span>
                        <p className="text-xs font-light leading-relaxed">
                            Thương hiệu phân phối nhạc cụ cao cấp hàng đầu Việt Nam. Nâng tầm giá trị nghệ thuật và đồng hành cùng cảm xúc âm nhạc đỉnh cao.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">CỬA HÀNG</h4>
                        <ul className="space-y-3 font-light">
                            <li><a href="#store" className="hover:text-[#D4AF37] transition-colors">Guitar Acoustic</a></li>
                            <li><a href="#store" className="hover:text-[#D4AF37] transition-colors">Guitar Electric</a></li>
                            <li><a href="#custom" className="hover:text-[#D4AF37] transition-colors">Custom Shop</a></li>
                            <li><a href="#store" className="hover:text-[#D4AF37] transition-colors">Phụ Kiện Cao Cấp</a></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">HỖ TRỢ</h4>
                        <ul className="space-y-3 font-light">
                            <li><a href="#policy" className="hover:text-[#D4AF37] transition-colors">Chính Sách Bảo Hành</a></li>
                            <li><a href="#shipping" className="hover:text-[#D4AF37] transition-colors">Vận Chuyển & Giao Hàng</a></li>
                            <li><a href="#terms" className="hover:text-[#D4AF37] transition-colors">Điều Khoản Dịch Vụ</a></li>
                            <li><a href="#contact" className="hover:text-[#D4AF37] transition-colors">Liên Hệ Tư Vấn</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">SHOWROOM</h4>
                        <p className="font-light leading-relaxed mb-2">123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</p>
                        <p className="font-light mb-1">Hotline: <span className="text-[#F4F0E8]">1900 xxxx xxxx</span></p>
                        <p className="font-light">Email: <span className="text-[#F4F0E8]">contact@pguitar.vn</span></p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 md:px-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-light">
                    <p>&copy; {new Date().getFullYear()} P-GUITAR LUXURY. All rights reserved.</p>
                    <p className="mt-2 sm:mt-0 text-[#9B9B9B]">Phát triển cho đồ án tốt nghiệp P-Guitar.</p>
                </div>
            </footer>
        </div>
    );
}
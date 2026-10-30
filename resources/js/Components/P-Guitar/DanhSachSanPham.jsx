import React from 'react';
import TheSanPham from './TheSanPham';

export default function DanhSachSanPham({ 
    products, 
    activeFilter, 
    setActiveFilter, 
    wishlist, 
    onToggleWishlist, 
    onQuickView, 
    onAddToCart, 
    formatVND 
}) {
    return (
        <section id="store" className="py-24 bg-[#151515] border-t border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">TUYỂN CHỌN ĐẶC BIỆT</span>
                        <h2 className="text-3xl md:text-5xl font-normal mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sản Phẩm <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] to-[#D4AF37]">Nổi Bật</span>
                        </h2>
                    </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? products.map((p) => (
                        <TheSanPham
                            key={p.id}
                            product={p}
                            isWishlist={wishlist.some(item => item.id === p.id)}
                            onToggleWishlist={onToggleWishlist}
                            onQuickView={onQuickView}
                            onAddToCart={onAddToCart}
                            formatVND={formatVND}
                        />
                    )) : (
                        <p className="col-span-full py-12 text-center text-sm text-[#9B9B9B]">
                            Hiện chưa có sản phẩm trong danh mục này.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
import React from 'react';

export default function TheSanPham({ product, isWishlist, onToggleWishlist, onQuickView, onAddToCart, formatVND }) {
    return (
        <div className="group relative bg-[#0B0B0B] border border-white/10 p-5 hover:border-[#D4AF37]/50 transition-all duration-400 hover:-translate-y-1">
            <div className="absolute top-7 right-7 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={() => onToggleWishlist(product)}
                    className={`w-9 h-9 bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors ${
                        isWishlist ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
                    }`}
                >
                    ♥
                </button>
                <button 
                    onClick={() => onQuickView(product)}
                    className="w-9 h-9 bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors text-xs"
                    title="Xem nhanh"
                >
                    👁
                </button>
            </div>

            <div className="h-72 overflow-hidden mb-6 bg-[#151515] flex items-center justify-center relative cursor-pointer" onClick={() => onQuickView(product)}>
                <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
                {product.origPrice && (
                    <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                        LIMITED
                    </span>
                )}
                {!product.inStock && (
                    <span className="absolute bottom-3 left-3 bg-red-500/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
                        Hết hàng
                    </span>
                )}
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B9B9B] font-semibold">{product.tag}</span>
            <h3 className="font-normal text-lg mt-1 mb-2 text-[#F4F0E8] group-hover:text-[#D4AF37] transition-colors cursor-pointer" onClick={() => onQuickView(product)} style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
            </h3>
            
            <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-[#D4AF37] font-bold text-base">{formatVND(product.price)}</span>
                {product.origPrice && (
                    <span className="text-xs text-[#9B9B9B] line-through font-light">{formatVND(product.origPrice)}</span>
                )}
            </div>

            <button 
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="w-full py-3 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 font-semibold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-[#777] disabled:hover:bg-transparent disabled:hover:text-[#777]"
            >
                {product.inStock ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
            </button>
        </div>
    );
}
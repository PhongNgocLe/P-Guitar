import React from 'react';

export default function XemNhanhSanPham({ product, onClose, onAddToCart, formatVND }) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative z-10 bg-[#151515] border border-[#D4AF37]/50 max-w-3xl w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <div className="bg-[#0B0B0B] flex items-center justify-center p-4">
                    <img src={product.img} alt={product.name} className="max-h-80 object-contain" />
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">{product.tag}</span>
                        <h3 className="text-2xl font-normal mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h3>
                        <p className="text-xl font-bold text-[#D4AF37] mb-6">{formatVND(product.price)}</p>
                        <p className={`mb-4 text-xs font-semibold uppercase tracking-widest ${product.inStock ? 'text-emerald-400' : 'text-red-400'}`}>
                            {product.inStock ? `Còn ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
                        </p>
                        <div className="space-y-2 text-xs text-[#9B9B9B] border-t border-b border-white/10 py-4 mb-6">
                            {product.specs && Object.entries(product.specs).map(([key, val]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="uppercase">{key}:</span>
                                    <span className="text-white font-medium">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => { onAddToCart(product); onClose(); }}
                        disabled={!product.inStock}
                        className="w-full py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-[#CCC]"
                    >
                        {product.inStock ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
                    </button>
                </div>
            </div>
        </div>
    );
}
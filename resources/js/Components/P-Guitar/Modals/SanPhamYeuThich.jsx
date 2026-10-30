import React from 'react';

export default function SanPhamYeuThich({ isOpen, onClose, wishlist, onAddToCart, formatVND }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#111111] border-l border-white/10 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                            <h3 className="text-lg font-bold tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Sản Phẩm Yêu Thích</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {wishlist.length === 0 ? (
                                <p className="text-center text-xs text-[#9B9B9B] py-12">Chưa có sản phẩm yêu thích nào.</p>
                            ) : (
                                wishlist.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 bg-[#1A1A1A] p-4 border border-white/5">
                                        <img src={item.img} alt={item.name} className="w-16 h-16 object-cover" />
                                        <div className="flex-1">
                                            <h4 className="text-xs font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</h4>
                                            <p className="text-xs text-[#D4AF37] mt-1">{formatVND(item.price)}</p>
                                        </div>
                                        <button onClick={() => onAddToCart(item)} className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-bold uppercase">Thêm</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
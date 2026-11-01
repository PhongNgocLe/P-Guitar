import React, { useState } from 'react';

export default function TimKiemNhanh({ isOpen, onClose, products, onSelectProduct, formatVND }) {
    const [searchQuery, setSearchQuery] = useState('');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col px-6 pt-24 pb-12">
            <div className="max-w-3xl mx-auto w-full relative">
                <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-[#D4AF37]">Đóng ✕</button>
                <input 
                    type="text" 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên đàn, thương hiệu..." 
                    className="w-full bg-transparent border-b-2 border-[#D4AF37] px-4 py-4 text-2xl text-white placeholder-slate-600 focus:outline-none font-['Playfair_Display']"
                />
                <div className="mt-8 space-y-4">
                    <p className="text-xs uppercase tracking-widest text-[#9B9B9B]">Gợi ý tìm kiếm:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products
                            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(p => (
                                <div key={p.id} onClick={() => { onSelectProduct(p); onClose(); }} className="flex items-center space-x-4 bg-[#151515] p-3 border border-white/5 cursor-pointer hover:border-[#D4AF37]">
                                    <img src={p.img} alt={p.name} className="w-12 h-12 object-cover" />
                                    <div>
                                        <h4 className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h4>
                                        <p className="text-xs text-[#D4AF37]">{formatVND(p.price)}</p>
                                        {!p.inStock && <p className="mt-1 text-[10px] font-semibold uppercase text-red-400">Hết hàng</p>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
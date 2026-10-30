import React from 'react';

export default function DangKyCustom({ isOpen, onClose, onTriggerToast }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative z-10 bg-[#151515] border border-[#D4AF37]/50 max-w-xl w-full p-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng Ký Custom Shop Độc Bản</h3>
                <p className="text-xs text-[#9B9B9B] mb-6">Nghệ nhân của P-Guitar sẽ liên hệ tư vấn chất liệu gỗ và âm sắc trực tiếp.</p>
                <form onSubmit={(e) => { e.preventDefault(); onClose(); onTriggerToast("Đã gửi yêu cầu Custom Shop thành công!"); }} className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#9B9B9B] mb-1">Họ và tên</label>
                        <input required type="text" className="w-full bg-[#0B0B0B] border border-white/20 p-3 text-xs text-white focus:border-[#D4AF37] outline-none" placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#9B9B9B] mb-1">Số điện thoại</label>
                        <input required type="tel" className="w-full bg-[#0B0B0B] border border-white/20 p-3 text-xs text-white focus:border-[#D4AF37] outline-none" placeholder="0901234xxx" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#9B9B9B] mb-1">Yêu cầu thiết kế / Loại gỗ</label>
                        <textarea rows="3" className="w-full bg-[#0B0B0B] border border-white/20 p-3 text-xs text-white focus:border-[#D4AF37] outline-none" placeholder="Dáng Dreadnought, Mặt gỗ Sitka Spruce..."></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] text-black font-bold text-xs uppercase tracking-widest">
                        GỬI YÊU CẦU TƯ VẤN
                    </button>
                </form>
            </div>
        </div>
    );
}
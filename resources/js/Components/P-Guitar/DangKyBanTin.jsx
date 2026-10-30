import React from 'react';

export default function DangKyBanTin({ onTriggerToast }) {
    return (
        <section className="py-28 max-w-[1440px] mx-auto px-6 md:px-12 text-center border-t border-white/10">
            <div className="max-w-2xl mx-auto space-y-4">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">ĐĂNG KÝ BẢN TIN</span>
                <h2 className="text-3xl md:text-5xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Những tuyệt tác, dành cho người thực sự yêu âm nhạc.
                </h2>
                <p className="text-[#9B9B9B] text-xs md:text-sm font-light leading-relaxed">
                    Nhận thông tin đặc quyền về những bộ sưu tập giới hạn, sự kiện thử đàn private và câu chuyện chế tác phía sau mỗi di sản.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); onTriggerToast("Đăng ký bản tin thành công!"); }} className="pt-6 flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
                    <input 
                        required
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
    );
}
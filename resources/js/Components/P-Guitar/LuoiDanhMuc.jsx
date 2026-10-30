import React from 'react';

export default function LuoiDanhMuc({ onSelectCategory }) {
    const categories = [
        { title: "ACOUSTIC", subtitle: "Guitar Acoustic & Electro-Acoustic", desc: "Mộc mạc, vang sáng, ngân vang từng giai điệu tự nhiên.", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop", filterKey: "ACOUSTIC" },
        { title: "ELECTRIC", subtitle: "Vintage & Modern Electric", desc: "Uy lực, sắc sảo, sân khấu của những bản solo bùng nổ.", img: "https://images.unsplash.com/photo-1550985616-1ed81338ff9c?w=800&auto=format&fit=crop", filterKey: "ELECTRIC" },
        { title: "CUSTOM SHOP", subtitle: "Độc Bản Chế Tác Theo Yêu Cầu", desc: "Chất liệu gỗ cực hiếm, hoàn thiện thủ công dành riêng cho bạn.", img: "https://images.unsplash.com/photo-1525055437640-d9e2646d8928?w=800&auto=format&fit=crop", filterKey: "CUSTOM" }
    ];

    return (
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
                {categories.map((cat, idx) => (
                    <div key={idx} onClick={() => onSelectCategory(cat.filterKey)} className="relative h-[580px] overflow-hidden group cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500">
                        <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent opacity-90"></div>
                        
                        <div className="absolute bottom-10 left-8 right-8 transition-transform duration-500 group-hover:-translate-y-2">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">{cat.subtitle}</span>
                            <h3 className="text-3xl font-normal mt-2 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{cat.title}</h3>
                            <p className="text-xs text-[#9B9B9B] font-light leading-relaxed mb-6">{cat.desc}</p>
                            <span className="inline-flex items-center space-x-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F4F0E8] group-hover:text-[#D4AF37] transition-colors">
                                <span>XEM SẢN PHẨM</span>
                                <span>→</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
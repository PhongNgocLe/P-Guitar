import React from 'react';

export default function CamKetThuongHieu() {
    const values = [
        { title: "TUYỂN CHỌN CHÍNH HÃNG", desc: "100% nhập khẩu chính ngạch từ Gibson, Fender, Taylor." },
        { title: "TƯ VẤN CHUYÊN SÂU", desc: "Đội ngũ nghệ sĩ am hiểu âm thanh trực tiếp tư vấn 1:1." },
        { title: "BẢO HÀNH TRỌN ĐỜI", desc: "Chăm sóc, cân chỉnh cần đàn và bảo dưỡng định kỳ." },
        { title: "VẬN CHUYỂN AN TOÀN", desc: "Đóng gói chuyên dụng chống va đập, bảo hiểm 100%." }
    ];

    return (
        <section className="py-12 bg-[#151515] border-y border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                {values.map((val, idx) => (
                    <div key={idx} className="space-y-1">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">{val.title}</h4>
                        <p className="text-xs text-[#9B9B9B] font-light leading-relaxed">{val.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
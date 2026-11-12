import React from 'react';
import { Link } from '@inertiajs/react';

export default function ChanTrang({ onOpenCustomModal }) {
    return (
        <footer id="about" className="bg-[#151515] border-t border-white/10 py-20 text-xs text-[#9B9B9B]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-4">
                    <span className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] to-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        P-GUITAR
                    </span>
                    <p className="text-xs font-light leading-relaxed">
                        Thương hiệu phân phối nhạc cụ cao cấp hàng đầu Việt Nam. Nâng tầm giá trị nghệ thuật và đồng hành cùng cảm xúc âm nhạc đỉnh cao.
                    </p>
                </div>

                <div>
                    <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">CỬA HÀNG</h4>
                    <ul className="space-y-3 font-light">
                        <li><a href="/#store" className="hover:text-[#D4AF37] transition-colors">Guitar Acoustic</a></li>
                        <li><a href="/#store" className="hover:text-[#D4AF37] transition-colors">Guitar Electric</a></li>
                        <li><button onClick={onOpenCustomModal} className="hover:text-[#D4AF37] transition-colors text-left">Custom Shop</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">HỖ TRỢ</h4>
                    <ul className="space-y-3 font-light">
                        <li><Link href="/about#return-policy" className="hover:text-[#D4AF37] transition-colors">Chính Sách Đổi Trả</Link></li>
                        <li><Link href="/about#shipping-policy" className="hover:text-[#D4AF37] transition-colors">Chính Sách Giao Hàng</Link></li>
                        <li><Link href="/about#warranty-policy" className="hover:text-[#D4AF37] transition-colors">Chính Sách Bảo Hành</Link></li>
                        <li><Link href="/about#store-story" className="hover:text-[#D4AF37] transition-colors">Về P-Guitar</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#F4F0E8] font-semibold mb-5 uppercase text-[11px] tracking-[0.2em]">SHOWROOM</h4>
                    <p className="font-light leading-relaxed mb-2">Tư vấn lựa chọn guitar và hỗ trợ thông tin sản phẩm.</p>
                    <p className="font-light">Thông tin liên hệ được xác nhận cùng đơn hàng.</p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-light">
                <p>&copy; {new Date().getFullYear()} P-GUITAR LUXURY. All rights reserved.</p>
                <p className="mt-2 sm:mt-0 text-[#9B9B9B]">Phát triển cho đồ án tốt nghiệp P-Guitar.</p>
            </div>
        </footer>
    );
}
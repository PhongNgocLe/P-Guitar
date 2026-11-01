import React from 'react';

export default function BannerChinh({ onOpenCustomModal }) {
    return (
        <section id="home" className="relative h-[850px] flex items-center justify-center text-center overflow-hidden pt-20">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://vn.images.search.yahoo.com/search/images;_ylt=A2RTexYTVeVqwAIAVVJtUwx.;_ylu=Y29sbwNhcC1zb3V0aGVhc3QtMQRwb3MDMzcEdnRpZAMEc2VjA3Ny?fr=mcafee&p=%E1%BA%A3nh+%C4%91ang+guitar+%C4%91%E1%BA%B9p+d%C3%B9ng+l%C3%A0m+banner&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffw800%2Fbackground%2F20230605%2Fpngtree-acoustic-guitar-from-top-10-classical-guitars-free-download-image_2883882.jpg" 
                    alt="Hero Luxury Guitar" 
                    className="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] ease-out hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/65 to-black/40"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <span className="inline-block text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 font-semibold border-b border-[#D4AF37]/30 pb-1">
                    THE ART OF SOUND
                </span>
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-normal tracking-tight mb-8 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Không chỉ là một cây đàn. <br />
                    Đó là một <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] italic font-semibold">di sản.</span>
                </h1>
                <p className="text-[#9B9B9B] text-base md:text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                    Mỗi cây đàn là sự giao thoa giữa nghệ thuật chế tác thủ công, chất liệu quý tuyển chọn và cảm xúc mãnh liệt của người nghệ sĩ.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <a href="#store" className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] hover:opacity-95 text-black font-semibold text-xs uppercase tracking-[0.25em] rounded-none shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-300 text-center">
                        KHÁM PHÁ BỘ SƯU TẬP
                    </a>
                    <button onClick={onOpenCustomModal} className="w-full sm:w-auto px-9 py-4 bg-transparent hover:bg-white/5 text-[#F4F0E8] border border-white/20 font-semibold text-xs uppercase tracking-[0.25em] rounded-none transition-all duration-300 text-center">
                        ĐẶT LÀM CUSTOM SHOP
                    </button>
                </div>
            </div>
        </section>
    );
}
import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
            <Head title="Trang chủ - Thế giới đàn Guitar đẳng cấp" />

            {/* --- HEADER / NAVBAR --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">🎸</span>
                        <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            P-GUITAR
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                        <a href="#featured" className="hover:text-amber-400 transition-colors">Sản phẩm</a>
                        <a href="#categories" className="hover:text-amber-400 transition-colors">Danh mục</a>
                        <a href="#about" className="hover:text-amber-400 transition-colors">Về chúng tôi</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Đăng nhập
                        </Link>
                        <Link href="/register" className="px-5 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full transition-all shadow-lg shadow-amber-500/20">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                        Nghệ thuật âm thanh đỉnh cao
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
                        Khám phá giai điệu <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">của riêng bạn</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Bộ sưu tập guitar thủ công, acoustic và electric tuyển chọn độc quyền tại P-Guitar. Mang âm nhạc chạm đến mọi cảm xúc.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all">
                            Khám phá ngay bộ sưu tập
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all">
                            Xem chương trình ưu đãi
                        </button>
                    </div>
                </div>
            </section>

            {/* --- HIGHLIGHT CATEGORIES --- */}
            <section id="categories" className="py-20 bg-slate-900/50 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Danh mục chuyên sâu</h2>
                        <p className="text-slate-400">Được thiết kế cho mọi phong cách chơi đàn</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Acoustic Guitar", desc: "Âm mộc ấm áp, vang sáng, hoàn hảo cho đệm hát.", icon: "🪵" },
                            { title: "Electric Guitar", desc: "Uy lực, cá tính, thỏa sức sáng tạo mọi dòng nhạc.", icon: "⚡" },
                            { title: "Classic Guitar", desc: "Dây nylon êm ái, chuẩn mực cho nhạc cổ điển.", icon: "🎼" }
                        ].map((cat, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2">
                                <div className="text-4xl mb-6">{cat.icon}</div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">{cat.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 border-t border-slate-900 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} P-Guitar Project. All rights reserved. Phát triển bởi Lệ Ngọc Phong.</p>
            </footer>
        </div>
    );
}
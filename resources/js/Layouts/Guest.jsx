import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-[#0B0B0B] px-4 py-8 text-[#F4F0E8]">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
            </Head>
            <iframe
                src="/"
                title="Nền trang chủ P-Guitar"
                aria-hidden="true"
                tabIndex="-1"
                className="pointer-events-none fixed inset-0 h-full w-full scale-105 border-0 blur-[6px] brightness-[0.4]"
            />
            <div className="pointer-events-none fixed inset-0 bg-black/45" />

            <main className="relative z-10 my-auto w-full max-w-md border border-[#D4AF37]/30 bg-[#111111]/95 px-6 py-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:px-8">
                <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-5">
                    <Link href="/" className="text-sm font-bold tracking-[0.24em] text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        P-GUITAR
                        <span className="mt-1 block text-[9px] font-normal tracking-[0.2em] text-[#9B9B9B]">THE ART OF SOUND</span>
                    </Link>
                    <Link href="/" aria-label="Đóng" className="px-2 text-xl leading-none text-[#9B9B9B] transition hover:text-[#D4AF37]">
                        ×
                    </Link>
                </div>
                {children}
            </main>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

// Sử dụng đúng tên thư mục 'P-Guitar' có dấu gạch ngang
import ThanhDieuHuong from '@/Components/P-Guitar/ThanhDieuHuong';
import BannerChinh from '@/Components/P-Guitar/BannerChinh';
import CamKetThuongHieu from '@/Components/P-Guitar/CamKetThuongHieu';
import LuoiDanhMuc from '@/Components/P-Guitar/LuoiDanhMuc';
import DanhSachSanPham from '@/Components/P-Guitar/DanhSachSanPham';
import DangKyBanTin from '@/Components/P-Guitar/DangKyBanTin';
import ChanTrang from '@/Components/P-Guitar/ChanTrang';

// Import các Modal chức năng
import GioHangTruot from '@/Components/P-Guitar/Modals/GioHangTruot';
import ThanhToan from '@/Components/P-Guitar/Modals/ThanhToan';
import SanPhamYeuThich from '@/Components/P-Guitar/Modals/SanPhamYeuThich';
import TimKiemNhanh from '@/Components/P-Guitar/Modals/TimKiemNhanh';
import XemNhanhSanPham from '@/Components/P-Guitar/Modals/XemNhanhSanPham';
import DangKyCustom from '@/Components/P-Guitar/Modals/DangKyCustom';

export default function Welcome({ products = [], auth = { user: null }, checkoutOpen = false, checkoutSuccess = null }) {
    const danhSachSanPham = products;

    const [cart, setCart] = useState(() => {
        try {
            const storedCart = JSON.parse(window.localStorage.getItem('pguitar-cart') || '[]');
            return Array.isArray(storedCart) ? storedCart : [];
        } catch (error) {
            console.error('Không thể đọc giỏ hàng đã lưu.', error);
            return [];
        }
    });
    const [wishlist, setWishlist] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        window.localStorage.setItem('pguitar-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (checkoutSuccess?.order_id) {
            window.localStorage.removeItem('pguitar-cart');
            triggerToast(`Đặt hàng #${checkoutSuccess.order_id} thành công.`);
        }
    }, [checkoutSuccess]);

    useEffect(() => {
        if (checkoutOpen) {
            setIsCheckoutOpen(true);
        }
    }, [checkoutOpen]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        triggerToast(`Đã thêm "${product.name}" vào giỏ hàng.`);
    };

    const toggleWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            setWishlist(wishlist.filter(item => item.id !== product.id));
            triggerToast(`Đã xóa khỏi danh sách yêu thích.`);
        } else {
            setWishlist([...wishlist, product]);
            triggerToast(`Đã thêm "${product.name}" vào yêu thích.`);
        }
    };

    const filteredProducts = activeFilter === 'ALL' 
        ? danhSachSanPham 
        : danhSachSanPham.filter(p => p.category === activeFilter);

    const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] font-['Inter',sans-serif] selection:bg-[#D4AF37] selection:text-black antialiased relative">
            <Head>
                <title>P-GUITAR LUXURY — Kiệt Tác Nhạc Cụ & Di Sản Âm Nhạc</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
            </Head>

            {toastMessage && (
                <div className="fixed bottom-8 right-8 z-50 bg-[#151515] border border-[#D4AF37] text-[#F4F0E8] px-6 py-4 shadow-2xl flex items-center space-x-3">
                    <span className="text-[#D4AF37]">✦</span>
                    <span className="text-xs uppercase tracking-widest">{toastMessage}</span>
                </div>
            )}

            <ThanhDieuHuong 
                cartCount={cart.reduce((sum, i) => sum + i.qty, 0)}
                wishlistCount={wishlist.length}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenCustomModal={() => setIsCustomModalOpen(true)}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                auth={auth} // Nhận dữ liệu auth từ Laravel truyền vào
            />

            <BannerChinh onOpenCustomModal={() => setIsCustomModalOpen(true)} />
            <CamKetThuongHieu />
            <LuoiDanhMuc onSelectCategory={(cat) => { setActiveFilter(cat); document.getElementById('store').scrollIntoView({ behavior: 'smooth' }); }} />
            <DanhSachSanPham 
                products={filteredProducts}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={addToCart}
                formatVND={formatVND}
            />
            <DangKyBanTin onTriggerToast={triggerToast} />
            <ChanTrang onOpenCustomModal={() => setIsCustomModalOpen(true)} />

            <GioHangTruot
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
                cart={cart}
                setCart={setCart}
                formatVND={formatVND}
            />
            <ThanhToan
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                setCart={setCart}
                auth={auth}
                formatVND={formatVND}
            />
            <SanPhamYeuThich isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlist={wishlist} onAddToCart={addToCart} formatVND={formatVND} />
            <TimKiemNhanh isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={danhSachSanPham} onSelectProduct={(p) => setQuickViewProduct(p)} formatVND={formatVND} />
            <XemNhanhSanPham product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} formatVND={formatVND} />
            <DangKyCustom isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} onTriggerToast={triggerToast} />
        </div>
    );
}
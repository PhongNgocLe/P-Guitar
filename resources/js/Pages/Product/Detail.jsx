import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ProductDetail({ product, related = [] }) {
  const [notice, setNotice] = useState('');
  const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + '₫';
  const available = Math.max(0, Number(product.stock_quantity) || 0);

  const addToCart = (forCheckout = false) => {
    if (!product.inStock || available === 0) {
      setNotice('Sản phẩm hiện đã hết hàng.');
      return false;
    }

    let cart;
    try {
      cart = JSON.parse(window.localStorage.getItem('pguitar-cart') || '[]');
    } catch (error) {
      console.error('Không thể đọc giỏ hàng đã lưu.', error);
      setNotice('Không thể đọc giỏ hàng. Vui lòng tải lại trang và thử lại.');
      return false;
    }

    if (!Array.isArray(cart)) {
      console.error('Dữ liệu giỏ hàng đã lưu không đúng định dạng.');
      setNotice('Dữ liệu giỏ hàng không hợp lệ. Vui lòng tải lại trang.');
      return false;
    }

    const existing = cart.find((item) => String(item.id) === String(product.id));
    const quantity = existing ? Number(existing.qty) : 0;
    const limit = Math.min(available, 99);

    if (existing && (!Number.isInteger(quantity) || quantity < 1)) {
      console.error('Số lượng sản phẩm trong giỏ hàng không hợp lệ.');
      setNotice('Số lượng trong giỏ hàng không hợp lệ. Vui lòng tải lại trang.');
      return false;
    }

    if (quantity >= limit) {
      if (forCheckout && quantity > 0) {
        return true;
      }

      setNotice(`Bạn đã chọn đủ số lượng sản phẩm hiện có (${limit}).`);
      return false;
    }

    const updatedCart = existing
      ? cart.map((item) => String(item.id) === String(product.id)
        ? { ...product, qty: quantity + 1 }
        : item)
      : [...cart, { ...product, qty: 1 }];

    try {
      window.localStorage.setItem('pguitar-cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Không thể lưu giỏ hàng.', error);
      setNotice('Không thể lưu giỏ hàng. Vui lòng kiểm tra bộ nhớ trình duyệt.');
      return false;
    }

    setNotice(`Đã thêm "${product.name}" vào giỏ hàng.`);
    return true;
  };

  const buyNow = () => {
    if (addToCart(true)) {
      window.location.href = '/?checkout=1';
    }
  };

  return (
    <>
      <Head title={product.name}>
        <meta name="description" content={`${product.name} - ${formatVND(product.price)} tại P-Guitar.`} />
      </Head>

      <main className="min-h-screen bg-[#0B0B0B] px-4 py-8 text-[#F4F0E8] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] transition hover:text-[#E6C76A]">
            <span aria-hidden="true">←</span> Quay lại cửa hàng
          </Link>

          {notice && (
            <p role="status" aria-live="polite" className="mt-5 border border-[#D4AF37]/40 bg-[#151515] px-4 py-3 text-sm text-[#E6C76A]">
              {notice}
            </p>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex min-h-[320px] items-center justify-center border border-white/10 bg-[#151515] p-6 sm:min-h-[520px]">
              <img src={product.img} alt={product.name} className="max-h-[480px] w-full object-contain" />
            </div>

            <section className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                {[product.category, product.tag].filter(Boolean).join(' · ')}
              </p>
              <h1 className="mt-3 text-3xl font-normal leading-tight sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <p className="text-2xl font-bold text-[#D4AF37]">{formatVND(product.price)}</p>
                {product.origPrice && Number(product.origPrice) > Number(product.price) && (
                  <p className="text-sm text-[#9B9B9B] line-through">{formatVND(product.origPrice)}</p>
                )}
              </div>

              <p className={`mt-4 text-sm font-medium ${product.inStock && available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.inStock && available > 0 ? `Còn ${available} sản phẩm` : 'Hết hàng'}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => addToCart()}
                  disabled={!product.inStock || available === 0}
                  className="border border-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:border-white/10 disabled:text-[#777] disabled:hover:bg-transparent disabled:hover:text-[#777]"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={!product.inStock || available === 0}
                  className="bg-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#E6C76A] disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-[#CCC]"
                >
                  Mua ngay
                </button>
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <section className="mt-10 border-t border-white/10 pt-6" aria-labelledby="product-specifications">
                  <h2 id="product-specifications" className="mb-4 text-lg text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Thông số sản phẩm
                  </h2>
                  <dl className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4 border-b border-white/5 pb-2 text-sm">
                        <dt className="uppercase text-[#9B9B9B]">{key}</dt>
                        <dd className="text-right text-white">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </section>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-white/10 pt-10">
              <h2 className="mb-6 text-2xl text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sản phẩm liên quan
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group border border-white/10 bg-[#151515] p-4 transition hover:border-[#D4AF37]/60"
                  >
                    <div className="flex h-44 items-center justify-center bg-[#0B0B0B] p-3">
                      <img src={item.img} alt={item.name} className="h-full w-full object-contain transition group-hover:scale-105" />
                    </div>
                    <h3 className="mt-4 text-sm text-[#F4F0E8] group-hover:text-[#D4AF37]">{item.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-[#D4AF37]">{formatVND(item.price)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

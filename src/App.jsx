import './App.css'

const guitars = [
  {
    name: 'Classic Acoustic FG-250',
    price: '4.200.000 đ',
    description: 'Âm thanh ấm, dành cho người mới học và trình diễn nhỏ.',
    details: ['6 dây', 'Gỗ Mahogany', 'Phù hợp học tập'],
  },
  {
    name: 'Electric Rock EX-100',
    price: '8.500.000 đ',
    description: 'Thiết kế mạnh mẽ, phù hợp cover nhạc rock và live show.',
    details: ['6 dây', 'Pickups đôi', 'Phù hợp sân khấu'],
  },
  {
    name: 'Ukulele Mini U-32',
    price: '1.500.000 đ',
    description: 'Nhỏ gọn, dễ cầm và rất hợp với người mới bắt đầu.',
    details: ['4 dây', 'Dễ chơi', 'Âm thanh nhẹ nhàng'],
  },
]

function App() {
  return (
    <div className="app-shell">
      <header className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">P-Guitar Store</p>
          <h1>Guitar đẹp, chất, dễ chơi cho mọi người</h1>
          <p>
            Trang web mẫu cho cửa hàng đàn guitar với giao diện đơn giản, rõ ràng và dễ chỉnh sửa.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#products">
              Xem sản phẩm
            </a>
            <a className="button button-secondary" href="#contact">
              Liên hệ ngay
            </a>
          </div>
        </div>
        <div className="hero-card">
          <span className="hero-tag">HOT</span>
          <h2>Guitar acoustic bán chạy</h2>
          <p>Thích hợp cho học sinh, sinh viên và người mới bắt đầu.</p>
          <div className="hero-meta">
            <span>6 dây</span>
            <span>Âm ấm</span>
            <span>Giá tốt</span>
          </div>
        </div>
      </header>

      <main>
        <section id="products" className="section section-products">
          <div className="section-heading">
            <p className="section-label">Bộ sưu tập</p>
            <h2>Đàn guitar nổi bật</h2>
            <p className="section-copy">
              Chọn đàn phù hợp với phong cách của bạn: acoustic, electric hoặc ukulele.
            </p>
          </div>
          <div className="product-grid">
            {guitars.map((guitar) => (
              <article key={guitar.name} className="product-card">
                <div className="product-badge">Guitar</div>
                <h3>{guitar.name}</h3>
                <p>{guitar.description}</p>
                <ul className="product-details">
                  {guitar.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <div className="product-footer">
                  <span className="price">{guitar.price}</span>
                  <button className="button button-primary">Mua ngay</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-benefits">
          <div className="section-heading">
            <p className="section-label">Ưu điểm</p>
            <h2>Tại sao chọn P-Guitar?</h2>
          </div>
          <div className="benefit-grid">
            <article className="benefit-card">
              <h3>Chất lượng tốt</h3>
              <p>Đàn được chọn lọc từ những thương hiệu có tiếng, đảm bảo âm thanh và độ bền.</p>
            </article>
            <article className="benefit-card">
              <h3>Giá cả hợp lý</h3>
              <p>Giá tốt cho học sinh, sinh viên và người mới chơi.</p>
            </article>
            <article className="benefit-card">
              <h3>Hỗ trợ khách hàng</h3>
              <p>Luôn sẵn sàng tư vấn chọn đàn và bảo hành nhanh chóng.</p>
            </article>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div>
          <p className="section-label">Liên hệ</p>
          <h2>Đặt mua hoặc hỏi thêm</h2>
          <p>Gửi tin nhắn cho chúng tôi qua email hoặc điện thoại để nhận tư vấn nhanh.</p>
        </div>
        <div className="contact-actions">
          <a className="button button-primary" href="mailto:contact@p-guitar.com">
            Email: contact@p-guitar.com
          </a>
          <a className="button button-secondary" href="tel:+84901234567">
            Gọi: +84 901 234 567
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App

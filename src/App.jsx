import { useState } from 'react'
import './App.css'

const guitars = [
  { id: 1, category: 'acoustic', name: 'Guitar Acoustic Classic', price: 4200000, discount: 15, image: 'src/assets/Guitar.jpg' },
  { id: 2, category: 'electric', name: 'Guitar Điện Rock Pro', price: 8500000, discount: 0, image: 'src/assets/Guitar.jpg' },
  { id: 3, category: 'ukulele', name: 'Ukulele Mini Travel', price: 1500000, discount: 20, image: 'src/assets/Guitar.jpg' },
  { id: 4, category: 'acoustic', name: 'Guitar 12 Dây Acoustic', price: 5800000, discount: 0, image: 'src/assets/Guitar.jpg' },
  { id: 5, category: 'accessories', name: 'Dây đàn chuyên nghiệp', price: 320000, discount: 10, image: 'src/assets/Guitar.jpg' },
]

const categories = [
  { name: 'Guitar Acoustic', slug: 'acoustic' },
  { name: 'Guitar Điện', slug: 'electric' },
  { name: 'Ukulele', slug: 'ukulele' },
  { name: 'Phụ Kiện', slug: 'accessories' },
]

const productCategories = [{ name: 'Tất cả', slug: 'all' }, ...categories]

const blogPosts = [
  {
    id: 1,
    title: 'Cách lựa chọn guitar cho người mới bắt đầu',
    date: '12/06/2026',
    excerpt: 'Hướng dẫn chọn guitar phù hợp theo phong cách, âm thanh và ngân sách.',
  },
  {
    id: 2,
    title: 'Bảo quản đàn và phụ kiện đúng cách',
    date: '05/06/2026',
    excerpt: 'Bí quyết giữ cho đàn luôn sáng đẹp, dành cho những ai yêu âm nhạc.',
  },
  {
    id: 3,
    title: 'Top những phụ kiện cần có cho người chơi guitar',
    date: '28/05/2026',
    excerpt: 'Đánh giá những phụ kiện tốt nhất giúp bạn tập luyện và biểu diễn.',
  },
]

function App() {
  const [userLogged, setUserLogged] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleAddToCart = () => {
    setCartCount(cartCount + 1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const filteredGuitars = selectedCategory === 'all'
    ? guitars
    : guitars.filter((guitar) => guitar.category === selectedCategory)

  return (
    <div className="container-shell">
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-img" style={{ width: '40%', height: '100%' }}>
              <img src="/src/assets/lg.png" alt="P-Guitar" />
            </div>
          </div>
          <div className="head-mid">
            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <input type="text" className="tim" placeholder="Tìm kiếm..." />
              <button type="submit" className="aicon">
                <i className="fa fa-search"></i>
              </button>
            </form>
            <div className="hotline-info">
              <span className="hotline-label">Hotline</span>
              <a href="tel:0334090425" className="hotline-number">0334 090 425</a>
            </div>
            {!userLogged ? (
              <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); setUserLogged(true); }}>
                <i className="fa fa-sign-in"></i> Đăng nhập
              </a>
            ) : (
              <div className="profile-wrapper">
                <button className="avatar-btn">P</button>
              </div>
            )}
            <div className="cart-icon-wrapper">
              <a href="#" className="cart-link">
                <i className="fa fa-shopping-cart"></i>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </a>
            </div>
          </div>
        </div>
        
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa fa-guitar"></i> P-Guitar</span>
          <h1 className="hero-title">Âm nhạc thăng hoa cùng cây đàn</h1>
          <p className="hero-description">Khám phá bộ sưu tập guitar và phụ kiện cao cấp. Mua ngay để nhận ưu đãi đặc biệt, giao nhanh và bảo hành uy tín.</p>
          <div className="hero-actions">
            <a href="#featured" className="hero-btn">Mua ngay</a>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo-strip">
        <div className="promo-card">
          <h2>ƯU ĐÃI FLASH SALE</h2>
          <p>Giảm tới 25% cho những cây đàn guitar hot nhất. Giao nhanh trong 24h.</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="category-shelf">
        <div className="section-heading">
          <h2>Danh mục <span>nổi bật</span></h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <a key={cat.slug} href="#" className="category-card">
              <h3>{cat.name}</h3>
              <p>Khám phá {cat.name.toLowerCase()}.</p>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCT INTRO */}
      <section className="product-intro">
        <div className="section-heading">
          <h2>Giới thiệu <span>sản phẩm</span></h2>
          <p>Không chỉ là guitar, mà là trải nghiệm âm nhạc chuyên nghiệp với sản phẩm chất lượng cao và phụ kiện hoàn hảo.</p>
        </div>
        <div className="intro-grid">
          <article className="intro-card">
            <h3>Âm thanh tuyệt vời</h3>
            <p>Những cây đàn được chọn lọc kỹ, thiết kế để mang đến tiết tấu âm nhạc trong trẻo và cân đối.</p>
          </article>
          <article className="intro-card">
            <h3>Chất lượng cao cấp</h3>
            <p>Guitar và phụ kiện được cam kết dùng vật liệu tốt nhất, đảm bảo bền đẹp và ổn định.</p>
          </article>
          <article className="intro-card">
            <h3>Trải nghiệm khách hàng</h3>
            <p>Hỗ trợ tư vấn chuyên nghiệp và giao hàng nhanh chóng để bạn có thể bắt đầu tập ngay.</p>
          </article>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="featured" className="products-section">
        <div className="section-heading">
          <h2>SẢN PHẨM <span>MỚI</span></h2>
        </div>
        <div className="filter-chips">
          {productCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`filter-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="products-container">
          {filteredGuitars.length > 0 ? (
            filteredGuitars.map((guitar) => (
              <div key={guitar.id} className="product-card-wrapper">
                <div className="sanpham-card">
                  {guitar.discount > 0 && <div className="sale-badge">Giảm {guitar.discount}%</div>}
                  <img src={guitar.image} alt={guitar.name} className="picture" />
                  <div className="card-body">
                    <h5 className="card-title">{guitar.name}</h5>
                    <p className="product-price">
                      {guitar.discount > 0 ? (
                        <>
                          <span className="price-new">{formatPrice(guitar.price * (1 - guitar.discount / 100))}</span>
                          <span className="price-old">{formatPrice(guitar.price)}</span>
                        </>
                      ) : (
                        formatPrice(guitar.price)
                      )}
                    </p>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Không có sản phẩm phù hợp với loại này.</p>
          )}
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-section">
        <div className="section-heading">
          <h2>Blog <span>Âm Nhạc</span></h2>
          <p>Các bài viết mới nhất về guitar, phụ kiện và kinh nghiệm cho người chơi.</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className="blog-date">{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <a href="#" className="blog-readmore">Xem thêm</a>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="logo-footer" style={{ width: '80%', height: '100%' }}>
              <img src="/src/assets/lg.png" alt="P-Guitar" />
            </div>
            <p><strong>P-Guitar</strong> - Nơi đam mê âm nhạc thăng hoa.</p>
            <p>Địa chỉ: 180 Cao Lỗ, TP. Hồ Chí Minh</p>
            <p>Điện thoại: <a href="tel:0334090425">0334 090 425</a></p>
            <p>Email: <a href="mailto:shopguitar@gmail.com">shopguitar@gmail.com</a></p>
          </div>
          <div className="footer-column">
            <h4>Dịch vụ khách hàng</h4>
            <ul>
              <li>Hỗ trợ 24/7</li>
              <li>Đổi trả nhanh chóng</li>
              <li>Giao hàng toàn quốc</li>
              <li>Bảo hành tận tâm</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Liên hệ</h4>
            <p>Theo dõi ưu đãi và nhận tư vấn.</p>
            <div className="social-icons">
              <a href="#"><img src="/src/assets/zalo.png" alt="Zalo" /></a>
              <a href="#"><img src="/src/assets/fb.png" alt="Facebook" /></a>
            </div>
          </div>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d692.9560881472422!2d106.67791069626654!3d10.738214421796897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1781178970027!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ địa chỉ P-Guitar"
          ></iframe>
        </div>
      </footer>
    </div>
  )
}

export default App
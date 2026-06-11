import { useState } from 'react'
import './App.css'

const guitars = [
  { id: 1, category: 'acoustic', name: 'Guitar Acoustic Classic', price: 4200000, discount: 15, image: 'src/assets/hero.png' },
  { id: 2, category: 'electric', name: 'Guitar Dien Rock Pro', price: 8500000, discount: 0, image: 'src/assets/Guitar.jpg' },
  { id: 3, category: 'ukulele', name: 'Ukulele Mini Travel', price: 1500000, discount: 20, image: 'src/assets/Guitar.jpg' },
  { id: 4, category: 'acoustic', name: 'Guitar 12 Day Acoust', price: 5800000, discount: 0, image: 'src/assets/Guitar.jpg' },
  { id: 5, category: 'accessories', name: 'Day dan chuyen nghiep', price: 320000, discount: 10, image: 'src/assets/Guitar.jpg' },
]

const categories = [
  { name: 'Guitar Acoustic', slug: 'acoustic' },
  { name: 'Guitar Dien', slug: 'electric' },
  { name: 'Ukulele', slug: 'ukulele' },
  { name: 'Phu Kien', slug: 'accessories' },
]

const productCategories = [{ name: 'Tat ca', slug: 'all' }, ...categories]

const blogPosts = [
  {
    id: 1,
    title: 'Cach lua chon guitar cho nguoi moi bat dau',
    date: '12/06/2026',
    excerpt: 'Huong dan chon guitar phu hop theo phong cach, am thanh va ngan sach.',
  },
  {
    id: 2,
    title: 'Bao quan dan va phu kien dung cach',
    date: '05/06/2026',
    excerpt: 'Bi quyet giu cho dan luon sang dep, danh cho nhung ai yeu am nhac.',
  },
  {
    id: 3,
    title: 'Top nhung phu kien can co cho nguoi choi guitar',
    date: '28/05/2026',
    excerpt: 'Danh gia nhung phu kien tot nhat giup ban tap luyen va bieu dien',
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
              <input type="text" className="tim" placeholder="Tìm kiếm" />
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
        <nav className="navbar-custom">
          <div className="nav-items">
            {categories.map((cat) => (
              <a key={cat.slug} href="#" className="nav-link">
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa fa-guitar"></i> P-Guitar</span>
          <h1 className="hero-title">Âm nhạc thăng hoa cùng cây đàn</h1>
          <p className="hero-description">Kham pha bo suu tap guitar va phu kien cao cap. Mua ngay de nhan uu dai dac biet, giao nhanh va bao hanh.</p>
          <div className="hero-actions">
            <a href="#featured" className="hero-btn">Mua ngay</a>
            <a href="#" className="hero-btn hero-btn-secondary">Phụ kiện hot</a>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo-strip">
        <div className="promo-card">
          <h2>ƯU ĐÃI FLASH SALE</h2>
          <p>Giam toi 25% cho nhung cay dan guitar hot nhat. Giao nhanh trong 24h.</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="category-shelf">
        <div className="section-heading">
          <h2>Danh muc <span>noi bat</span></h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <a key={cat.slug} href="#" className="category-card">
              <h3>{cat.name}</h3>
              <p>Kham pha {cat.name.toLowerCase()}.</p>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCT INTRO */}
      <section className="product-intro">
        <div className="section-heading">
          <h2>Gioi thieu <span>san pham</span></h2>
          <p>Khong chi la guitar, ma la trai nghiem am nhac chuyen nghiep voi san pham chat luong cao va phu kien hoan hao.</p>
        </div>
        <div className="intro-grid">
          <article className="intro-card">
            <h3>Am thanh tuyet voi</h3>
            <p>Nhung cay dan duoc chon loc ky, thiet ke de mang den tiet tan am nhac trong treo va can doi.</p>
          </article>
          <article className="intro-card">
            <h3>Chat luong cao cap</h3>
            <p>Guitar va phu kien duoc cam ket dung vat lieu tot nhat, dam bao ben dep va on dinh.</p>
          </article>
          <article className="intro-card">
            <h3>Trai nghiem khach hang</h3>
            <p>Ho tro tu van chuyen nghiep va giao hang nhanh chong de ban co the bat dau tap ngay.</p>
          </article>
        </div>
      </section>

      {/* PRODUCTS - Class "product-grid" đã được đổi thành "products-section" để fix lỗi layout */}
      <section id="featured" className="products-section">
        <div className="section-heading">
          <h2>SAN PHAM <span>MOI</span></h2>
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
                  {guitar.discount > 0 && <div className="sale-badge">Giam {guitar.discount}%</div>}
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
                      <i className="fa fa-cart-plus"></i> Them vao gio
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Khong co san pham phu hop voi loai nay.</p>
          )}
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-section">
        <div className="section-heading">
          <h2>Blog <span>Am Nhac</span></h2>
          <p>Cac bai viet moi nhat ve guitar, phu kien va kinh nghiem cho nguoi choi.</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className="blog-date">{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <a href="#" className="blog-readmore">Xem them</a>
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
            <p><strong>P-Guitar</strong> - Noi dam me am nhac thang hoa.</p>
            <p>Dia chi: 180 Cao Lo, Ho Chi Minh City</p>
            <p>Dien thoai: <a href="tel:0334090425">0334 090 425</a></p>
            <p>Email: <a href="mailto:shopguitar@gmail.com">shopguitar@gmail.com</a></p>
          </div>
          <div className="footer-column">
            <h4>Dich vu khach hang</h4>
            <ul>
              <li>Ho tro 24/7</li>
              <li>Doi tra nhanh chong</li>
              <li>Giao hang toan quoc</li>
              <li>Bao hanh tan tam</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Lien he</h4>
            <p>Theo doi uu dai va nhan tu van.</p>
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
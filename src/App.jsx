import { useState } from 'react'
import './App.css'

const guitars = [
  { id: 1, name: 'Guitar Acoustic Classic', price: 4200000, discount: 15, image: 'https://via.placeholder.com/280x320?text=Guitar+Acoustic' },
  { id: 2, name: 'Guitar Dien Rock Pro', price: 8500000, discount: 0, image: 'https://via.placeholder.com/280x320?text=Guitar+Dien' },
  { id: 3, name: 'Ukulele Mini Travel', price: 1500000, discount: 20, image: 'https://via.placeholder.com/280x320?text=Ukulele' },
  { id: 4, name: 'Guitar 12 Day Acoust', price: 5800000, discount: 0, image: 'https://via.placeholder.com/280x320?text=Guitar+12' },
]

const categories = [
  { name: 'Guitar Acoustic', slug: 'acoustic' },
  { name: 'Guitar Dien', slug: 'electric' },
  { name: 'Ukulele', slug: 'ukulele' },
  { name: 'Phu Kien', slug: 'accessories' },
]

function App() {
  const [userLogged, setUserLogged] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount(cartCount + 1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div className="container-shell">
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-img">P-Guitar</div>
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
                <button className="avatar-btn">N</button>
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
          <h2>Danh muc noi bat</h2>
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

      {/* PRODUCTS */}
      <section id="featured" className="product-grid">
        <div className="content-head">
          <h2>SAN PHAM MOI</h2>
        </div>
        <div className="products-container">
          {guitars.map((guitar) => (
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
                    ) : formatPrice(guitar.price)}
                  </p>
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <i className="fa fa-cart-plus"></i> Them vao gio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="logo-footer">P-Guitar</div>
            <p><strong>P-Guitar</strong> - Noi dam me am nhac thang hoa.</p>
            <p>Dia chi: Quan 1, Ho Chi Minh City</p>
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
              <a href="#">Zalo</a>
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copy">© 2024 P-Guitar. Ban quyen thuoc ve P-Guitar.</p>
          <p>Thiet ke website chuyen nghiep.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

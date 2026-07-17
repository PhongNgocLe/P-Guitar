import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pguitar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

let pool;
let dbReady = false;

async function connectDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    await pool.query('SELECT 1 AS ok');
    dbReady = true;
    console.log('✅ Kết nối MySQL thành công');
  } catch (error) {
    dbReady = false;
    console.error('❌ Kết nối MySQL thất bại:', error.message);
  }
}

connectDatabase();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbReady ? 'connected' : 'disconnected',
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    if (!dbReady || !pool) {
      return res.status(503).json({ success: false, message: 'Không thể kết nối cơ sở dữ liệu MySQL.' });
    }

    const { username, password, fullname = '', email = '', phone = '', address = '' } = req.body;
    const safeEmail = (email || '').trim();
    const safeFullname = (fullname || '').trim();
    const safePhone = (phone || '').trim();
    const safeAddress = (address || '').trim();

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 4 ký tự.' });
    }

    const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [trimmedUsername, safeEmail || null]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, fullname, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [trimmedUsername, hashedPassword, 'user', safeFullname, safeEmail, safePhone, safeAddress],
    );

    const [users] = await pool.query(
      'SELECT id, username, role, fullname, email, phone, address, created_at FROM users WHERE id = ?',
      [result.insertId],
    );

    res.status(201).json({ success: true, message: 'Đăng ký thành công.', user: sanitizeUser(users[0]) });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Đăng ký thất bại.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!dbReady || !pool) {
      return res.status(503).json({ success: false, message: 'Không thể kết nối cơ sở dữ liệu MySQL.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin.' });
    }

    const [users] = await pool.query(
      'SELECT id, username, password, role, fullname, email, phone, address, created_at FROM users WHERE username = ?',
      [username.trim()],
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại.' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    res.json({ success: true, message: 'Đăng nhập thành công.', user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Đăng nhập thất bại.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

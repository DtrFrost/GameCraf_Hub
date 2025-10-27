import express from 'express';
import pool from '../database.js';
import { hashPassword, comparePassword, generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - вход пользователя
router.post('/login', async (req, res) => {  // 👈 Убрал /auth
  try {
    console.log('🔐 Запрос на вход:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны' 
      });
    }

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );
    
    if (users.length === 0) {
      console.log('❌ Пользователь не найден:', email);
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.pass);
    
    if (!isPasswordValid) {
      console.log('❌ Неверный пароль для:', email);
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    const token = generateToken(user.id);
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    console.log('🎉 Успешный вход для:', user.email);

    res.json({
      message: 'Успешный вход в систему',
      user: userData,
      token
    });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера при входе' 
    });
  }
});

// POST /api/auth/register - регистрация пользователя
router.post('/register', async (req, res) => {  // 👈 Убрал /auth
  try {
    console.log('🔍 Начало регистрации...');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('❌ Валидация: не все поля заполнены');
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверяем email в БД
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );
    
    if (existingUsers.length > 0) {
      console.log('❌ Email уже существует');
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль и создаем пользователя
    const passwordHash = await hashPassword(password);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, pass, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), passwordHash, 1]
    );

    const token = generateToken(result.insertId);
    const [newUser] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    console.log('✅ Регистрация завершена для:', newUser[0].email);
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: newUser[0],
      token
    });

  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА РЕГИСТРАЦИИ:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера: ' + error.message 
    });
  }
});

// GET /api/auth/me - получение данных текущего пользователя
router.get('/me', authenticateToken, async (req, res) => {  // 👈 Убрал /auth
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database.js';
import { hashPassword, comparePassword, generateToken, authenticateToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = 3005;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Детальное логирование
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.body);
  next();
});

// ===== РЕГИСТРАЦИЯ С ДЕТАЛЬНЫМ ЛОГИРОВАНИЕМ =====
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔍 Начало регистрации...');
    const { name, email, password } = req.body;

    // Валидация
    if (!name || !email || !password) {
      console.log('❌ Валидация: не все поля заполнены');
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    console.log('✅ Валидация пройдена');

    // Проверяем email в БД
    console.log('🔍 Проверяем email в БД...');
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );
    
    if (existingUsers.length > 0) {
      console.log('❌ Email уже существует');
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    console.log('✅ Email свободен');

    // Хешируем пароль
    console.log('🔍 Хешируем пароль...');
    const passwordHash = await hashPassword(password);
    console.log('✅ Пароль захэширован');

    // Создаем пользователя
    console.log('🔍 Создаем пользователя в БД...');
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, pass, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), passwordHash, 1]
    );

    console.log('✅ Пользователь создан, ID:', result.insertId);

    // Генерируем токен
    const token = generateToken(result.insertId);

    // Получаем данные пользователя
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
    console.error('❌ Stack trace:', error.stack);
    
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера: ' + error.message 
    });
  }
});

// ===== ПРОСТОЙ ТЕСТ БД =====
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('🔍 Тестируем подключение к БД...');
    
    // Простой запрос к БД
    const [result] = await pool.execute('SELECT 1 + 1 as test');
    console.log('✅ Тест БД прошел:', result);
    
    // Проверяем таблицу users
    const [users] = await pool.execute('SHOW TABLES LIKE "users"');
    console.log('✅ Таблица users существует:', users.length > 0);
    
    // Структура таблицы
    const [structure] = await pool.execute('DESCRIBE users');
    console.log('📊 Структура users:', structure);
    
    res.json({ 
      db: '✅ БД работает', 
      test: result[0].test,
      users_table: users.length > 0,
      structure: structure
    });
    
  } catch (error) {
    console.error('❌ Ошибка теста БД:', error);
    res.status(500).json({ error: 'Ошибка БД: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
// database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Загружаем переменные из .env файла
dotenv.config();

// Настройки подключения к БД ИЗ .env
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // теперь пароль из .env
  database: process.env.DB_NAME || 'react_slim_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Создаем пул подключений
const pool = mysql.createPool(dbConfig);

// Функция для тестирования подключения
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Успешно подключено к MySQL базе данных');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error.message);
    return false;
  }
};

export default pool;
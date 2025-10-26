import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = 12;

/**
 * Хеширование пароля с использованием bcrypt
 */
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  } catch (error) {
    console.error('❌ Ошибка хеширования пароля:', error);
    throw new Error('Ошибка при создании пароля');
  }
};

/**
 * Сравнение пароля с хешем
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      return false;
    }
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('❌ Ошибка сравнения паролей:', error);
    return false;
  }
};

/**
 * Генерация JWT токена
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId, 
      type: 'access',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'gamecraft-hub-api'
    }
  );
};

/**
 * Верификация JWT токена
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('❌ Ошибка верификации токена:', error.message);
    throw new Error('Неверный или просроченный токен');
  }
};

/**
 * Middleware для аутентификации по JWT токену
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('❌ Токен отсутствует в запросе');
    return res.status(401).json({ 
      error: 'Токен доступа отсутствует',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = verifyToken(token);
    
    // Проверяем структуру токена
    if (!decoded.userId) {
      console.log('❌ Неверная структура токена');
      return res.status(403).json({ 
        error: 'Неверный формат токена',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    req.user = decoded;
    console.log(`✅ Токен верифицирован для пользователя: ${decoded.userId}`);
    next();
  } catch (error) {
    console.log('❌ Ошибка аутентификации:', error.message);
    
    let statusCode = 403;
    let errorCode = 'INVALID_TOKEN';
    
    if (error.message.includes('expired')) {
      statusCode = 401;
      errorCode = 'TOKEN_EXPIRED';
    }
    
    return res.status(statusCode).json({ 
      error: error.message,
      code: errorCode
    });
  }
};

/**
 * Middleware для проверки ролей (можно добавить позже)
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }
    
    // Здесь можно добавить проверку ролей, когда они появятся
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ error: 'Недостаточно прав' });
    // }
    
    next();
  };
};

/**
 * Генерация рефреш токена (можно добавить позже)
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId, 
      type: 'refresh',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { 
      expiresIn: '30d',
      issuer: 'gamecraft-hub-api'
    }
  );
};
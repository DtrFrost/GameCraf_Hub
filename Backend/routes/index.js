import express from 'express';
import requestLogger from '../middleware/logging.js';
import authRouter from './auth.js';
import guideRouter from './guides.js';

const router = express.Router();

// Глобальное логирование
router.use(requestLogger);

// Подключаем роуты С ПРЕФИКСАМИ
router.use('/auth', authRouter);      // 👈 Добавьте префикс
router.use('/guides', guideRouter);   // 👈 Добавьте префикс

// Тестовые эндпоинты
router.get('/test', (req, res) => {
  res.json({
    message: '✅ Сервер работает!',
    timestamp: new Date()
  });
});

router.get('/test-data', (req, res) => {
  res.json({
    message: 'Тестовый эндпоинт для данных',
    endpoints: {
      auth: 'GET /api/auth/*',
      guides: 'GET /api/guides/*',
      test: 'GET /api/test'
    }
  });
});

export default router;
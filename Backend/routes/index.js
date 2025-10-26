import express from 'express';
import requestLogger from '../middleware/logging.js';
import authRoutes from './auth.js';
import guideRoutes from './guides.js';

const router = express.Router();

// Глобальное логирование
router.use(requestLogger);

// Подключаем роуты
router.use(authRoutes);    // ← Должно быть authRoutes (с 's' на конце)
router.use(guideRoutes);   // ← Должно быть guideRoutes (с 's' на конце)

// Тестовые эндпоинты
router.get('/test', (req, res) => {
  res.json({ 
    message: '✅ Сервер работает!', 
    timestamp: new Date()
  });
});

router.get('/guides-test', (req, res) => {
  res.json({ message: 'Guides endpoint is working!' });
});

export default router;
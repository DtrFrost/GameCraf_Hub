import express from 'express';
import requestLogger from '../middleware/logging.js';
import authRouter from './auth.js';
import guideRouter from './guides.js';
import commentRouter from './comments.js';
import likeRouter from './likes.js';
import favoriteRouter from './favorites.js';
import notificationRouter from './notifications.js';
import buildRouter from './builds.js';
import buildLikeRouter from './buildLikes.js';
import buildFavoriteRouter from './buildFavorites.js';


const router = express.Router();

// Глобальное логирование
router.use(requestLogger);

// Подключаем роуты С ПРЕФИКСАМИ
router.use('/auth', authRouter);
router.use('/guides', guideRouter);
router.use('/comments', commentRouter);
router.use('/likes', likeRouter);
router.use('/favorites', favoriteRouter);
router.use('/notifications', notificationRouter);
router.use('/builds', buildRouter);
router.use('/build-likes', buildLikeRouter);
router.use('/build-favorites', buildFavoriteRouter);

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
      comments: 'GET /api/comments/*',
      likes: 'GET /api/likes/*',
      favorites: 'GET /api/favorites/*',
      notifications: 'GET /api/notifications/*',
      builds: 'GET /api/builds/*',
      'build-likes': 'GET /api/build-likes/*',
      'build-favorites': 'GET /api/build-favorites/*',
      test: 'GET /api/test'
    }
  });
});

export default router;
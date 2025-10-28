import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/build-likes/build/:buildId - получить лайки для сборки
router.get('/build/:buildId', async (req, res) => {
  try {
    const { buildId } = req.params;

    const [likes] = await pool.execute(
      'SELECT COUNT(*) as likes_count FROM build_likes WHERE build_id = ?',
      [buildId]
    );

    res.json({ likes: likes[0].likes_count });
  } catch (error) {
    console.error('Ошибка получения лайков сборки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/build-likes/build/:buildId/check - проверить лайк пользователя
router.get('/build/:buildId/check', authenticateToken, async (req, res) => {
  try {
    const { buildId } = req.params;
    const userId = req.user.userId;

    const [likes] = await pool.execute(
      'SELECT id FROM build_likes WHERE build_id = ? AND user_id = ?',
      [buildId, userId]
    );

    res.json({ liked: likes.length > 0 });
  } catch (error) {
    console.error('Ошибка проверки лайка сборки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/build-likes/build/:buildId/toggle - переключить лайк
router.post('/build/:buildId/toggle', authenticateToken, async (req, res) => {
  try {
    const { buildId } = req.params;
    const userId = req.user.userId;

    const [existingLikes] = await pool.execute(
      'SELECT id FROM build_likes WHERE build_id = ? AND user_id = ?',
      [buildId, userId]
    );

    if (existingLikes.length > 0) {
      await pool.execute(
        'DELETE FROM build_likes WHERE build_id = ? AND user_id = ?',
        [buildId, userId]
      );
      
      res.json({ liked: false, action: 'unliked' });
    } else {
      await pool.execute(
        'INSERT INTO build_likes (build_id, user_id) VALUES (?, ?)',
        [buildId, userId]
      );

      res.json({ liked: true, action: 'liked' });
    }
  } catch (error) {
    console.error('Ошибка переключения лайка сборки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
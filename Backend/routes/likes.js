import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/likes/guide/:guideId - получить лайки для гайда
router.get('/guide/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;

    const [likes] = await pool.execute(
      'SELECT COUNT(*) as likes_count FROM guide_likes WHERE guide_id = ?',
      [guideId]
    );

    res.json({ likes: likes[0].likes_count });
  } catch (error) {
    console.error('Ошибка получения лайков:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/likes/guide/:guideId/check - проверить лайк пользователя
router.get('/guide/:guideId/check', authenticateToken, async (req, res) => {
  try {
    const { guideId } = req.params;
    const userId = req.user.userId;

    const [likes] = await pool.execute(
      'SELECT id FROM guide_likes WHERE guide_id = ? AND user_id = ?',
      [guideId, userId]
    );

    res.json({ liked: likes.length > 0 });
  } catch (error) {
    console.error('Ошибка проверки лайка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/likes/guide/:guideId/toggle - переключить лайк
router.post('/guide/:guideId/toggle', authenticateToken, async (req, res) => {
  try {
    const { guideId } = req.params;
    const userId = req.user.userId;

    // Проверяем существующий лайк
    const [existingLikes] = await pool.execute(
      'SELECT id FROM guide_likes WHERE guide_id = ? AND user_id = ?',
      [guideId, userId]
    );

    if (existingLikes.length > 0) {
      // Удаляем лайк
      await pool.execute(
        'DELETE FROM guide_likes WHERE guide_id = ? AND user_id = ?',
        [guideId, userId]
      );
      
      res.json({ liked: false, action: 'unliked' });
    } else {
      // Добавляем лайк
      await pool.execute(
        'INSERT INTO guide_likes (guide_id, user_id) VALUES (?, ?)',
        [guideId, userId]
      );

      // Создаем уведомление для автора гайда
      const [guide] = await pool.execute(
        'SELECT user_id FROM guides WHERE id = ?',
        [guideId]
      );
      
      if (guide.length > 0 && guide[0].user_id !== userId) {
        await pool.execute(
          'INSERT INTO notifications (user_id, type, source_user_id, guide_id) VALUES (?, "like", ?, ?)',
          [guide[0].user_id, userId, guideId]
        );
      }

      res.json({ liked: true, action: 'liked' });
    }
  } catch (error) {
    console.error('Ошибка переключения лайка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
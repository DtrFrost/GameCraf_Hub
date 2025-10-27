import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications - получить уведомления пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [notifications] = await pool.execute(`
      SELECT 
        n.*,
        u.name as source_user_name,
        g.title as guide_title,
        c.text as comment_text,
        CASE 
          WHEN n.type = 'comment' THEN 'оставил комментарий к вашему гайду'
          WHEN n.type = 'reply' THEN 'ответил на ваш комментарий'
          WHEN n.type = 'like' THEN 'лайкнул ваш гайд'
          WHEN n.type = 'favorite' THEN 'добавил ваш гайд в избранное'
        END as message
      FROM notifications n
      LEFT JOIN users u ON n.source_user_id = u.id
      LEFT JOIN guides g ON n.guide_id = g.id
      LEFT JOIN comments c ON n.comment_id = c.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [userId]);

    res.json(notifications);
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/notifications/unread-count - получить количество непрочитанных
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [count] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({ count: count[0].count });
  } catch (error) {
    console.error('Ошибка получения количества уведомлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/notifications/:id/read - пометить как прочитанное
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Уведомление прочитано' });
  } catch (error) {
    console.error('Ошибка обновления уведомления:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/notifications/read-all - пометить все как прочитанные
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({ message: 'Все уведомления прочитаны' });
  } catch (error) {
    console.error('Ошибка обновления уведомлений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
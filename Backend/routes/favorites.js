import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/favorites - получить избранное пользователя со статистикой
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [favorites] = await pool.execute(`
      SELECT 
        g.*,
        u.name as author_name,
        f.created_at as favorited_at,
        (SELECT COUNT(*) FROM guide_likes gl WHERE gl.guide_id = g.id) as likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.guide_id = g.id AND c.is_deleted = FALSE) as comments_count,
        (SELECT bc.content_value 
         FROM guide_blocks gb 
         JOIN block_content bc ON gb.id = bc.block_id 
         WHERE gb.guide_id = g.id AND gb.block_type = 'cover' 
         LIMIT 1) as cover_image
      FROM user_favorites f
      LEFT JOIN guides g ON f.guide_id = g.id
      LEFT JOIN users u ON g.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [userId]);

    const favoritesWithStats = favorites.map(guide => ({
      ...guide,
      coverImage: guide.cover_image ? `/uploads/${guide.cover_image}` : null
    }));

    res.json(favoritesWithStats);
  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/favorites/guide/:guideId/check - проверить в избранном
router.get('/guide/:guideId/check', authenticateToken, async (req, res) => {
  try {
    const { guideId } = req.params;
    const userId = req.user.userId;

    const [favorites] = await pool.execute(
      'SELECT id FROM user_favorites WHERE guide_id = ? AND user_id = ?',
      [guideId, userId]
    );

    res.json({ favorited: favorites.length > 0 });
  } catch (error) {
    console.error('Ошибка проверки избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/favorites/guide/:guideId/toggle - переключить избранное
router.post('/guide/:guideId/toggle', authenticateToken, async (req, res) => {
  try {
    const { guideId } = req.params;
    const userId = req.user.userId;

    // Проверяем существующее избранное
    const [existingFavorites] = await pool.execute(
      'SELECT id FROM user_favorites WHERE guide_id = ? AND user_id = ?',
      [guideId, userId]
    );

    if (existingFavorites.length > 0) {
      // Удаляем из избранного
      await pool.execute(
        'DELETE FROM user_favorites WHERE guide_id = ? AND user_id = ?',
        [guideId, userId]
      );
      
      res.json({ favorited: false, action: 'removed' });
    } else {
      // Добавляем в избранное
      await pool.execute(
        'INSERT INTO user_favorites (guide_id, user_id) VALUES (?, ?)',
        [guideId, userId]
      );

      // Создаем уведомление для автора гайда
      const [guide] = await pool.execute(
        'SELECT user_id FROM guides WHERE id = ?',
        [guideId]
      );
      
      if (guide.length > 0 && guide[0].user_id !== userId) {
        await pool.execute(
          'INSERT INTO notifications (user_id, type, source_user_id, guide_id) VALUES (?, "favorite", ?, ?)',
          [guide[0].user_id, userId, guideId]
        );
      }

      res.json({ favorited: true, action: 'added' });
    }
  } catch (error) {
    console.error('Ошибка переключения избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
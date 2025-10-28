import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/build-favorites/:id/toggle - добавить/убрать сборку из избранного
router.post('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [existingFavorites] = await pool.execute(
      'SELECT * FROM build_favorites WHERE build_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingFavorites.length > 0) {
      await pool.execute(
        'DELETE FROM build_favorites WHERE build_id = ? AND user_id = ?',
        [id, userId]
      );
      res.json({ favorited: false });
    } else {
      await pool.execute(
        'INSERT INTO build_favorites (build_id, user_id) VALUES (?, ?)',
        [id, userId]
      );
      res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Ошибка избранного сборки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/build-favorites/:id/check - проверить избранное пользователя
router.get('/:id/check', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [favorites] = await pool.execute(
      'SELECT * FROM build_favorites WHERE build_id = ? AND user_id = ?',
      [id, userId]
    );
    
    res.json({ favorited: favorites.length > 0 });
  } catch (error) {
    console.error('Ошибка проверки избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/build-favorites - получить избранные сборки пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [favorites] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE build_id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE build_id = cb.id AND is_deleted = FALSE) as comments_count
      FROM build_favorites bf
      INNER JOIN character_builds cb ON bf.build_id = cb.id
      LEFT JOIN users u ON cb.user_id = u.id
      WHERE bf.user_id = ?
      ORDER BY bf.created_at DESC
    `, [userId]);

    const favoritesWithItems = favorites.map(build => {
      let items = [];
      try {
        items = build.items_json ? JSON.parse(build.items_json) : [];
      } catch (error) {
        items = [];
      }
      
      return {
        ...build,
        items: items
      };
    });

    res.json(favoritesWithItems);
  } catch (error) {
    console.error('Ошибка получения избранных сборок:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
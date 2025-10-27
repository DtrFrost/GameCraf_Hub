import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments/guide/:guideId - получить комментарии для гайда
router.get('/guide/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;

    const [comments] = await pool.execute(`
      SELECT 
        c.*,
        u.name as author_name,
        u.id as author_id,
        (SELECT COUNT(*) FROM comments c2 WHERE c2.parent_id = c.id AND c2.is_deleted = FALSE) as replies_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.guide_id = ? AND c.parent_id IS NULL AND c.is_deleted = FALSE
      ORDER BY c.created_at DESC
    `, [guideId]);

    // Получаем ответы для каждого комментария
    for (let comment of comments) {
      const [replies] = await pool.execute(`
        SELECT 
          c.*,
          u.name as author_name,
          u.id as author_id
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.parent_id = ? AND c.is_deleted = FALSE
        ORDER BY c.created_at ASC
      `, [comment.id]);
      
      comment.replies = replies;
    }

    res.json(comments);
  } catch (error) {
    console.error('Ошибка получения комментариев:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/comments - создать комментарий
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { guideId, text, parentId } = req.body;
    const userId = req.user.userId;

    if (!guideId || !text || !text.trim()) {
      return res.status(400).json({ error: 'Текст комментария обязателен' });
    }

    const [result] = await pool.execute(
      'INSERT INTO comments (guide_id, user_id, parent_id, text) VALUES (?, ?, ?, ?)',
      [guideId, userId, parentId || null, text.trim()]
    );

    // Получаем созданный комментарий с информацией об авторе
    const [comments] = await pool.execute(`
      SELECT 
        c.*,
        u.name as author_name,
        u.id as author_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    const newComment = comments[0];

    // Создаем уведомление для автора гайда, если это не он сам
    if (!parentId) {
      const [guide] = await pool.execute(
        'SELECT user_id FROM guides WHERE id = ?',
        [guideId]
      );
      
      if (guide.length > 0 && guide[0].user_id !== userId) {
        await pool.execute(
          'INSERT INTO notifications (user_id, type, source_user_id, guide_id, comment_id) VALUES (?, "comment", ?, ?, ?)',
          [guide[0].user_id, userId, guideId, result.insertId]
        );
      }
    } else {
      // Уведомление для автора родительского комментария
      const [parentComment] = await pool.execute(
        'SELECT user_id FROM comments WHERE id = ?',
        [parentId]
      );
      
      if (parentComment.length > 0 && parentComment[0].user_id !== userId) {
        await pool.execute(
          'INSERT INTO notifications (user_id, type, source_user_id, guide_id, comment_id) VALUES (?, "reply", ?, ?, ?)',
          [parentComment[0].user_id, userId, guideId, result.insertId]
        );
      }
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Ошибка создания комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/comments/:id - удалить комментарий
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [comment] = await pool.execute(
      'SELECT user_id FROM comments WHERE id = ?',
      [id]
    );

    if (comment.length === 0) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    if (comment[0].user_id !== userId) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    await pool.execute(
      'UPDATE comments SET is_deleted = TRUE WHERE id = ?',
      [id]
    );

    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
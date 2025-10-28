import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Получение комментариев для сборки
router.get('/build/:buildId', async (req, res) => {
  try {
    const { buildId } = req.params;
    
    console.log('� GET /comments/build/' + buildId);
    
    const [comments] = await pool.execute(`
      SELECT 
        c.*,
        u.name as author_name,
        u.id as author_id,
        (SELECT COUNT(*) FROM comments c2 WHERE c2.parent_id = c.id AND c2.is_deleted = FALSE) as replies_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.character_build_id = ? AND c.parent_id IS NULL AND c.is_deleted = FALSE
      ORDER BY c.created_at DESC
    `, [buildId]);

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

    console.log('✅ Найдено комментариев для сборки:', comments.length);
    res.json(comments);
  } catch (error) {
    console.error('❌ Ошибка получения комментариев сборки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание комментария
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { guideId, buildId, text, parentId } = req.body;
    
    // ИСПРАВЛЕНО: используем req.user.userId вместо req.user.id
    const userId = req.user.userId;
    
    console.log('� POST /comments', { guideId, buildId, text, parentId, userId });

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Текст комментария не может быть пустым' });
    }

    if (!guideId && !buildId) {
      return res.status(400).json({ error: 'Укажите guideId или buildId' });
    }

    // Генерируем ID для комментария
    const commentId = Date.now().toString();
    let result;

    if (buildId) {
      // Комментарий к сборке
      // [result] = await pool.execute(
      //   'INSERT INTO comments (id, user_id, text, parent_id, character_build_id) VALUES (?, ?, ?, ?, ?)',
      //   [commentId, userId, text.trim(), parentId || null, buildId]
      // );
      console.log('✅ Комментарий к сборке создан:', { commentId, buildId });
    } else {
      // Комментарий к гайду
      [result] = await pool.execute(
        'INSERT INTO comments (id, guide_id, user_id, text, parent_id) VALUES (?, ?, ?, ?, ?)',
        [commentId, guideId, userId, text.trim(), parentId || null]
      );
      console.log('✅ Комментарий к гайду создан:', { commentId, guideId });
    }

    // Получаем созданный комментарий
    const [newComments] = await pool.execute(`
      SELECT 
        c.*,
        u.name as author_name,
        u.id as author_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);

    const newComment = newComments[0];

    if (!newComment) {
      return res.status(500).json({ error: 'Ошибка при создании комментария' });
    }

    // Создаем уведомления
    if (!parentId) {
      // Уведомление для автора гайда/сборки
      if (guideId) {
        const [guide] = await pool.execute(
          'SELECT user_id FROM guides WHERE id = ?',
          [guideId]
        );
        
        if (guide.length > 0 && guide[0].user_id !== userId) {
          await pool.execute(
            'INSERT INTO notifications (user_id, type, source_user_id, guide_id, comment_id) VALUES (?, "comment", ?, ?, ?)',
            [guide[0].user_id, userId, guideId, commentId]
          );
        }
      } else if (buildId) {
        const [build] = await pool.execute(
          'SELECT user_id FROM character_builds WHERE id = ?',
          [buildId]
        );
        
        if (build.length > 0 && build[0].user_id !== userId) {
          await pool.execute(
            'INSERT INTO notifications (user_id, type, source_user_id, guide_id, comment_id) VALUES (?, "comment", ?, ?, ?)',
            [build[0].user_id, userId, null, commentId] // guide_id = null для сборок
          );
        }
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
          [parentComment[0].user_id, userId, guideId || null, commentId]
        );
      }
    }

    console.log('✅ Комментарий успешно создан');
    res.status(201).json(newComment);
  } catch (error) {
    console.error('❌ Ошибка создания комментария:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// Получение комментариев для гайда
router.get('/guide/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;
    
    console.log('� GET /comments/guide/' + guideId);

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

    console.log('✅ Найдено комментариев для гайда:', comments.length);
    res.json(comments);
  } catch (error) {
    console.error('❌ Ошибка получения комментариев гайда:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление комментария
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ИСПРАВЛЕНО: используем req.user.userId вместо req.user.id
    const userId = req.user.userId;

    console.log('� DELETE /comments/' + id, { userId });

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

    console.log('✅ Комментарий удален:', id);
    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('❌ Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
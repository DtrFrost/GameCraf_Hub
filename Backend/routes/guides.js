import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Отладка всех запросов к guides
router.use((req, res, next) => {
  console.log(`🎯 Guides Router: ${req.method} ${req.originalUrl}`);
  console.log(`📝 Path: ${req.path}, Params:`, req.params);
  next();
});

// 📍 ВАЖНО: Специфические маршруты ДО динамических!

// GET /api/guides/user/:userId - получить гайды пользователя со статистикой
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const [guides] = await pool.execute(`
      SELECT 
        g.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM guide_likes gl WHERE gl.guide_id = g.id) as likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.guide_id = g.id AND c.is_deleted = FALSE) as comments_count,
        (SELECT bc.content_value 
         FROM guide_blocks gb 
         JOIN block_content bc ON gb.id = bc.block_id 
         WHERE gb.guide_id = g.id AND gb.block_type = 'cover' 
         LIMIT 1) as cover_image
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
    `, [userId]);

    const guidesWithStats = guides.map(guide => ({
      ...guide,
      coverImage: guide.cover_image ? `/uploads/${guide.cover_image}` : null
    }));

    res.json(guidesWithStats);
  } catch (error) {
    console.error('Ошибка получения гайдов пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/guides/recent - получить последние гайды
router.get('/recent', async (req, res) => {
  try {
    console.log('📥 Запрос последних гайдов...');
    
    const [guides] = await pool.execute(`
      SELECT 
        g.id,
        g.title,
        g.game,
        g.created_at,
        u.name as author_name,
        bc.content_value as cover_image
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      LEFT JOIN guide_blocks gb ON gb.guide_id = g.id AND gb.block_type = 'cover'
      LEFT JOIN block_content bc ON bc.block_id = gb.id AND bc.content_type = 'image'
      ORDER BY g.created_at DESC 
      LIMIT 5
    `);

    console.log(`📊 Найдено гайдов: ${guides.length}`);

    // Преобразуем данные чтобы добавить coverImage
    const guidesWithCover = guides.map(guide => ({
      ...guide,
      coverImage: guide.cover_image ? `/uploads/${guide.cover_image}` : null
    }));

    console.log('📸 Гайды с обложками:', guidesWithCover.map(g => ({id: g.id, cover: g.coverImage})));

    res.json(guidesWithCover);

  } catch (error) {
    console.error('❌ Ошибка получения последних гайдов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/guides/public - получить все гайды
router.get('/public', async (req, res) => {
  console.log('🎯 ПОПАЛИ В /public!');
  try {
    const [guides] = await pool.execute(`
      SELECT 
        g.*, 
        u.name as author_name
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      ORDER BY g.created_at DESC
    `);

    console.log(`📊 Найдено гайдов: ${guides.length}`);
    res.json(guides);

  } catch (error) {
    console.error('❌ Ошибка получения публичных гайдов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/guides/debug/info - отладочная информация
router.get('/debug/info', async (req, res) => {
  try {
    console.log('🔍 Отладочная информация о гайдах...');
    
    // Проверим общее количество гайдов
    const [guideCount] = await pool.execute('SELECT COUNT(*) as count FROM guides');
    
    // Проверим несколько гайдов
    const [sampleGuides] = await pool.execute(`
      SELECT g.id, g.title, g.game, u.name as author 
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      ORDER BY g.created_at DESC 
      LIMIT 3
    `);

    res.json({
      totalGuides: guideCount[0].count,
      sampleGuides: sampleGuides,
      message: '✅ API работает, проверьте данные'
    });

  } catch (error) {
    console.error('❌ Ошибка отладки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/guides/game/:game - получить гайды по игре (доступно всем)
router.get('/game/:game', async (req, res) => {
  try {
    const gameName = req.params.game;
    console.log(`🎮 Запрос гайдов для игры: "${gameName}"`);
    
    const [guides] = await pool.execute(`
      SELECT 
        g.id,
        g.title, 
        g.game,
        g.created_at,
        u.name as author_name
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      WHERE g.game = ?
      ORDER BY g.created_at DESC
    `, [gameName]);

    console.log(`📊 Найдено гайдов для "${gameName}": ${guides.length}`);
    
    res.json(guides);
  } catch (error) {
    console.error('❌ Ошибка получения гайдов по игре:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/guides - создать гайд с загрузкой изображений
router.post('/', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'blockImages', maxCount: 10 }
]), async (req, res) => {
  let connection;
  try {
    const { title, game, blocks } = req.body;
    const userId = req.user.userId;
    const files = req.files;

    // Валидация
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Название гайда обязательно' });
    }
    if (!game || !game.trim()) {
      return res.status(400).json({ error: 'Название игры обязательно' });
    }
    if (!blocks) {
      return res.status(400).json({ error: 'Блоки гайда обязательны' });
    }

    console.log(`📝 Гайд: "${title}", Игра: "${game}"`);
    console.log(`👤 Автор: ${userId}`);

    // Парсим blocks из JSON строки
    let blocksData;
    try {
      blocksData = JSON.parse(blocks);
    } catch (e) {
      console.error('❌ Ошибка парсинга блоков:', e);
      return res.status(400).json({ error: 'Неверный формат блоков' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Создаем гайд
      const [guideResult] = await connection.execute(
        'INSERT INTO guides (title, game, user_id) VALUES (?, ?, ?)',
        [title.trim(), game.trim(), userId]
      );

      const guideId = guideResult.insertId;
      console.log(`✅ Гайд создан, ID: ${guideId}`);

      // Сохраняем обложку если есть
      if (files?.coverImage?.[0]) {
        const coverImagePath = files.coverImage[0].filename;
        const [coverBlockResult] = await connection.execute(
          'INSERT INTO guide_blocks (guide_id, block_type, content_order) VALUES (?, "cover", -1)',
          [guideId]
        );
        const coverBlockId = coverBlockResult.insertId;
        
        await connection.execute(
          'INSERT INTO block_content (block_id, content_type, content_value, content_order) VALUES (?, "image", ?, 0)',
          [coverBlockId, coverImagePath]
        );
        console.log('✅ Обложка сохранена:', coverImagePath);
      }

      // Сохраняем блоки гайда
      let savedBlocks = 0;
      let imageIndex = 0;

      for (let i = 0; i < blocksData.length; i++) {
        const block = blocksData[i];
        
        try {
          // Создаем блок гайда
          const [blockResult] = await connection.execute(
            'INSERT INTO guide_blocks (guide_id, block_type, content_order) VALUES (?, ?, ?)',
            [guideId, block.type, i]
          );

          const blockId = blockResult.insertId;

          // Сохраняем контент блока
          if (block.content) {
            // Текст
            if (block.content.text && block.content.text.trim()) {
              await connection.execute(
                'INSERT INTO block_content (block_id, content_type, content_value, content_order) VALUES (?, "text", ?, 0)',
                [blockId, block.content.text.trim()]
              );
            }
            
            // Изображение
            if (block.hasImage && files?.blockImages?.[imageIndex]) {
              const imagePath = files.blockImages[imageIndex].filename;
              await connection.execute(
                'INSERT INTO block_content (block_id, content_type, content_value, content_order) VALUES (?, "image", ?, 0)',
                [blockId, imagePath]
              );
              imageIndex++;
              console.log(`🖼️ Изображение сохранено: ${imagePath}`);
            }
          }
          
          savedBlocks++;
          
        } catch (blockError) {
          console.error(`❌ Ошибка в блоке ${i + 1}:`, blockError);
        }
      }

      await connection.commit();
      console.log(`🎉 Сохранено блоков: ${savedBlocks}/${blocksData.length}`);

      res.status(201).json({
        success: true,
        message: 'Гайд успешно создан',
        guideId: guideId,
        blocksCount: savedBlocks
      });

    } catch (transactionError) {
      if (connection) await connection.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('❌ Ошибка создания гайда:', error);
    res.status(500).json({ 
      error: 'Ошибка при создании гайда',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET /api/guides - получить все гайды пользователя (требует авторизации)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [guides] = await pool.execute(`
      SELECT g.*, u.name as author_name,
             (SELECT bc.content_value 
              FROM guide_blocks gb 
              JOIN block_content bc ON gb.id = bc.block_id 
              WHERE gb.guide_id = g.id AND gb.block_type = 'cover' 
              LIMIT 1) as cover_image
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
    `, [userId]);

    const guidesWithCover = guides.map(guide => ({
      ...guide,
      coverImage: guide.cover_image ? `/uploads/${guide.cover_image}` : null
    }));

    res.json(guidesWithCover);
  } catch (error) {
    console.error('Ошибка получения гайдов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ❗️САМЫЙ ПОСЛЕДНИЙ МАРШРУТ - динамический
// GET /api/guides/:id - получить гайд по ID
router.get('/:id', async (req, res) => {
  console.log(`🎯 ПОПАЛИ В /:id! ID: ${req.params.id}`);
  try {
    const guideId = req.params.id;

    const [guides] = await pool.execute(`
      SELECT g.*, u.name as author_name 
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      WHERE g.id = ?
    `, [guideId]);

    if (guides.length === 0) {
      return res.status(404).json({ error: 'Гайд не найден' });
    }

    const guide = guides[0];

    const [blocksWithContent] = await pool.execute(`
      SELECT 
        gb.id as block_id,
        gb.block_type,
        gb.content_order as block_order,
        bc.content_type,
        bc.content_value,
        bc.content_order as content_order
      FROM guide_blocks gb
      LEFT JOIN block_content bc ON gb.id = bc.block_id
      WHERE gb.guide_id = ?
      ORDER BY gb.content_order, bc.content_order
    `, [guideId]);

    // Структурируем данные
    const structuredBlocks = [];
    const blocksMap = new Map();

    blocksWithContent.forEach(row => {
      if (!blocksMap.has(row.block_id)) {
        blocksMap.set(row.block_id, {
          id: row.block_id,
          type: row.block_type,
          content_order: row.block_order,
          content: {}
        });
      }

      const block = blocksMap.get(row.block_id);
      
      if (row.content_type === 'text') {
        block.content.text = row.content_value;
      } else if (row.content_type === 'image') {
        if (row.block_type === 'cover') {
          guide.coverImage = `/uploads/${row.content_value}`;
        } else {
          block.content.image = `/uploads/${row.content_value}`;
        }
      }
    });

    // Добавляем только обычные блоки (не обложку)
    blocksMap.forEach((block, blockId) => {
      if (block.type !== 'cover') {
        structuredBlocks.push(block);
      }
    });

    structuredBlocks.sort((a, b) => a.content_order - b.content_order);
    guide.blocks = structuredBlocks;

    res.json(guide);

  } catch (error) {
    console.error('❌ Ошибка получения гайда:', error);
    res.status(500).json({ error: 'Ошибка при получении гайда' });
  }
});

export default router;
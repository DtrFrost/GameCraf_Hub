import express from 'express';
import pool from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/builds/game/:game - получить сборки по игре
router.get('/game/:game', async (req, res) => {
  try {
    const { game } = req.params;
    console.log('🔄 Получение сборок для игры:', game);
    
    const [builds] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE id = cb.id AND is_deleted = FALSE) as comments_count
      FROM character_builds cb
      LEFT JOIN users u ON cb.user_id = u.id
      WHERE cb.game_name = ?
      ORDER BY cb.created_at DESC
    `, [game]);

    console.log('📦 Найдено сборок:', builds.length);

    const buildsWithItems = builds.map(build => {
      let items = [];
      try {
        items = build.items_json ? JSON.parse(build.items_json) : [];
      } catch (error) {
        console.error('❌ Ошибка парсинга items_json:', error);
        items = [];
      }
      
      return {
        ...build,
        items: items
      };
    });

    res.json(buildsWithItems);
  } catch (error) {
    console.error('❌ Ошибка получения сборок по игре:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// GET /api/builds/characters/:game - получить персонажей игры
router.get('/characters/:game', async (req, res) => {
  try {
    const { game } = req.params;
    console.log('🔄 Получение персонажей для игры:', game);
    
    const [characters] = await pool.execute(
      'SELECT * FROM game_characters WHERE game_name = ?',
      [game]
    );

    console.log('👤 Найдено персонажей:', characters.length);
    res.json(characters);
  } catch (error) {
    console.error('❌ Ошибка получения персонажей:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/builds/items/:game - получить предметы игры
router.get('/items/:game', async (req, res) => {
  try {
    const { game } = req.params;
    console.log('🔄 Получение предметов для игры:', game);
    
    const [items] = await pool.execute(
      'SELECT * FROM game_items WHERE game_name = ?',
      [game]
    );

    console.log('🎒 Найдено предметов:', items.length);
    res.json(items);
  } catch (error) {
    console.error('❌ Ошибка получения предметов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/builds - получить сборки пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('🔄 Получение сборок пользователя:', userId);

    const [builds] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE id = cb.id AND is_deleted = FALSE) as comments_count
      FROM character_builds cb
      LEFT JOIN users u ON cb.user_id = u.id
      WHERE cb.user_id = ?
      ORDER BY cb.created_at DESC
    `, [userId]);

    console.log('📦 Найдено сборок пользователя:', builds.length);

    const buildsWithItems = builds.map(build => {
      let items = [];
      try {
        items = build.items_json ? JSON.parse(build.items_json) : [];
      } catch (error) {
        console.error('❌ Ошибка парсинга items_json:', error);
        items = [];
      }
      
      return {
        ...build,
        items: items
      };
    });

    res.json(buildsWithItems);
  } catch (error) {
    console.error('❌ Ошибка получения сборок:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// GET /api/builds/public - получить публичные сборки
router.get('/public', async (req, res) => {
  try {
    console.log('🔄 Получение публичных сборок');
    
    const [builds] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE id = cb.id AND is_deleted = FALSE) as comments_count
      FROM character_builds cb
      LEFT JOIN users u ON cb.user_id = u.id
      ORDER BY cb.created_at DESC
      LIMIT 20
    `);

    console.log('📦 Найдено публичных сборок:', builds.length);

    const buildsWithItems = builds.map(build => {
      let items = [];
      try {
        items = build.items_json ? JSON.parse(build.items_json) : [];
      } catch (error) {
        console.error('❌ Ошибка парсинга items_json:', error);
        items = [];
      }
      
      return {
        ...build,
        items: items
      };
    });

    res.json(buildsWithItems);
  } catch (error) {
    console.error('❌ Ошибка получения публичных сборок:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// GET /api/builds/:id - получить сборку по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔄 Получение сборки по ID:', id);

    const [builds] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE id = cb.id AND is_deleted = FALSE) as comments_count
      FROM character_builds cb
      LEFT JOIN users u ON cb.user_id = u.id
      WHERE cb.id = ?
    `, [id]);

    if (builds.length === 0) {
      return res.status(404).json({ error: 'Сборка не найдена' });
    }

    const build = builds[0];
    let items = [];
    try {
      items = build.items_json ? JSON.parse(build.items_json) : [];
    } catch (error) {
      console.error('❌ Ошибка парсинга items_json:', error);
      items = [];
    }

    build.items = items;

    res.json(build);
  } catch (error) {
    console.error('❌ Ошибка получения сборки:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// POST /api/builds - создать сборку
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, gameName, characterName, items, description, playstyle } = req.body;
    const userId = req.user.userId;

    console.log('🔄 Создание сборки:', { title, gameName, characterName, itemsCount: items.length, userId });

    if (!title || !gameName || !characterName || !items) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    let totalDamage = 0;
    let totalDefense = 0;
    let totalHealth = 0;

    const [characters] = await pool.execute(
      'SELECT base_damage, base_defense, base_health FROM game_characters WHERE game_name = ? AND character_name = ?',
      [gameName, characterName]
    );

    if (characters.length > 0) {
      totalDamage = characters[0].base_damage;
      totalDefense = characters[0].base_defense;
      totalHealth = characters[0].base_health;
    }

    for (const item of items) {
      if (item) {
        const [itemData] = await pool.execute(
          'SELECT damage_bonus, defense_bonus, health_bonus FROM game_items WHERE id = ?',
          [item.id]
        );
        
        if (itemData.length > 0) {
          totalDamage += itemData[0].damage_bonus;
          totalDefense += itemData[0].defense_bonus;
          totalHealth += itemData[0].health_bonus;
        }
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO character_builds (title, game_name, character_name, user_id, description, playstyle, items_json, total_damage, total_defense, total_health) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title.trim(), 
        gameName, 
        characterName, 
        userId, 
        description || null, 
        playstyle || null, 
        JSON.stringify(items), 
        totalDamage, 
        totalDefense, 
        totalHealth
      ]
    );

    const [newBuilds] = await pool.execute(`
      SELECT 
        cb.*,
        u.name as author_name,
        (SELECT COUNT(*) FROM build_likes WHERE id = cb.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE id = cb.id AND is_deleted = FALSE) as comments_count
      FROM character_builds cb
      LEFT JOIN users u ON cb.user_id = u.id
      WHERE cb.id = ?
    `, [result.insertId]);

    const newBuild = newBuilds[0];
    newBuild.items = items;

    console.log('✅ Сборка создана:', newBuild.id);
    res.status(201).json(newBuild);
  } catch (error) {
    console.error('❌ Ошибка создания сборки:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

export default router;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Импорт роутов
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = 3005;

// Получаем __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Подключаем роуты
app.use('/api', routes);

// Базовый эндпоинт
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 GameCraft Hub API работает!',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📁 Файлы доступны по: http://localhost:${PORT}/uploads/`);
});
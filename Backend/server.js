import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Временные "данные"
let tasks = [
  { id: 1, text: 'Изучить React', completed: false },
  { id: 2, text: 'Написать бэкенд', completed: true },
];

// API Routes

// GET /api/tasks - получить все задачи
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - создать новую задачу
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    text: req.body.text,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Бэкенд сервер запущен на http://localhost:${PORT}`);
});
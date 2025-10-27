# GameCraf_Hub

# Быстрый старт

```bash
git clone https://github.com/DtrFrost/GameCraf_Hub.git
cd GameCraf_Hub
npm install
npm install react-router-dom axios
npm run dev
# Запуск сервера (Backend)

в бэке:
cd GameCraf_hub
cd Backend
npm install dotenv express cors mysql2 bcryptjs jsonwebtoken multer
node server.js


JWT_SECRET=oAVglQFicf8ImJ3RhwvTJBLuGTy43eWraq7
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=react_slim_project
PORT=5000
NODE_ENV=development
=======
#Комиты команды
Все команды выполняются в Git Bash терминале в VSC.
Если выводит какие-то ошибки о том, что нет такой команды, вбивайте полностью ошибку в гпт.
ИНСТРУКЦИЯ ПО КОММИТУ НА ГИТХАБ (БАЗОВАЯ)
# 1. Проверить, где мы (УБЕДИТЕСЬ, что не в main!)
git branch

# 2. Если в main — переключиться на feature-(название фичи)
git checkout -b feature/(название фичи)

# 3. Добавить изменения
git add (конкретное название файла с расширением если есть. Либо просто . (Для добавления всего))

# 4. Сделать коммит (используйте -m чтобы избежать редактора)
git commit -m "(комментарий к коммиту, желательно начинать с названия того, что сделали и через : что конкретно) (например:)header: updated styles"

# 5. ОТПРАВИТЬ на GitHub (это ключевой шаг!)
git push origin (пишите название ветки на которой находитесь, главное чтобы не main, название ветки в которой вы находитесь выделяется синим цветом в терминале в скобках в конце)

# Начать новую задачу:
git checkout develop
git pull origin develop
git checkout -b feature/название-фичи

# Работать и сохранять прогресс:
git add .
git commit -m "тип(область): понятное описание"
git push origin feature/название-фичи

# После завершения задачи:
# 1. Создать PR на GitHub из feature/... в develop.
# 2. Пройти код-ревью.
# 3. Влить через "Squash and Merge".
# 4. Удалить ветку на GitHub.
# 5. Вернуться к шагу "Начать новую задачу".

#Запуск сервера (Backend)

node server.js

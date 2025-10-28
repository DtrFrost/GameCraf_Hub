-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Окт 27 2025 г., 23:46
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `react_slim_project`
--

-- --------------------------------------------------------

--
-- Структура таблицы `block_content`
--

CREATE TABLE `block_content` (
  `id` int(11) NOT NULL,
  `block_id` int(11) NOT NULL,
  `content_type` enum('text','image') NOT NULL,
  `content_value` text NOT NULL,
  `content_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `block_content`
--

INSERT INTO `block_content` (`id`, `block_id`, `content_type`, `content_value`, `content_order`) VALUES
(1, 1, 'text', 'NTRCN', 0),
(3, 2, 'image', '1761490154965-909010753.jpg', 0),
(4, 3, 'text', 'dasdsaasd', 0),
(5, 4, 'text', 'Dota 2 - это сложная, но очень увлекательная MOBA игра. В этом гайде я расскажу основы для новичков.', 0),
(6, 5, 'text', 'Карта Dota 2 разделена на три линии: верхнюю, среднюю и нижнюю. Каждая линия имеет свои башни и крипов.', 0),
(7, 5, 'image', 'dota_map.jpg', 0),
(8, 6, 'text', 'Основные роли героев: керри (основной урон), мидер (центральная линия), оффлейнер (сложная линия), саппорт (помощник), хард-саппорт (полная поддержка).', 0),
(9, 7, 'text', 'Elden Ring предлагает огромное разнообразие билдов. Вот самые эффективные из них.', 0),
(10, 8, 'text', 'Магический билд: фокусируется на интеллекте и ментальности. Идеален для дальнего боя.', 0),
(11, 8, 'image', 'mage_build.jpg', 0),
(12, 9, 'text', 'Силовой билд: требует высокой силы и выносливости. Отлично подходит для тяжелого оружия и доспехов.', 0),
(13, 10, 'text', 'Ловкач: билд на ловкость позволяет быстро уворачиваться и наносить быстрые атаки.', 0),
(14, 10, 'image', 'dex_build.jpg', 0),
(15, 11, 'text', 'Рейды - это самые сложные PvE испытания в WoW. Правильная стратегия - ключ к успеху.', 0),
(16, 12, 'text', 'Состав группы: 2 танка, 4-5 хилов, 13-14 дамагеров. Важно сбалансировать классы.', 0),
(17, 13, 'text', 'Позиционирование: танки держат босса спиной к группе, дамагеры атакуют сзади, хилы стоят на безопасном расстоянии.', 0),
(18, 13, 'image', 'raid_positioning.jpg', 0),
(19, 14, 'text', 'CS:GO требует не только хорошего прицеливания, но и тактического мышления.', 0),
(20, 15, 'text', 'Тренировка прицеливания: используйте карты aim_training и практикуйтесь по 15-20 минут перед игрой.', 0),
(21, 15, 'image', 'aim_practice.jpg', 0),
(22, 16, 'text', 'Экономика: учитесь правильно управлять деньгами. Не покупайте каждый раунд, если не уверены.', 0),
(23, 17, 'text', 'Командная работа: общайтесь с тиммейтами, сообщайте позиции врагов и координируйте атаки.', 0),
(24, 18, 'text', 'В Hogwarts Legacy доступно множество заклинаний, каждое со своей уникальной механикой.', 0),
(25, 19, 'text', 'Боевые заклинания: Incendio, Confringo, Expelliarmus - основные заклинания для боя.', 0),
(26, 19, 'image', 'combat_spells.jpg', 0),
(27, 20, 'text', 'Утилитарные заклинания: Lumos, Reparo, Alohomora помогут в исследовании мира.', 0),
(28, 20, 'image', 'utility_spells.jpg', 0),
(29, 21, 'text', 'Комбинации заклинаний: используйте Levioso затем Accio для эффективных комбо.', 0),
(30, 22, 'text', 'Dota 2 - это сложная, но очень увлекательная MOBA игра. В этом гайде я расскажу основы для новичков.', 0),
(31, 23, 'text', 'Карта Dota 2 разделена на три линии: верхнюю, среднюю и нижнюю. Каждая линия имеет свои башни и крипов.', 0),
(32, 24, 'text', 'Elden Ring предлагает огромное разнообразие билдов. Вот самые эффективные из них.', 0),
(33, 25, 'text', 'Магический билд: фокусируется на интеллекте и ментальности. Идеален для дальнего боя.', 0),
(34, 26, 'text', 'Рейды - это самые сложные PvE испытания в WoW. Правильная стратегия - ключ к успеху.', 0),
(35, 27, 'text', 'Состав группы: 2 танка, 4-5 хилов, 13-14 дамагеров. Важно сбалансировать классы.', 0),
(36, 28, 'text', 'Team Fortress 2 - это командный шутер с 9 уникальными классами. Каждый класс имеет свои сильные и слабые стороны.', 0),
(37, 29, 'text', 'Scout: быстрый класс с низким здоровьем. Идеален для захвата точек и флагов.', 0),
(38, 30, 'text', 'Soldier: универсальный класс с ракетницей. Хорош как для атаки, так и для защиты.', 0),
(39, 31, 'text', 'Soldier - один из самых популярных классов в TF2. Вот эффективные сборки оружия.', 0),
(40, 32, 'text', 'Стандартная сборка: Rocket Launcher, Shotgun, Escape Plan', 0),
(41, 33, 'text', 'The Binding of Isaac - это рогалик с элементами экшена. Игра может показаться сложной для новичков.', 0),
(42, 34, 'text', 'Основные механики: слезы как оружие, сбор предметов, открытие комнат.', 0),
(43, 35, 'text', 'Сборки предметов могут кардинально изменить геймплей. Вот самые сильные комбинации.', 0),
(44, 36, 'text', 'Minecraft - это песочница с безграничными возможностями. Начните с основ выживания.', 0),
(45, 37, 'text', 'Первые шаги: соберите дерево, создайте верстак, постройте убежище до наступления ночи.', 0),
(46, 38, 'text', 'Строительство - одна из основных механик Minecraft. Вот полезные сборки для строителей.', 0),
(47, 39, 'text', 'Это текст гайда как попасть в КРАЙ в Minecraft', 0),
(48, 40, 'image', '1761570258865-552965281.jpg', 0),
(49, 41, 'text', 'Сегодня мы узнаем, почему?', 0),
(50, 42, 'image', '1761570258861-763395089.jpg', 0),
(51, 43, 'text', 'Здесь должен быть блок картинка + текст', 0),
(52, 43, 'image', '1761570556122-296663883.jpg', 0),
(53, 44, 'text', 'Скоро...', 0),
(54, 45, 'image', '1761571961827-88730745.jpg', 0),
(55, 46, 'text', 'ntrcn', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `build_favorites`
--

CREATE TABLE `build_favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `build_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `build_likes`
--

CREATE TABLE `build_likes` (
  `id` int(11) NOT NULL,
  `build_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `character_builds`
--

CREATE TABLE `character_builds` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `character_name` varchar(100) NOT NULL,
  `game_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `weapons` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `playstyle` text DEFAULT NULL,
  `items_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items_json`)),
  `total_damage` int(11) DEFAULT 0,
  `total_defense` int(11) DEFAULT 0,
  `total_health` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 1,
  `views_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `character_builds`
--

INSERT INTO `character_builds` (`id`, `title`, `character_name`, `game_name`, `description`, `weapons`, `skills`, `playstyle`, `items_json`, `total_damage`, `total_defense`, `total_health`, `user_id`, `is_public`, `views_count`, `created_at`, `updated_at`) VALUES
(1, 'Сборка разведчика от Андрея', 'Разведчик', 'Team Fortress 2', 'Супер сборка в супер описался', NULL, NULL, NULL, '[{\"id\":2},{\"id\":3},{\"id\":1},{\"id\":2}]', 135, 20, 125, 4, 1, 0, '2025-10-27 21:53:15', '2025-10-27 21:53:15'),
(2, 'ВААЫЫЫ', 'Разведчик', 'Team Fortress 2', 'ыаваывыав', NULL, NULL, NULL, '[{\"id\":2},{\"id\":3},{\"id\":1},{\"id\":2}]', 135, 20, 125, 4, 1, 0, '2025-10-27 21:56:14', '2025-10-27 21:56:14');

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `text` text NOT NULL,
  `is_edited` tinyint(1) DEFAULT 0,
  `likes_count` int(11) DEFAULT 0,
  `dislikes_count` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `comments`
--

INSERT INTO `comments` (`id`, `guide_id`, `user_id`, `parent_id`, `text`, `is_edited`, `likes_count`, `dislikes_count`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 22, 4, NULL, 'Qje', 0, 0, 0, 0, '2025-10-27 15:58:29', '2025-10-27 15:58:29'),
(2, 22, 4, 1, 'Не понял', 0, 0, 0, 0, '2025-10-27 15:58:43', '2025-10-27 15:58:43'),
(3, 22, 9, NULL, 'Вот это прикол', 0, 0, 0, 0, '2025-10-27 15:59:30', '2025-10-27 15:59:30'),
(4, 22, 9, 1, 'Я так и не понял', 0, 0, 0, 0, '2025-10-27 15:59:41', '2025-10-27 15:59:41'),
(5, 22, 10, NULL, 'это комментарий', 0, 0, 0, 0, '2025-10-27 16:27:23', '2025-10-27 16:27:23'),
(6, 22, 10, 1, 'это ответ', 0, 0, 0, 0, '2025-10-27 16:27:37', '2025-10-27 16:27:37');

-- --------------------------------------------------------

--
-- Структура таблицы `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `genre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `game_characters`
--

CREATE TABLE `game_characters` (
  `id` int(11) NOT NULL,
  `game_name` varchar(100) NOT NULL,
  `character_name` varchar(100) NOT NULL,
  `character_image` varchar(255) DEFAULT NULL,
  `base_damage` int(11) DEFAULT 0,
  `base_defense` int(11) DEFAULT 0,
  `base_health` int(11) DEFAULT 100,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `game_characters`
--

INSERT INTO `game_characters` (`id`, `game_name`, `character_name`, `character_image`, `base_damage`, `base_defense`, `base_health`, `created_at`) VALUES
(1, 'Team Fortress 2', 'Разведчик', './Frontend/public/characters/tf2/scout.png', 50, 20, 125, '2025-10-27 17:34:35'),
(2, 'Team Fortress 2', 'Солдат', './Frontend/public/characters/tf2/soldier.png', 75, 40, 200, '2025-10-27 17:34:35'),
(3, 'Team Fortress 2', 'Поджигатель', './Frontend/public/characters/tf2/pyro.png', 60, 30, 175, '2025-10-27 17:34:35'),
(4, 'Team Fortress 2', 'Подрывник', './Frontend/public/characters/tf2/demoman.png', 80, 25, 175, '2025-10-27 17:34:35'),
(5, 'Team Fortress 2', 'Пулеметчик', './Frontend/public/characters/tf2/heavy.png', 100, 60, 300, '2025-10-27 17:34:35'),
(6, 'Team Fortress 2', 'Инженер', './Frontend/public/characters/tf2/engineer.png', 40, 35, 125, '2025-10-27 17:34:35'),
(7, 'Team Fortress 2', 'Медик', './Frontend/public/characters/tf2/medic.png', 30, 25, 150, '2025-10-27 17:34:35'),
(8, 'Team Fortress 2', 'Снайпер', './Frontend/public/characters/tf2/sniper.png', 90, 20, 125, '2025-10-27 17:34:35');

-- --------------------------------------------------------

--
-- Структура таблицы `game_items`
--

CREATE TABLE `game_items` (
  `id` int(11) NOT NULL,
  `game_name` varchar(100) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_image` varchar(255) DEFAULT NULL,
  `item_description` text DEFAULT NULL,
  `damage_bonus` int(11) DEFAULT 0,
  `defense_bonus` int(11) DEFAULT 0,
  `health_bonus` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `game_items`
--

INSERT INTO `game_items` (`id`, `game_name`, `item_name`, `item_image`, `item_description`, `damage_bonus`, `defense_bonus`, `health_bonus`, `created_at`) VALUES
(1, 'Team Fortress 2', 'Неумолимая сила', './Frontend/public/items/tf2/Force-A-Nature.png', NULL, 50, 0, 0, '2025-10-27 17:35:11'),
(2, 'Team Fortress 2', 'Обрез малыша', './Frontend/public/items/tf2/Babyfaceblaster.png', NULL, 10, 0, 0, '2025-10-27 17:35:11'),
(3, 'Team Fortress 2', 'Прерыватель', './Frontend/public/items/tf2/Shortstop.png', NULL, 15, 0, 0, '2025-10-27 17:35:11'),
(4, 'Team Fortress 2', 'Окрылённый', './Frontend/public/items/tf2/Winger.png', NULL, 0, 20, 0, '2025-10-27 17:35:11'),
(5, 'Team Fortress 2', 'Автомайзер', './Frontend/public/items/tf2/Atomizer.png', NULL, 0, 0, 15, '2025-10-27 17:35:11'),
(6, 'Team Fortress 2', 'Ракетная установка', './Frontend/public/items/tf2/Thermal_Thruster.png', NULL, 40, 0, 0, '2025-10-27 17:35:11'),
(7, 'Team Fortress 2', 'Чёрный ящик', './Frontend/public/items/tf2/Blackbox.png', NULL, 25, 0, 20, '2025-10-27 17:35:11'),
(8, 'Team Fortress 2', 'Прямой удар', './Frontend/public/items/tf2/Directhittransparent.png', NULL, 60, 0, -20, '2025-10-27 17:35:11'),
(9, 'Team Fortress 2', 'Огнемёт', './Frontend/public/items/tf2/RedFlamethrowerTilt.png', NULL, 35, 0, 0, '2025-10-27 17:35:11'),
(10, 'Team Fortress 2', 'Отбойный молоток', './Frontend/public/items/tf2/Homewrecker.png', NULL, 20, 0, 0, '2025-10-27 17:35:11'),
(11, 'Team Fortress 2', 'Силовая установка', './Frontend/public/items/tf2/Rocket_launcher.png', NULL, 15, 0, 25, '2025-10-27 17:35:11'),
(12, 'Team Fortress 2', 'Граната с липкой бомбой', './Frontend/public/items/tf2/Sticky.png', NULL, 55, 0, 0, '2025-10-27 17:35:11'),
(13, 'Team Fortress 2', 'Чародейский посох', './Frontend/public/items/tf2/Persian_Persuader.png', NULL, 30, 0, 15, '2025-10-27 17:35:11'),
(14, 'Team Fortress 2', 'Перчатки бегуна', './Frontend/public/items/tf2/Gloves_of_Running_Urgently.png', NULL, 0, 10, 0, '2025-10-27 17:35:11'),
(15, 'Team Fortress 2', 'Пулемёт', './Frontend/public/items/tf2/Minigun.png', NULL, 70, 0, 0, '2025-10-27 17:35:11'),
(16, 'Team Fortress 2', 'Барабанный магазин', './Frontend/public/items/tf2/Panic_Attack.png', NULL, 0, 10, 0, '2025-10-27 17:35:11'),
(17, 'Team Fortress 2', 'Хьюлонг Хитатор', './Frontend/public/items/tf2/Huo-Long_Heater.png', NULL, 45, 0, -25, '2025-10-27 17:35:11'),
(18, 'Team Fortress 2', 'Дробовик', './Frontend/public/items/tf2/Shotgun.png', NULL, 25, 0, 0, '2025-10-27 17:35:11'),
(19, 'Team Fortress 2', 'Гаечный ключ', './Frontend/public/items/tf2/Wrench.png', NULL, 20, 15, 0, '2025-10-27 17:35:11'),
(20, 'Team Fortress 2', 'Наводчик', './Frontend/public/items/tf2/Wrangler.png', NULL, 15, 10, 25, '2025-10-27 17:35:11'),
(21, 'Team Fortress 2', 'Иглострел', './Frontend/public/items/tf2/Syringe_Gun.png', NULL, 20, 0, 0, '2025-10-27 17:35:11'),
(22, 'Team Fortress 2', 'Крит-а-кола', './Frontend/public/items/tf2/Crit-a-Cola.png', NULL, 30, -10, 0, '2025-10-27 17:35:11'),
(23, 'Team Fortress 2', 'Снайперская винтовка', './Frontend/public/items/tf2/Sniper_rifle.png', NULL, 80, 0, 0, '2025-10-27 17:35:11'),
(24, 'Team Fortress 2', 'Портной карманный пистолет', './Frontend/public/items/tf2/Cleaner\'s_Carbine.png', NULL, 60, 0, 0, '2025-10-27 17:35:11'),
(25, 'Team Fortress 2', 'Хитман Харриер', './Frontend/public/items/tf2/Tribalman\'s_shiv.png', NULL, 75, 0, 0, '2025-10-27 17:35:11');

-- --------------------------------------------------------

--
-- Структура таблицы `guides`
--

CREATE TABLE `guides` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `game` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `guides`
--

INSERT INTO `guides` (`id`, `title`, `game`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Название гайда', 'Макнсрафт', 4, '2025-10-26 14:07:04', '2025-10-26 14:07:04'),
(3, 'fdffdfd', 'dssdds', 4, '2025-10-26 14:49:14', '2025-10-26 14:49:14'),
(4, '🎮 Полное руководство по Dota 2 для новичков', 'Dota 2', 5, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(5, '⚔️ Лучшие билды для персонажей в Elden Ring', 'Elden Ring', 5, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(6, '🏆 Стратегия прохождения рейдов в World of Warcraft', 'World of Warcraft', 5, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(7, '🎯 Как стать лучше в CS:GO - советы от профессионалов', 'CS:GO', 5, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(8, '🧙‍♂️ Гайд по заклинаниям в Hogwarts Legacy', 'Hogwarts Legacy', 5, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(9, '🎮 Полное руководство по Dota 2 для новичков', 'Dota 2', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(10, '⚔️ Лучшие билды для персонажей в Elden Ring', 'Elden Ring', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(11, '🏆 Стратегия прохождения рейдов в World of Warcraft', 'World of Warcraft', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(12, '🎯 Гайд по классам в Team Fortress 2', 'Team Fortress 2', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(13, '🔫 Лучшие сборки для Soldier в TF2', 'Team Fortress 2', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(14, '👶 Начальный гайд по The Binding of Isaac', 'The binding of Isaac', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(15, '💣 Эффективные сборки в Binding of Isaac', 'The binding of Isaac', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(16, '⛏️ Гайд по выживанию в Minecraft', 'Minecraft', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(17, '🏰 Лучшие сборки для строительства в Minecraft', 'Minecraft', 7, '2025-10-27 09:53:40', '2025-10-27 09:53:40'),
(18, 'Как попасть в АД?', 'Minecraft', 4, '2025-10-27 13:01:59', '2025-10-27 13:01:59'),
(19, 'лолошлошка школьник или Старик?', 'Minecraft', 4, '2025-10-27 13:04:18', '2025-10-27 13:04:18'),
(20, 'Гайд номер 2 почему админ на гниде?', 'Minecraft', 4, '2025-10-27 13:09:16', '2025-10-27 13:09:16'),
(21, 'Обосраться и не встать, возможно или миф?', '💑 Real Life', 4, '2025-10-27 13:13:50', '2025-10-27 13:13:50'),
(22, 'Тестовый гайд обложки', 'Minecraft', 4, '2025-10-27 13:32:41', '2025-10-27 13:32:41');

-- --------------------------------------------------------

--
-- Структура таблицы `guide_blocks`
--

CREATE TABLE `guide_blocks` (
  `id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `block_type` varchar(50) NOT NULL,
  `content_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `guide_blocks`
--

INSERT INTO `guide_blocks` (`id`, `guide_id`, `block_type`, `content_order`, `created_at`) VALUES
(1, 1, 'text', 0, '2025-10-26 14:07:04'),
(2, 3, 'cover', -1, '2025-10-26 14:49:15'),
(3, 3, 'text', 0, '2025-10-26 14:49:15'),
(4, 4, 'text', 0, '2025-10-27 09:36:39'),
(5, 4, 'text-image', 1, '2025-10-27 09:36:39'),
(6, 4, 'text', 2, '2025-10-27 09:36:39'),
(7, 5, 'text', 0, '2025-10-27 09:36:39'),
(8, 5, 'image-text', 1, '2025-10-27 09:36:39'),
(9, 5, 'text', 2, '2025-10-27 09:36:39'),
(10, 5, 'text-image', 3, '2025-10-27 09:36:39'),
(11, 6, 'text', 0, '2025-10-27 09:36:39'),
(12, 6, 'text', 1, '2025-10-27 09:36:39'),
(13, 6, 'image-text', 2, '2025-10-27 09:36:39'),
(14, 7, 'text', 0, '2025-10-27 09:36:39'),
(15, 7, 'text-image', 1, '2025-10-27 09:36:39'),
(16, 7, 'text', 2, '2025-10-27 09:36:39'),
(17, 7, 'text', 3, '2025-10-27 09:36:39'),
(18, 8, 'text', 0, '2025-10-27 09:36:39'),
(19, 8, 'image-text', 1, '2025-10-27 09:36:39'),
(20, 8, 'text-image', 2, '2025-10-27 09:36:39'),
(21, 8, 'text', 3, '2025-10-27 09:36:39'),
(22, 9, 'text', 0, '2025-10-27 09:53:40'),
(23, 9, 'text', 1, '2025-10-27 09:53:40'),
(24, 10, 'text', 0, '2025-10-27 09:53:40'),
(25, 10, 'text', 1, '2025-10-27 09:53:40'),
(26, 11, 'text', 0, '2025-10-27 09:53:40'),
(27, 11, 'text', 1, '2025-10-27 09:53:40'),
(28, 12, 'text', 0, '2025-10-27 09:53:40'),
(29, 12, 'text', 1, '2025-10-27 09:53:40'),
(30, 12, 'text', 2, '2025-10-27 09:53:40'),
(31, 13, 'text', 0, '2025-10-27 09:53:40'),
(32, 13, 'text', 1, '2025-10-27 09:53:40'),
(33, 14, 'text', 0, '2025-10-27 09:53:40'),
(34, 14, 'text', 1, '2025-10-27 09:53:40'),
(35, 15, 'text', 0, '2025-10-27 09:53:40'),
(36, 16, 'text', 0, '2025-10-27 09:53:40'),
(37, 16, 'text', 1, '2025-10-27 09:53:40'),
(38, 17, 'text', 0, '2025-10-27 09:53:40'),
(39, 18, 'text', 0, '2025-10-27 13:01:59'),
(40, 19, 'cover', -1, '2025-10-27 13:04:18'),
(41, 19, 'text', 0, '2025-10-27 13:04:18'),
(42, 19, 'image', 1, '2025-10-27 13:04:18'),
(43, 20, 'text-image', 0, '2025-10-27 13:09:16'),
(44, 21, 'text', 0, '2025-10-27 13:13:50'),
(45, 22, 'cover', -1, '2025-10-27 13:32:41'),
(46, 22, 'text', 0, '2025-10-27 13:32:41');

-- --------------------------------------------------------

--
-- Структура таблицы `guide_likes`
--

CREATE TABLE `guide_likes` (
  `id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `guide_likes`
--

INSERT INTO `guide_likes` (`id`, `guide_id`, `user_id`, `created_at`) VALUES
(2, 22, 10, '2025-10-27 16:27:10'),
(3, 22, 4, '2025-10-27 16:28:52');

-- --------------------------------------------------------

--
-- Структура таблицы `guide_ratings`
--

CREATE TABLE `guide_ratings` (
  `id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `guide_tags`
--

CREATE TABLE `guide_tags` (
  `guide_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('comment','reply','like','favorite') NOT NULL,
  `source_user_id` int(11) NOT NULL,
  `guide_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `source_user_id`, `guide_id`, `comment_id`, `is_read`, `created_at`) VALUES
(1, 4, 'comment', 9, 22, 3, 1, '2025-10-27 15:59:30'),
(2, 4, 'reply', 9, 22, 4, 1, '2025-10-27 15:59:41'),
(3, 4, 'like', 10, 22, NULL, 1, '2025-10-27 16:27:10'),
(4, 4, 'favorite', 10, 22, NULL, 1, '2025-10-27 16:27:11'),
(5, 4, 'comment', 10, 22, 5, 1, '2025-10-27 16:27:23'),
(6, 4, 'reply', 10, 22, 6, 1, '2025-10-27 16:27:37');

-- --------------------------------------------------------

--
-- Структура таблицы `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `text`, `completed`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'Изучить React', 0, '2025-10-25 16:37:24', '2025-10-25 16:37:24', NULL),
(2, 'Написать бэкенд', 1, '2025-10-25 16:37:24', '2025-10-25 16:37:24', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `email` varchar(40) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `pass`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Max Dtr', 'ereee@er.rer', '$2b$12$sbmGSPi1VEIbrluCzn40w.X1uj34kD491N/5doWzmsP3xxwjsqPmm', 1, '2025-10-25 19:43:02', '2025-10-25 19:43:02'),
(2, 'Max Dtr', 'grigor@mail.com', '$2b$12$OT6Zi2Qju6ZSszJ5QQwrmeTMoSnWTJSBXSn1bJ1GXbUwvmwLrab4W', 1, '2025-10-26 08:48:21', '2025-10-26 08:48:21'),
(3, 'Max Dtr', 'ereee@er.rerer', '$2b$12$zMVPRp25mp7.0J5r9gJ/SeG4l/BhQLmvXywngeJSke38dznxCVmZm', 1, '2025-10-26 09:45:55', '2025-10-26 09:45:55'),
(4, 'Андрей', 'ande@gg.ru', '$2b$12$.ArRwO1CWs2WuEXDqqgiyOT7FG0hUKynqT0nxzH0cgHCLxVhbqvKC', 1, '2025-10-26 10:10:24', '2025-10-26 10:10:24'),
(5, 'Тестовый Автор', 'test@example.com', '$2b$12$LHMsrLiBrrh9S1sVVoRZPu5zg/bc8tmtE0P3D58ohsKGOMTfLk4BK', 1, '2025-10-27 09:36:39', '2025-10-27 09:36:39'),
(7, 'Григорий Лепс', 'tesssst@exaple.com', '$2b$12$zWP9ynlIkDmiMxI7ZWK8Vu4w6vrPGqifHFkwTd4H9WQ69WcOa39Nq', 1, '2025-10-27 09:49:51', '2025-10-27 09:49:51'),
(9, 'Григориййй', 'shleps@rr.io', '$2b$12$dEdZFMWW0Al9DWLlPVVfceC2V.6ltubXtkRJJKDivEAtHEt/wwx9G', 1, '2025-10-27 15:59:19', '2025-10-27 15:59:19'),
(10, 'Евгений', 'eugen@mail.ru', '$2b$12$.iTxUjiVO5w9wNgv62bThOBMRMaNYcE5UlHrI.Ww2Io6k1DIy6uHS', 1, '2025-10-27 16:27:05', '2025-10-27 16:27:05');

-- --------------------------------------------------------

--
-- Структура таблицы `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_favorites`
--

INSERT INTO `user_favorites` (`id`, `user_id`, `guide_id`, `created_at`) VALUES
(1, 4, 22, '2025-10-27 15:58:11'),
(2, 10, 22, '2025-10-27 16:27:11');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `block_content`
--
ALTER TABLE `block_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block_id` (`block_id`);

--
-- Индексы таблицы `build_favorites`
--
ALTER TABLE `build_favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_build` (`user_id`,`build_id`),
  ADD KEY `build_id` (`build_id`);

--
-- Индексы таблицы `build_likes`
--
ALTER TABLE `build_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_build_user` (`build_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `character_builds`
--
ALTER TABLE `character_builds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`user_id`);

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_parent` (`parent_id`),
  ADD KEY `guide_id` (`guide_id`);

--
-- Индексы таблицы `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Индексы таблицы `game_characters`
--
ALTER TABLE `game_characters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_game_character` (`game_name`,`character_name`);

--
-- Индексы таблицы `game_items`
--
ALTER TABLE `game_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_game_item` (`game_name`,`item_name`);

--
-- Индексы таблицы `guides`
--
ALTER TABLE `guides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `guide_blocks`
--
ALTER TABLE `guide_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guide_id` (`guide_id`);

--
-- Индексы таблицы `guide_likes`
--
ALTER TABLE `guide_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_guide_user` (`guide_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `guide_ratings`
--
ALTER TABLE `guide_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_guide_user` (`guide_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `guide_tags`
--
ALTER TABLE `guide_tags`
  ADD PRIMARY KEY (`guide_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `source_user_id` (`source_user_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Индексы таблицы `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Индексы таблицы `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_guide` (`user_id`,`guide_id`),
  ADD KEY `guide_id` (`guide_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `block_content`
--
ALTER TABLE `block_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT для таблицы `build_favorites`
--
ALTER TABLE `build_favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `build_likes`
--
ALTER TABLE `build_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `character_builds`
--
ALTER TABLE `character_builds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `game_characters`
--
ALTER TABLE `game_characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `game_items`
--
ALTER TABLE `game_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT для таблицы `guides`
--
ALTER TABLE `guides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `guide_blocks`
--
ALTER TABLE `guide_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT для таблицы `guide_likes`
--
ALTER TABLE `guide_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `guide_ratings`
--
ALTER TABLE `guide_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `user_favorites`
--
ALTER TABLE `user_favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `block_content`
--
ALTER TABLE `block_content`
  ADD CONSTRAINT `block_content_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `guide_blocks` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `build_favorites`
--
ALTER TABLE `build_favorites`
  ADD CONSTRAINT `build_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `build_favorites_ibfk_2` FOREIGN KEY (`build_id`) REFERENCES `character_builds` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `build_likes`
--
ALTER TABLE `build_likes`
  ADD CONSTRAINT `build_likes_ibfk_1` FOREIGN KEY (`build_id`) REFERENCES `character_builds` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `build_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `character_builds`
--
ALTER TABLE `character_builds`
  ADD CONSTRAINT `character_builds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `guides`
--
ALTER TABLE `guides`
  ADD CONSTRAINT `guides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `guide_blocks`
--
ALTER TABLE `guide_blocks`
  ADD CONSTRAINT `guide_blocks_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `guide_likes`
--
ALTER TABLE `guide_likes`
  ADD CONSTRAINT `guide_likes_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `guide_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `guide_ratings`
--
ALTER TABLE `guide_ratings`
  ADD CONSTRAINT `guide_ratings_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `guide_ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `guide_tags`
--
ALTER TABLE `guide_tags`
  ADD CONSTRAINT `guide_tags_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `guide_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`source_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

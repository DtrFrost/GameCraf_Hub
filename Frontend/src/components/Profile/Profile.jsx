// components/Profile.js
import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [showAll, setShowAll] = useState(false);

  // Заглушка для данных пользователя
  const userData = {
    username: "User123",
    registrationDate: "15.12.2023",
    avatar: null // заглушка
  };

  // Моковые данные для контента
  const mockData = {
    guides: [
      { id: 1, title: "Как настроить React", content: "Полное руководство по настройке React проекта с нуля...", author: "User123", likes: 24, comments: 8, date: "20.01.2024" },
      { id: 2, title: "Лучшие практики CSS", content: "Современные подходы к написанию CSS кода...", author: "User123", likes: 15, comments: 3, date: "18.01.2024" },
      { id: 3, title: "Оптимизация производительности", content: "Методы оптимизации React приложений...", author: "User123", likes: 32, comments: 12, date: "15.01.2024" },
      { id: 4, title: "Работа с API", content: "Как правильно работать с внешними API в React...", author: "User123", likes: 18, comments: 5, date: "10.01.2024" },
      { id: 5, title: "TypeScript в React", content: "Внедрение TypeScript в существующий проект...", author: "User123", likes: 27, comments: 9, date: "05.01.2024" },
      { id: 6, title: "Тестирование компонентов", content: "Jest и React Testing Library...", author: "User123", likes: 14, comments: 4, date: "02.01.2024" },
      { id: 7, title: "Deploy на Vercel", content: "Быстрый деплой React приложения...", author: "User123", likes: 21, comments: 7, date: "28.12.2023" },
      { id: 8, title: "State Management", content: "Redux vs Context API...", author: "User123", likes: 19, comments: 6, date: "25.12.2023" }
    ],
    builds: [
      { id: 1, title: "Игровой ПК High-End", content: "Сборка для комфортного гейминга в 4K...", author: "User123", likes: 45, comments: 15, date: "22.01.2024" },
      { id: 2, title: "Бюджетная рабочая станция", content: "Оптимальная сборка для работы...", author: "User123", likes: 23, comments: 7, date: "20.01.2024" }
    ],
    favorites: [
      { id: 1, title: "React Hooks Guide", content: "Подробное руководство по хукам...", author: "OtherUser", likes: 156, comments: 42, date: "19.01.2024" },
      { id: 2, title: "CSS Grid Mastery", content: "Освоение CSS Grid Layout...", author: "CSSExpert", likes: 89, comments: 21, date: "17.01.2024" },
      { id: 3, title: "JavaScript Patterns", content: "Паттерны проектирования в JS...", author: "JSMaster", likes: 134, comments: 38, date: "15.01.2024" }
    ]
  };

  const currentData = mockData[activeTab];
  const displayData = showAll ? currentData : currentData.slice(0, 3);
  const hasMore = currentData.length > 3 && !showAll;
  const canShowMore = showAll && currentData.length > 7;

  const handleShowMore = () => {
    if (showAll && currentData.length > 7) {
      // В реальном приложении здесь была бы пагинация или подгрузка
      alert('В реальном приложении здесь была бы подгрузка следующих элементов');
    } else {
      setShowAll(!showAll);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Основной блок профиля */}
        <div className="profile-main-block">
          {/* Аватар и информация */}
          <div className="profile-header">
            <div className="avatar-section">
              <div className="avatar-placeholder">
                <span>Фото</span>
              </div>
              <button className="change-photo-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
            
            <div className="profile-info">
              <h1 className="username">{userData.username}</h1>
              <p className="registration-date">Дата регистрации: {userData.registrationDate}</p>
              <button className="change-password-btn">Изменить пароль</button>
            </div>
          </div>

          {/* Блок с контентом */}
          <div className="content-section">
            {/* Вкладки */}
            <div className="content-tabs">
              <button 
                className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
                onClick={() => setActiveTab('guides')}
              >
                Мои гайды
              </button>
              <button 
                className={`tab-button ${activeTab === 'builds' ? 'active' : ''}`}
                onClick={() => setActiveTab('builds')}
              >
                Мои сборки
              </button>
              <button 
                className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                Избранное
              </button>
            </div>

            {/* Контент вкладок */}
            <div className="tab-content">
              {displayData.map(item => (
                <div key={item.id} className="content-card">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-content">{item.content}</p>
                  <div className="card-meta">
                    <span className="author">Автор: {item.author}</span>
                    <div className="stats">
                      <span className="likes">❤️ {item.likes}</span>
                      <span className="comments">💬 {item.comments}</span>
                      <span className="date">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка "Показать еще" */}
            {(hasMore || canShowMore) && (
              <div className="show-more-container">
                <button className="show-more-btn" onClick={handleShowMore}>
                  {showAll && currentData.length > 7 ? 'Загрузить еще' : 'Показать еще'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

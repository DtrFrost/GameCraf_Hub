import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userGuides, setUserGuides] = useState([]);
  const [userBuilds, setUserBuilds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    } else if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'guides') {
      fetchUserGuides();
    } else if (activeTab === 'builds') {
      fetchUserBuilds();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    }
  };

  const fetchUserGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/guides/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUserGuides(data);
    } catch (error) {
      console.error('Ошибка загрузки гайдов пользователя:', error);
    }
  };

  const fetchUserBuilds = async () => {
    // Пока используем моковые данные для сборок
    setUserBuilds([
      { id: 1, title: "Игровой ПК High-End", content: "Сборка для комфортного гейминга в 4K...", likes: 45, comments: 15, date: "22.01.2024" },
      { id: 2, title: "Бюджетная рабочая станция", content: "Оптимальная сборка для работы...", likes: 23, comments: 7, date: "20.01.2024" }
    ]);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'guides': return userGuides;
      case 'favorites': return favorites;
      case 'notifications': return notifications;
      case 'builds': return userBuilds;
      default: return [];
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment': return '💬';
      case 'reply': return '↩️';
      case 'like': return '❤️';
      case 'favorite': return '⭐';
      default: return '🔔';
    }
  };

  const currentData = getCurrentData();
  const displayData = showAll ? currentData : currentData.slice(0, activeTab === 'notifications' ? 20 : 6);
  const hasMore = currentData.length > (activeTab === 'notifications' ? 20 : 6) && !showAll;

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const renderGuideCard = (guide, isFavorite = false) => (
    <div key={guide.id} className="content-card">
      {guide.coverImage && (
        <div className="card-cover">
          <img 
            src={`http://localhost:3005${guide.coverImage}`} 
            alt={guide.title}
            className="cover-image"
          />
        </div>
      )}
      <h3 className="card-title">{guide.title}</h3>
      <p className="card-game">🎮 {guide.game}</p>
      <div className="card-meta">
        <span className="author">
          {isFavorite ? `Автор: ${guide.author_name}` : 'Автор: Вы'}
        </span>
        <div className="stats">
          <span className="likes">❤️ {guide.likes_count || 0}</span>
          <span className="comments">💬 {guide.comments_count || 0}</span>
          <span className="date">
            {isFavorite 
              ? `Добавлено: ${new Date(guide.favorited_at).toLocaleDateString('ru-RU')}`
              : `Создан: ${new Date(guide.created_at).toLocaleDateString('ru-RU')}`
            }
          </span>
        </div>
      </div>
    </div>
  );

  const renderBuildCard = (build) => (
    <div key={build.id} className="content-card">
      <h3 className="card-title">{build.title}</h3>
      <p className="card-content">{build.content}</p>
      <div className="card-meta">
        <span className="author">Автор: Вы</span>
        <div className="stats">
          <span className="likes">❤️ {build.likes}</span>
          <span className="comments">💬 {build.comments}</span>
          <span className="date">{build.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-main-block">
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
              <h1 className="username">{user?.name || 'User123'}</h1>
              <p className="registration-date">
                Дата регистрации: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '15.12.2023'}
              </p>
              <button className="change-password-btn">Изменить пароль</button>
            </div>
          </div>

          <div className="content-section">
            <div className="content-tabs">
              <button 
                className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
                onClick={() => { setActiveTab('guides'); setShowAll(false); }}
              >
                Мои гайды ({userGuides.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'builds' ? 'active' : ''}`}
                onClick={() => { setActiveTab('builds'); setShowAll(false); }}
              >
                Мои сборки ({userBuilds.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => { setActiveTab('favorites'); setShowAll(false); }}
              >
                Избранное ({favorites.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => { setActiveTab('notifications'); setShowAll(false); }}
              >
                Уведомления
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="notification-count-badge">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'notifications' ? (
                <div className="notifications-tab">
                  <div className="notifications-header">
                    <h3>Уведомления ({notifications.length})</h3>
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await fetch('http://localhost:3005/api/notifications/read-all', {
                              method: 'PUT',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                          } catch (error) {
                            console.error('Ошибка отметки всех уведомлений:', error);
                          }
                        }}
                      >
                        Прочитать все
                      </button>
                    )}
                  </div>

                  {displayData.length > 0 ? (
                    <div className="notifications-list">
                      {displayData.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-card ${notification.is_read ? 'read' : 'unread'}`}
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              await fetch(`http://localhost:3005/api/notifications/${notification.id}/read`, {
                                method: 'PUT',
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              setNotifications(prev => 
                                prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                              );
                            } catch (error) {
                              console.error('Ошибка отметки уведомления:', error);
                            }
                          }}
                        >
                          <div className="notification-icon">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <div className="notification-message">
                              <strong>{notification.source_user_name}</strong> {notification.message}
                            </div>
                            {notification.guide_title && (
                              <div className="notification-guide">
                                «{notification.guide_title}»
                              </div>
                            )}
                            {notification.comment_text && (
                              <div className="notification-comment">
                                "{notification.comment_text}"
                              </div>
                            )}
                            <div className="notification-time">
                              {new Date(notification.created_at).toLocaleString('ru-RU')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-notifications">
                      <p>У вас пока нет уведомлений</p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'favorites' ? (
                favorites.length > 0 ? (
                  displayData.map(guide => renderGuideCard(guide, true))
                ) : (
                  <div className="no-content">
                    <p>У вас пока нет избранных гайдов</p>
                  </div>
                )
              ) : activeTab === 'guides' ? (
                userGuides.length > 0 ? (
                  displayData.map(guide => renderGuideCard(guide, false))
                ) : (
                  <div className="no-content">
                    <p>У вас пока нет созданных гайдов</p>
                  </div>
                )
              ) : activeTab === 'builds' ? (
                userBuilds.length > 0 ? (
                  displayData.map(build => renderBuildCard(build))
                ) : (
                  <div className="no-content">
                    <p>У вас пока нет созданных сборок</p>
                  </div>
                )
              ) : null}
            </div>

            {(hasMore || (showAll && currentData.length > (activeTab === 'notifications' ? 20 : 6))) && (
              <div className="show-more-container">
                <button className="show-more-btn" onClick={handleShowMore}>
                  {showAll ? 'Скрыть' : 'Показать еще'}
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
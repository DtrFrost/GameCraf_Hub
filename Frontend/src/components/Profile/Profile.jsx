import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userGuides, setUserGuides] = useState([]);
  const [userBuilds, setUserBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
      if (!response.ok) throw new Error('Ошибка загрузки уведомлений');
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
      setNotifications([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [guidesResponse, buildsResponse] = await Promise.all([
        fetch('http://localhost:3005/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:3005/api/build-favorites', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      let guidesData = [];
      let buildsData = [];

      if (guidesResponse.ok) {
        guidesData = await guidesResponse.json();
      }

      if (buildsResponse.ok) {
        buildsData = await buildsResponse.json();
      }

      const guidesWithType = Array.isArray(guidesData) ? guidesData.map(guide => ({ ...guide, type: 'guide' })) : [];
      const buildsWithType = Array.isArray(buildsData) ? buildsData.map(build => ({ ...build, type: 'build' })) : [];

      setFavorites([...guidesWithType, ...buildsWithType]);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      setFavorites([]);
    }
  };

  const fetchUserGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/guides/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки гайдов');
      const data = await response.json();
      setUserGuides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки гайдов пользователя:', error);
      setUserGuides([]);
    }
  };

  const fetchUserBuilds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/builds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки сборок');
      const data = await response.json();
      setUserBuilds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки сборок пользователя:', error);
      setUserBuilds([]);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'guides': return Array.isArray(userGuides) ? userGuides : [];
      case 'favorites': return Array.isArray(favorites) ? favorites : [];
      case 'notifications': return Array.isArray(notifications) ? notifications : [];
      case 'builds': return Array.isArray(userBuilds) ? userBuilds : [];
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

  const handleItemClick = (item) => {
    if (item.type === 'build') {
      navigate(`/build/${item.id}`);
    } else {
      navigate(`/guide/${item.id}`);
    }
  };

  const currentData = getCurrentData();
  const displayData = showAll ? currentData : currentData.slice(0, activeTab === 'notifications' ? 20 : 6);
  const hasMore = currentData.length > (activeTab === 'notifications' ? 20 : 6) && !showAll;

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const renderContentCard = (item, isFavorite = false) => (
    <div 
      key={item.id} 
      className="content-card"
      onClick={() => handleItemClick(item)}
    >
      {item.coverImage && (
        <div className="card-cover">
          <img 
            src={`http://localhost:3005${item.coverImage}`} 
            alt={item.title}
            className="cover-image"
          />
        </div>
      )}
      <h3 className="card-title">{item.title}</h3>
      <p className="card-game">🎮 {item.game_name || item.game}</p>
      <div className="card-meta">
        <span className="author">
          {isFavorite ? `Автор: ${item.author_name}` : 'Автор: Вы'}
        </span>
        <div className="stats">
          <span className="likes">❤️ {item.likes_count || 0}</span>
          <span className="comments">💬 {item.comments_count || 0}</span>
          <span className="date">
            {isFavorite 
              ? `Добавлено: ${new Date(item.favorited_at || item.created_at).toLocaleDateString('ru-RU')}`
              : `Создан: ${new Date(item.created_at).toLocaleDateString('ru-RU')}`
            }
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-main-block">
          <div className="profile-header">
            <div className="profile-info">
              <h1 className="username">{user?.name || 'User123'}</h1>
              <p className="registration-date">
                Дата регистрации: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '15.12.2023'}
              </p>
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
                  displayData.map(item => renderContentCard(item, true))
                ) : (
                  <div className="no-content">
                    <p>У вас пока нет избранного</p>
                  </div>
                )
              ) : activeTab === 'guides' ? (
                userGuides.length > 0 ? (
                  displayData.map(guide => renderContentCard(guide, false))
                ) : (
                  <div className="no-content">
                    <p>У вас пока нет созданных гайдов</p>
                  </div>
                )
              ) : activeTab === 'builds' ? (
                userBuilds.length > 0 ? (
                  displayData.map(build => renderContentCard(build, false))
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
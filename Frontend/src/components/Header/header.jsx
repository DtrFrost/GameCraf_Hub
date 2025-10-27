import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header(){
  const { user, logout, isAuthenticated } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotificationCount();
      fetchNotifications();
      
      // Опрашиваем уведомления каждые 30 секунд
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotificationCount(data.count);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Ошибка загрузки списка уведомлений:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3005/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Обновляем счетчик и список
      fetchNotificationCount();
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3005/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotificationCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to='/'>
          <img src="./Frontend/public/cashe/logo.svg" alt="Logo" />
        </Link>
      </div>
      <div className="nav">
        <nav>
          <ul>
            <Link to="/"><li>Главная</li></Link>
            <a href="#"><li>Топ Гайды</li></a>
            <Link to="/guide"><li>Конструктор</li></Link>
            {isAuthenticated && (
              <Link to="/profile"><li>Мой Профиль</li></Link>
            )}
          </ul>
        </nav>
        <input type="text" placeholder="Поиск..." className="search-input" />
        
        {/* Уведомления */}
        {isAuthenticated && (
          <div className="notification-container">
            <div 
              className="notification-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img src="./Frontend/public/cashe/bell.svg" alt="Уведомления" />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Уведомления</h3>
                  {notificationCount > 0 && (
                    <button 
                      className="mark-all-read"
                      onClick={markAllAsRead}
                    >
                      Прочитать все
                    </button>
                  )}
                </div>
                
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 10).map(notification => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <strong>{notification.source_user_name}</strong> {notification.message}
                          {notification.guide_title && (
                            <div className="guide-title">«{notification.guide_title}»</div>
                          )}
                        </div>
                        <div className="notification-time">
                          {new Date(notification.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">Нет уведомлений</div>
                  )}
                </div>
                
                {notifications.length > 10 && (
                  <div className="notifications-footer">
                    <Link to="/profile?tab=notifications">Все уведомления</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-greeting">Привет, {user.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
        ) : (
          <Link to='/login' className="login-button">Вход</Link>
        )}
      </div>
    </header>
  );
};
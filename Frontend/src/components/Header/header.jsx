import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header(){
  const { user, logout, isAuthenticated } = useAuth();

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
            <a href="/AssemblyConstructor"><li>Сборка</li></a>
            <Link to="/guide"><li>Конструктор</li></Link>
            {/* Добавьте ссылку на профиль если пользователь авторизован */}
            {isAuthenticated && (
              <Link to="/profile"><li>Мой Профиль</li></Link>
            )}
          </ul>
        </nav>
        <input type="text" placeholder="Поиск..." className="search-input" />
        <div className="notification-icon">
          <img src="./Frontend/public/cashe/bell.svg" alt="Уведомления" />
        </div>
        
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
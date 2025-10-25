import React from 'react';
import './Header.css';


export default function Header(){
  return (
    <header className="header">
      <div className="logo"><a href='/'><img src="./Frontend/public/cashe/logo.svg" alt="Logo" /></a></div>
      <div className="nav">
        <nav>
          <ul>
            <a href="/"><li>Главная</li></a>
            <a href="#"><li>Топ Гайды</li></a>
            <a href="#"><li>Конструктор</li></a>
          </ul>
        </nav>
        <input type="text" placeholder="Поиск..." className="search-input" />
      <div className="notification-icon"><img src="./Frontend/public/cashe/bell.svg" alt="" /></div>
      <a href='Register'className="login-button">Вход</a>
      </div>
    </header>
  );
};
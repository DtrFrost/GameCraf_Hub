import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ДОБАВЬ ЭТОТ ИМПОРТ
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import './HomePage.css';

const HomePage = () => {
  const [recentGuides, setRecentGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ← ДОБАВЬ ЭТОТ ХУК

  // Путь к картинке-заглушке
  const PLACEHOLDER_IMAGE = './Frontend/public/placeholder-guide.svg';

  useEffect(() => {
    fetchRecentGuides();
  }, []);

  const fetchRecentGuides = async () => {
    try {
      console.log('🔄 Загрузка последних гайдов...');
      const response = await fetch('http://localhost:3005/api/guides/recent');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const guides = await response.json();
      console.log('✅ Получены гайды:', guides);
      setRecentGuides(guides);
    } catch (error) {
      console.error('❌ Ошибка загрузки последних гайдов:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения картинки гайда (с заглушкой)
  const getGuideImage = (guide) => {
    if (guide.coverImage && guide.coverImage !== '/uploads/null') {
      return `http://localhost:3005${guide.coverImage}`;
    }
    return PLACEHOLDER_IMAGE;
  };

  // ⭐⭐⭐ ФУНКЦИЯ ДЛЯ КЛИКА ПО ГАЙДУ ⭐⭐⭐
  const handleGuideClick = (guideId) => {
    navigate(`/guide/${guideId}`);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <aside className="sidebar-section">
          <SidebarMenu />
        </aside>

        <main className="main-content">
          <div className="welcome-section">
            <h1>🎮 Добро пожаловать в GameCraft Hub!</h1>
            <p>Сообщество геймеров, создающих лучшие гайды и сборки</p>
          </div>

          <section className="recent-guides-section">
            <h2>🔥 Последние гайды</h2>
            
            {loading ? (
              <div className="loading">Загрузка гайдов...</div>
            ) : error ? (
              <div className="error">
                <p>Ошибка: {error}</p>
                <button onClick={fetchRecentGuides}>Попробовать снова</button>
              </div>
            ) : recentGuides.length > 0 ? (
              <div className="guides-grid">
                {recentGuides.map(guide => (
                  <div 
                    key={guide.id} 
                    className="guide-card"
                    onClick={() => handleGuideClick(guide.id)} // ← ДОБАВЬ ОБРАБОТЧИК КЛИКА
                  >
                    <div className="guide-cover-container">
                      <img 
                        src={getGuideImage(guide)}
                        alt={guide.title}
                        className="guide-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="guide-cover-fallback">
                        🎮
                      </div>
                    </div>
                    <div className="guide-info">
                      <h3 className="guide-title">{guide.title}</h3>
                      <p className="guide-game">🎯 {guide.game}</p>
                      <p className="guide-author">Автор: {guide.author_name}</p>
                      <p className="guide-date">
                        Дата: {new Date(guide.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-guides">
                <p>Пока нет созданных гайдов. Будьте первым!</p>
              </div>
            )}
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{recentGuides.length}</div>
                <div className="stat-label">Гайдов</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">Игр в каталоге</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5+</div>
                <div className="stat-label">Авторов</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
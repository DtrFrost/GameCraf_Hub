import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import './HomePage.css';

const HomePage = () => {
  const [recentGuides, setRecentGuides] = useState([]);
  const [recentBuilds, setRecentBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE = '/placeholder-guide.svg';

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      setLoading(true);
      
      const [guidesResponse, buildsResponse] = await Promise.all([
        fetch('http://localhost:3005/api/guides/recent'),
        fetch('http://localhost:3005/api/builds/public')
      ]);

      if (!guidesResponse.ok) {
        throw new Error('Ошибка загрузки гайдов');
      }
      
      const guides = await guidesResponse.json();
      let builds = [];
      
      if (buildsResponse.ok) {
        builds = await buildsResponse.json();
      }
      
      setRecentGuides(guides);
      setRecentBuilds(builds.slice(0, 5));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getGuideImage = (guide) => {
    if (guide.coverImage && guide.coverImage !== '/uploads/null') {
      return `http://localhost:3005${guide.coverImage}`;
    }
    return PLACEHOLDER_IMAGE;
  };

  const getBuildImage = (build) => {
    if (build.character_image) {
      return build.character_image;
    }
    return PLACEHOLDER_IMAGE;
  };

  const handleGuideClick = (guideId) => {
    navigate(`/guide/${guideId}`);
  };

  const handleBuildClick = (buildId) => {
    navigate(`/build/${buildId}`);
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

          <section className="recent-section">
            <h2>📚 Последние гайды</h2>
            
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : error ? (
              <div className="error">
                <p>Ошибка: {error}</p>
                <button onClick={fetchRecentContent}>Попробовать снова</button>
              </div>
            ) : recentGuides.length > 0 ? (
              <div className="content-grid">
                {recentGuides.map(guide => (
                  <ContentCard 
                    key={`guide-${guide.id}`}
                    item={guide}
                    type="guide"
                    getImage={getGuideImage}
                    onClick={handleGuideClick}
                  />
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>Пока нет созданных гайдов. Будьте первым!</p>
              </div>
            )}
          </section>

          <section className="recent-section">
            <h2>⚔️ Последние сборки</h2>
            
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : error ? (
              <div className="error">
                <p>Ошибка: {error}</p>
                <button onClick={fetchRecentContent}>Попробовать снова</button>
              </div>
            ) : recentBuilds.length > 0 ? (
              <div className="content-grid">
                {recentBuilds.map(build => (
                  <ContentCard 
                    key={`build-${build.id}`}
                    item={build}
                    type="build"
                    getImage={getBuildImage}
                    onClick={handleBuildClick}
                  />
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>Пока нет созданных сборок. Создайте первую!</p>
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
                <div className="stat-number">{recentBuilds.length}</div>
                <div className="stat-label">Сборок</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">Игр в каталоге</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const ContentCard = ({ item, type, getImage, onClick }) => {
  const isGuide = type === 'guide';
  
  return (
    <div 
      className="content-card"
      onClick={() => onClick(item.id)}
    >
      <div className="content-cover-container">
        <img 
          src={getImage(item)}
          alt={item.title}
          className="content-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="content-cover-fallback">
          {isGuide ? '📚' : '⚔️'}
        </div>
        <div className="content-type-badge">
          {isGuide ? 'Гайд' : 'Сборка'}
        </div>
      </div>
      
      <div className="content-info">
        <h3 className="content-title">{item.title}</h3>
        <p className="content-game">🎯 {item.game_name || item.game}</p>
        <p className="content-author">Автор: {item.author_name}</p>
        
        <div className="content-stats">
          <span className="stat">
            ❤️ {item.likes_count || 0}
          </span>
          <span className="stat">
            💬 {item.comments_count || 0}
          </span>
          <span className="stat">
            📅 {new Date(item.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>

        {!isGuide && item.character_name && (
          <p className="content-character">Персонаж: {item.character_name}</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
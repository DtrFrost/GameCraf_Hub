import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [guides, setGuides] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const games = [
    { 
      name: 'Team Fortress 2', 
      icon: '/gameIcons/tf2-icon.svg' 
    },
    { 
      name: 'The binding of Isaac', 
      icon: '/gameIcons/tboi-icon.webp' 
    },
    { 
      name: 'Minecraft', 
      icon: '/gameIcons/minecraft-icon.png' 
    }
  ];

  const getGameIcon = (gameName) => {
    const game = games.find(g => g.name === gameName);
    return game ? game.icon : '/gameIcons/default-icon.png';
  };

  useEffect(() => {
    if (selectedGame) {
      fetchGameData(selectedGame);
    }
  }, [selectedGame]);

  const fetchGameData = async (gameName) => {
    try {
      setLoading(true);

      const [guidesResponse, buildsResponse] = await Promise.all([
        fetch(`http://localhost:3005/api/guides/game/${encodeURIComponent(gameName)}`),
        fetch(`http://localhost:3005/api/builds/game/${encodeURIComponent(gameName)}`)
      ]);

      let guidesData = [];
      let buildsData = [];

      if (guidesResponse.ok) {
        guidesData = await guidesResponse.json();
      }

      if (buildsResponse.ok) {
        buildsData = await buildsResponse.json();
      }

      setGuides(guidesData);
      setBuilds(buildsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setGuides([]);
      setBuilds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedCategory(null);
    setGuides([]);
    setBuilds([]);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setSelectedCategory(null);
    setGuides([]);
    setBuilds([]);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleItemSelect = (item, type) => {
    if (type === 'guide') {
      navigate(`/guide/${item.id}`);
    } else if (type === 'build') {
      navigate(`/build/${item.id}`);
    }
  };

  return (
    <div className="sidebar-menu">
      <div className="menu-header">
        <h3>🎮 Игры</h3>
      </div>

      <div className="menu-content">
        {!selectedGame && (
          <div className="games-list">
            {games.map((game, index) => (
              <div
                key={index}
                className="menu-item game-item"
                onClick={() => handleGameSelect(game.name)}
              >
                <span className="game-icon">
                  <img 
                    src={game.icon} 
                    alt={game.name}
                    className="game-icon-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.className = 'game-icon-fallback';
                      fallback.textContent = '🎮';
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                </span>
                {game.name}
              </div>
            ))}
          </div>
        )}

        {selectedGame && !selectedCategory && (
          <div className="categories-section">
            <div className="menu-back" onClick={handleBackToGames}>
              ← Назад к играм
            </div>
            <div className="selected-game">
              <div className="selected-game-header">
                <img 
                  src={getGameIcon(selectedGame)} 
                  alt={selectedGame}
                  className="selected-game-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.className = 'game-icon-fallback';
                    fallback.textContent = '🎮';
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
                <h4>{selectedGame}</h4>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : (
              <div className="categories-list">
                <div
                  className="menu-item category-item"
                  onClick={() => handleCategorySelect('guides')}
                >
                  <span className="category-icon">📚</span>
                  Гайды ({guides.length})
                </div>
                <div
                  className="menu-item category-item"
                  onClick={() => handleCategorySelect('builds')}
                >
                  <span className="category-icon">⚔️</span>
                  Сборки ({builds.length})
                </div>
              </div>
            )}
          </div>
        )}

        {selectedGame && selectedCategory === 'guides' && (
          <div className="items-section">
            <div className="menu-back" onClick={handleBackToCategories}>
              ← Назад к категориям
            </div>
            <div className="section-header">
              <div className="section-header-with-icon">
                <img 
                  src={getGameIcon(selectedGame)} 
                  alt={selectedGame}
                  className="section-game-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.className = 'game-icon-fallback';
                    fallback.textContent = '📚';
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
                <h4>Гайды по {selectedGame}</h4>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Загрузка гайдов...</div>
            ) : guides.length > 0 ? (
              <div className="items-list">
                {guides.map(guide => (
                  <div
                    key={guide.id}
                    className="menu-item guide-item"
                    onClick={() => handleItemSelect(guide, 'guide')}
                  >
                    <div className="item-title">{guide.title}</div>
                    <div className="item-meta">
                      Автор: {guide.author_name} • 
                      {new Date(guide.created_at).toLocaleDateString()}
                    </div>
                    <div className="item-stats">
                      <span className="stat">❤️ {guide.likes_count || 0}</span>
                      <span className="stat">💬 {guide.comments_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items">Пока нет гайдов для этой игры</div>
            )}
          </div>
        )}

        {selectedGame && selectedCategory === 'builds' && (
          <div className="items-section">
            <div className="menu-back" onClick={handleBackToCategories}>
              ← Назад к категориям
            </div>
            <div className="section-header">
              <div className="section-header-with-icon">
                <img 
                  src={getGameIcon(selectedGame)} 
                  alt={selectedGame}
                  className="section-game-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.className = 'game-icon-fallback';
                    fallback.textContent = '⚔️';
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
                <h4>Сборки для {selectedGame}</h4>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Загрузка сборок...</div>
            ) : builds.length > 0 ? (
              <div className="items-list">
                {builds.map(build => (
                  <div
                    key={build.id}
                    className="menu-item build-item"
                    onClick={() => handleItemSelect(build, 'build')}
                  >
                    <div className="item-title">{build.title}</div>
                    <div className="item-meta">
                      Персонаж: {build.character_name} • 
                      Автор: {build.author_name}
                    </div>
                    <div className="item-meta">
                      {new Date(build.created_at).toLocaleDateString()}
                    </div>
                    <div className="item-stats">
                      <span className="stat">❤️ {build.likes_count || 0}</span>
                      <span className="stat">💬 {build.comments_count || 0}</span>
                      <span className="stat">⚔️ {build.total_damage || 0}</span>
                      <span className="stat">🛡️ {build.total_defense || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items">Пока нет сборок для этой игры</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [guides, setGuides] = useState([]);
  const [builds, setBuilds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const games = [
    { 
      name: 'Team Fortress 2', 
      icon: './Frontend/public/gameIcons/tf2-icon.svg' 
    },
    { 
      name: 'The binding of Isaac', 
      icon: './Frontend/public/gameIcons/tboi-icon.webp' 
    },
    { 
      name: 'Minecraft', 
      icon: './Frontend/public/gameIcons/minecraft-icon.png' 
    }
  ];

  // Функция для получения пути к иконке игры
  const getGameIcon = (gameName) => {
    const game = games.find(g => g.name === gameName);
    return game ? game.icon : '/gameIcons/default-icon.png';
  };

  // Загрузка данных при выборе игры
  useEffect(() => {
    if (selectedGame) {
      fetchGameData(selectedGame);
    }
  }, [selectedGame]);

  const fetchGameData = async (gameName) => {
    try {
      // Загружаем гайды для выбранной игры
      const guidesResponse = await fetch(`http://localhost:3005/api/guides/game/${encodeURIComponent(gameName)}`);
      const guidesData = await guidesResponse.json();
      setGuides(guidesData);

      // Здесь позже добавим загрузку сборок
      setBuilds([]); // временно пустой массив
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setSelectedCategory(null);
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
        {/* Выбор игры */}
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
                      // Если иконка не загрузилась, показываем эмодзи как запасной вариант
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

        {/* Выбор категории после выбора игры */}
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
          </div>
        )}

        {/* Список гайдов */}
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
            <div className="items-list">
              {guides.length > 0 ? (
                guides.map(guide => (
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
                  </div>
                ))
              ) : (
                <div className="no-items">Пока нет гайдов для этой игры</div>
              )}
            </div>
          </div>
        )}

        {/* Список сборок */}
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
            <div className="items-list">
              {builds.length > 0 ? (
                builds.map(build => (
                  <div
                    key={build.id}
                    className="menu-item build-item"
                    onClick={() => handleItemSelect(build, 'build')}
                  >
                    <div className="item-title">{build.title}</div>
                    <div className="item-meta">
                      Автор: {build.author_name} • 
                      {new Date(build.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items">Пока нет сборок для этой игры</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
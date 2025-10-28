import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Item from './Item';
import ItemSlot from './ItemSlot';
import './AssemblyConstructor.css';

axios.defaults.baseURL = 'http://localhost:3005';

const AssemblyConstructor = () => {
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [items, setItems] = useState([]);
    const [characterStats, setCharacterStats] = useState({ damage: 0, defense: 0, health: 125 });
    const [itemSlots, setItemSlots] = useState([null, null, null, null]);
    const [buildTitle, setBuildTitle] = useState('');
    const [buildDescription, setBuildDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Список игр с иконками
    const gamesList = [
        { 
            name: 'Team Fortress 2', 
            icon: './Frontend/public/gameIcons/tf2-icon.svg',
            id: 'tf2'
        },
        { 
            name: 'Minecraft', 
            icon: './Frontend/public/gameIcons/minecraft-icon.png',
            id: 'minecraft'
        },
        { 
            name: 'The binding of Isaac', 
            icon: './Frontend/public/gameIcons/tboi-icon.webp',
            id: 'isaac'
        }
    ];

    // Загружаем персонажей при выборе игры
    useEffect(() => {
        if (selectedGame) {
            fetchCharacters(selectedGame);
            fetchItems(selectedGame);
        }
    }, [selectedGame]);

    // В функции fetchCharacters и fetchItems добавьте отладку:
const fetchCharacters = async (gameName) => {
  try {
    setLoading(true);
    console.log('🔄 Загружаем персонажей для игры:', gameName);
    
    const response = await axios.get(`/api/builds/characters/${gameName}`);
    
    console.log('📊 Ответ от API (персонажи):', response.data);
    
    if (Array.isArray(response.data)) {
      // Исправляем пути к изображениям персонажей
      const charactersWithFixedPaths = response.data.map(character => ({
        ...character,
        character_image: character.character_image || '/characters/placeholder.png'
      }));
      
      setCharacters(charactersWithFixedPaths);
      console.log('✅ Загружено персонажей:', charactersWithFixedPaths.length);
    } else {
      console.error('❌ Ожидался массив, но получили:', response.data);
      setCharacters([]);
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки персонажей:', error);
    setCharacters([]);
  } finally {
    setLoading(false);
  }
};

const fetchItems = async (gameName) => {
  try {
    setLoading(true);
    console.log('🔄 Загружаем предметы для игры:', gameName);
    
    const response = await axios.get(`/api/builds/items/${gameName}`);
    
    console.log('📊 Ответ от API (предметы):', response.data);
    
    if (Array.isArray(response.data)) {
      // Исправляем пути к изображениям предметов
      const itemsWithFixedPaths = response.data.map(item => ({
        ...item,
        item_image: item.item_image || '/items/placeholder.png'
      }));
      
      setItems(itemsWithFixedPaths);
      console.log('✅ Загружено предметов:', itemsWithFixedPaths.length);
    } else {
      console.error('❌ Ожидался массив, но получили:', response.data);
      setItems([]);
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки предметов:', error);
    setItems([]);
  } finally {
    setLoading(false);
  }
};

    const handleGameSelect = (gameName) => {
        setSelectedGame(gameName);
        setSelectedCharacter(null);
        setCharacters([]);
        setItems([]);
        setItemSlots([null, null, null, null]);
        setCharacterStats({ damage: 0, defense: 0, health: 125 });
    };

    const handleCharacterSelect = (character) => {
        setSelectedCharacter(character);
        setCharacterStats({
            damage: character.base_damage || 0,
            defense: character.base_defense || 0,
            health: character.base_health || 125
        });
        setItemSlots([null, null, null, null]);
    };

    const handleDrop = (item, index) => {
        if (itemSlots[index]) return;

        setCharacterStats(prev => ({
            damage: prev.damage + (item.damage_bonus || 0),
            defense: prev.defense + (item.defense_bonus || 0),
            health: prev.health + (item.health_bonus || 0),
        }));

        setItemSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = item;
            return newSlots;
        });
    };

    const handleRemove = (index) => {
        const itemToRemove = itemSlots[index];
        if (!itemToRemove) return;

        setCharacterStats(prev => ({
            damage: prev.damage - (itemToRemove.damage_bonus || 0),
            defense: prev.defense - (itemToRemove.defense_bonus || 0),
            health: prev.health - (itemToRemove.health_bonus || 0),
        }));

        setItemSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = null;
            return newSlots;
        });
    };

    const saveBuild = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            return;
        }

        if (!buildTitle.trim()) {
            alert('Введите название сборки');
            return;
        }

        if (!selectedCharacter) {
            alert('Выберите персонажа');
            return;
        }

        // Фильтруем null слоты и преобразуем в нужный формат
        const itemsData = itemSlots
            .filter(slot => slot !== null)
            .map(slot => ({ 
                id: slot.id,
                item_name: slot.item_name,
                item_image: slot.item_image,
                damage_bonus: slot.damage_bonus,
                defense_bonus: slot.defense_bonus,
                health_bonus: slot.health_bonus
            }));

        const buildData = {
            title: buildTitle,
            gameName: selectedGame,
            characterName: selectedCharacter.character_name,
            items: itemsData,
            description: buildDescription,
            playstyle: 'custom' // можно добавить выбор стиля игры
        };

        console.log('📤 Отправляем данные сборки:', buildData);

        const response = await axios.post('/api/builds', buildData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ Ответ от сервера:', response.data);
        
        alert('Сборка успешно сохранена!');
        
        // Сброс формы после сохранения
        setBuildTitle('');
        setBuildDescription('');
        setItemSlots([null, null, null, null]);
        setCharacterStats({ 
            damage: selectedCharacter.base_damage || 0, 
            defense: selectedCharacter.base_defense || 0, 
            health: selectedCharacter.base_health || 125 
        });

    } catch (error) {
        console.error('❌ Ошибка при сохранении сборки:', error);
        console.error('❌ Детали ошибки:', error.response?.data);
        alert('Ошибка при сохранении сборки: ' + (error.response?.data?.error || error.message));
    }
};

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="assembly-constructor">
                <div className="constructor-header">
                    <h1>Конструктор сборок</h1>
                    <p>Создайте свою уникальную сборку для персонажа</p>
                </div>

                <div className="constructor-layout">
                    {/* Левая панель - выбор игры и персонажа */}
                    <div className="selection-sidebar">
                        <div className="sidebar-section">
                            <h3>🎮 Выберите игру</h3>
                            <div className="games-grid">
                                {gamesList.map((game) => (
                                    <div
                                        key={game.id}
                                        className={`game-card ${selectedGame === game.name ? 'selected' : ''}`}
                                        onClick={() => handleGameSelect(game.name)}
                                    >
                                        <div className="game-icon">
                                            <img 
                                                src={game.icon} 
                                                alt={game.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            <span className="game-icon-fallback">🎮</span>
                                        </div>
                                        <div className="game-name">{game.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedGame && (
                            <div className="sidebar-section">
                                <h3>👤 Выберите персонажа</h3>
                                
                                {loading ? (
                                    <div className="loading">Загрузка персонажей...</div>
                                ) : (
                                    <div className="characters-grid">
                                        {characters.map((character) => {
    console.log('🖼️ Character image path:', character.character_image); // ← ДОБАВЬ ЭТУ СТРОЧКУ
    return (
        <div
            key={character.id}
            className={`character-card ${
                selectedCharacter?.id === character.id ? 'selected' : ''
            }`}
            onClick={() => handleCharacterSelect(character)}
        >
            <div className="character-image">
                <img 
                    src={character.character_image} 
                    alt={character.character_name}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div className="character-image-fallback">👤</div>
            </div>
            {/* ... */}
        </div>
    );
})}
                                    </div>
                                )}
                                
                                {!loading && characters.length === 0 && (
                                    <div className="no-characters">
                                        Нет доступных персонажей для этой игры
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Правая панель - конструктор */}
                    <div className="constructor-main">
                        {/* Информация о сборке */}
                        <div className="build-info-panel">
                            <div className="form-group">
                                <label>Название сборки *</label>
                                <input
                                    type="text"
                                    className="title-input"
                                    placeholder="Моя мощная сборка..."
                                    value={buildTitle}
                                    onChange={(e) => setBuildTitle(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Описание сборки</label>
                                <textarea
                                    placeholder="Опишите вашу сборку..."
                                    value={buildDescription}
                                    onChange={(e) => setBuildDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Область персонажа и слотов */}
                        {selectedCharacter ? (
                            <div className="character-build-area">
                                <div className="character-display">
                                    <div className="character-header">
                                        <h2>{selectedCharacter.character_name}</h2>
                                        <div className="game-badge">{selectedGame}</div>
                                    </div>
                                    
                                    <div className="character-visual">
                                        <img 
                                            src={selectedCharacter.character_image} 
                                            alt={selectedCharacter.character_name}
                                            className="character-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-character.jpg';
                                            }}
                                        />
                                    </div>

                                    <div className="character-stats">
                                        <div className="stat-card">
                                            <div className="stat-icon">⚔️</div>
                                            <div className="stat-info">
                                                <div className="stat-label">Урон</div>
                                                <div className="stat-value">{characterStats.damage}</div>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon">🛡️</div>
                                            <div className="stat-info">
                                                <div className="stat-label">Защита</div>
                                                <div className="stat-value">{characterStats.defense}</div>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon">❤️</div>
                                            <div className="stat-info">
                                                <div className="stat-label">Здоровье</div>
                                                <div className="stat-value">{characterStats.health}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="slots-section">
                                    <h3>🎒 Слоты для предметов</h3>
                                    <div className="slots-grid">
                                        {itemSlots.map((item, index) => (
                                            <ItemSlot
                                                key={index}
                                                item={item}
                                                slotNumber={index + 1}
                                                onDrop={(droppedItem) => handleDrop(droppedItem, index)}
                                                onRemove={() => handleRemove(index)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="items-section">
                                    <h3>📦 Доступные предметы</h3>
                                    <div className="items-grid">
{items.map((item) => {
    console.log('🎒 Item image path:', item.item_image); // ← ДОБАВЬ ЭТУ СТРОЧКУ
    return (
        <Item key={item.id} item={item} />
    );
})}
                                    </div>
                                </div>

                                {/* Кнопка сохранения */}
                                <div className="actions-panel">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={saveBuild}
                                        disabled={!buildTitle}
                                    >
                                        💾 Сохранить сборку
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="no-selection">
                                <div className="no-selection-content">
                                    <h3>🚀 Начните создание сборки</h3>
                                    <p>Выберите игру и персонажа чтобы начать создание уникальной сборки</p>
                                    <div className="no-selection-steps">
                                        <div className="step">
                                            <span className="step-number">1</span>
                                            <span className="step-text">Выберите игру</span>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">2</span>
                                            <span className="step-text">Выберите персонажа</span>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">3</span>
                                            <span className="step-text">Добавьте предметы</span>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">4</span>
                                            <span className="step-text">Сохраните сборку</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default AssemblyConstructor;
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Item from './Item';
import ItemSlot from './ItemSlot';
import './AssemblyConstructor.css';

const characters = {
    'Team Fortress 2': [
        { name: 'Разведчик', image: './Frontend/public/cashe/scout.png' }
    ],
    'Isaac': [
        { name: 'Айзек', image: './Frontend/public/cashe/isaac.png' },
    ],
};

// Данные о предметах
const items = [
    { name: 'Неумолимая сила', stat: '+50 урона', image: './Frontend/public/cashe/Force-A-Nature.png' },
    { name: 'Обрез малыша', stat: '+10 урона', image: './Frontend/public/cashe/Baby_Face_Blaster.png' },
    { name: 'Прерыватель', stat: '+15 урона', image: './Frontend/public/cashe/Shortstop.png' },
    { name: 'Окрылённый', stat: '+20 защиты', image: './Frontend/public/cashe/Winger.png' },
    { name: 'Автомайзер', stat: '+15 здоровья', image: './Frontend/public/cashe/Atomizer.png' },
    { name: 'Бримстоун', stat: '+67 урона', image: './Frontend/public/cashe/brimstone.png' },
    { name: 'Планетка', stat: '+15 здоровья', image: './Frontend/public/cashe/tiny_planet.png' },
    { name: 'Ложка', stat: '+42 защиты', image: './Frontend/public/cashe/spoon_bender.png' },
    { name: 'Лестница якова', stat: '+30 урона', image: './Frontend/public/cashe/ladder.png' },
    { name: 'Гемолакрия', stat: '+52 урона', image: './Frontend/public/cashe/Haemolacria.png' }
];

const AssemblyConstructor = () => {
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterStats, setCharacterStats] = useState({ damage: 0, defense: 0, health: 125 });
    const [itemSlots, setItemSlots] = useState([null, null, null]);

    const handleGameChange = (e) => {
        setSelectedGame(e.target.value);
        setSelectedCharacter(null);
        setCharacterStats({ damage: 0, defense: 0, health: 125 });
        setItemSlots([null, null, null]); // Сброс слотов при выборе новой игры
    };

    const handleCharacterChange = (e) => {
        const selected = characters[selectedGame].find(char => char.name === e.target.value);
        setSelectedCharacter(selected);
        setCharacterStats({ damage: 0, defense: 0, health: 125 });
        setItemSlots([null, null, null]); // Сброс слотов при выборе нового персонажа
    };

    const handleDrop = (item, index) => {
        // Проверяем, занята ли ячейка
        if (itemSlots[index]) {
            return; // Если ячейка занята, ничего не делаем
        }
    
        // Если ячейка пустая, добавляем новый предмет
        const statChange = item.stat.match(/\+(\d+)/);
        if (statChange) {
            const value = parseInt(statChange[1], 10);
            setCharacterStats(prev => ({
                damage: prev.damage + (item.stat.includes('урона') ? value : 0),
                defense: prev.defense + (item.stat.includes('защиты') ? value : 0),
                health: prev.health + (item.stat.includes('здоровья') ? value : 0),
            }));
        }
    
        setItemSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = item; // помещаем новый предмет в слот
            return newSlots;
        });
    };
    

    const handleRemove = (index) => {
        // Узнать, какой предмет был удален
        const itemToRemove = itemSlots[index];

        if (itemToRemove) {
            const statChange = itemToRemove.stat.match(/\+(\d+)/);
            if (statChange) {
                const value = parseInt(statChange[1], 10);
                setCharacterStats(prev => ({
                    damage: prev.damage - (itemToRemove.stat.includes('урона') ? value : 0),
                    defense: prev.defense - (itemToRemove.stat.includes('защиты') ? value : 0),
                    health: prev.health - (itemToRemove.stat.includes('здоровья') ? value : 0),
                }));
            }
        }

        setItemSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = null; // очищаем слот
            return newSlots;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="assembly-constructor">
                <div className="constructor-container">
                    <div className="constructor-filters">
                        <h2>Фильтр</h2>
                        <select className="constructor-select" onChange={handleGameChange} value={selectedGame}>
                            <option value="">Выберите игру</option>
                            {Object.keys(characters).map((game) => (
                                <option key={game} value={game}>{game}</option>
                            ))}
                        </select>

                        <select className="constructor-select" onChange={handleCharacterChange} disabled={!selectedGame}>
                            <option value="">Выберите персонажа</option>
                            {selectedGame && characters[selectedGame].map((char) => (
                                <option key={char.name} value={char.name}>{char.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="constructor-character">
                        <h2>Персонаж</h2>
                        {selectedCharacter ? (
                            <div className="character-card">
                                <h3 className="character-name">{selectedCharacter.name}</h3>
                                <img 
                                    src={selectedCharacter.image} 
                                    alt={selectedCharacter.name} 
                                    className="character-image" 
                                />
                                <div className="character-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Урон:</span>
                                        <span className="stat-value">{characterStats.damage}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Защита:</span>
                                        <span className="stat-value">{characterStats.defense}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Здоровье:</span>
                                        <span className="stat-value">{characterStats.health}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-character">
                                <p>Выберите персонажа</p>
                            </div>
                        )}
                    </div>

                    <div className="constructor-items">
                        <h2>Фильтр предметов</h2>
                        <div className="items-grid">
                            {items.map((item) => (
                                <Item key={item.name} item={item} />
                            ))}
                        </div>

                        <h2>Слоты для предметов</h2>
                        <div className="item-slot-container">
                        {itemSlots.map((item, index) => (
                            <ItemSlot
                                key={index}
                                item={item} // передаем текущий предмет в слот
                                onDrop={(droppedItem) => handleDrop(droppedItem, index)}
                                onRemove={() => handleRemove(index)}
                            />
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default AssemblyConstructor;
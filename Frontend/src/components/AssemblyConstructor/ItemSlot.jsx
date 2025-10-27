import React from 'react';
import { useDrop } from 'react-dnd';
import './AssemblyConstructor.css';

const ItemSlot = ({ onDrop, item, onRemove }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (droppedItem) => {
            // Игнорируем попытку добавления предмета, если слот занят
            if (item) {
                return; // Слот занят, ничего не делаем
            }
            onDrop(droppedItem); // Слот пустой, добавляем предмет
        },
        canDrop: () => !item, // Разрешаем дроп только если слот пуст
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const handleRemove = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события клика
        onRemove(); // Удаляем предмет из ячейки
    };

    return (
        <div 
            ref={drop} 
            className={`item-slot ${isOver ? 'item-slot-over' : ''}`}
        >
            {item ? (
                <div className="slot-content">
                    <img src={item.image} alt={item.name} className="slot-item-image" />
                    <button 
                        onClick={handleRemove}
                        className="remove-button"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <span className="slot-empty-text">Слот</span>
            )}
        </div>
    );
};

export default ItemSlot;
import React from 'react';
import { useDrop } from 'react-dnd';
import './ItemSlot.css';

const ItemSlot = ({ onDrop, item, onRemove, slotNumber }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (droppedItem) => {
            if (item) return;
            onDrop(droppedItem);
        },
        canDrop: () => !item,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove();
    };

    return (
        <div 
            ref={drop} 
            className={`item-slot ${isOver ? 'slot-over' : ''} ${item ? 'slot-filled' : 'slot-empty'}`}
        >
            {item ? (
                <div className="slot-content">
                    <img 
                        src={item.item_image} // ← УБРАЛИ АБСОЛЮТНЫЙ ПУТЬ
                        alt={item.item_name}
                        onError={(e) => {
                            e.target.src = '/placeholder-item.jpg';
                        }}
                    />
                    <button 
                        onClick={handleRemove}
                        className="remove-btn"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <div className="slot-placeholder">
                    <span>Слот {slotNumber}</span>
                </div>
            )}
        </div>
    );
};

export default ItemSlot;
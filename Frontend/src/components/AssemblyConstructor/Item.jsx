import React from 'react';
import { useDrag } from 'react-dnd';
import './Item.css';

const Item = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const getStatText = () => {
        const stats = [];
        if (item.damage_bonus > 0) stats.push(`+${item.damage_bonus} урона`);
        if (item.defense_bonus > 0) stats.push(`+${item.defense_bonus} защиты`);
        if (item.health_bonus > 0) stats.push(`+${item.health_bonus} здоровья`);
        if (item.health_bonus < 0) stats.push(`${item.health_bonus} здоровья`);
        return stats.join(', ');
    };

    return (
        <div 
            ref={drag} 
            className="item-card"
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <div className="item-image">
                <img 
                    src={item.item_image} // ← УБРАЛИ АБСОЛЮТНЫЙ ПУТЬ
                    alt={item.item_name}
                    onError={(e) => {
                        e.target.src = '/placeholder-item.jpg';
                    }}
                />
            </div>
            <div className="item-info">
                <div className="item-name">{item.item_name}</div>
                <div className="item-stats">{getStatText()}</div>
            </div>
        </div>
    );
};

export default Item;
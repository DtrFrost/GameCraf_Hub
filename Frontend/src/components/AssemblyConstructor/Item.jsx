import React from 'react';
import { useDrag } from 'react-dnd';
import './AssemblyConstructor.css';

const Item = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { name: item.name, stat: item.stat, image: item.image },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div 
            ref={drag} 
            className="item-component"
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-name">{item.name}</div>
            <div className="item-stat">{item.stat}</div>
        </div>
    );
};

export default Item;
import React from 'react';
import { useDrag } from 'react-dnd';

const Item = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { name: item.name, stat: item.stat, image: item.image },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} style={{
            opacity: isDragging ? 0.5 : 1,
            padding: '10px',
            border: '1px solid black',
            cursor: 'move',
        }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto' }} />
            <div>{item.name} ({item.stat})</div>
        </div>
    );
};

export default Item;

import React from 'react';
import { useDrop } from 'react-dnd';

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
        <div ref={drop} style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column',
            height: '100%',
            width: '100%',
            borderRadius:'10px',
            border: '1px dashed black',
            backgroundColor: '424242',
            marginBottom: '10px',
            position: 'relative',
        }}>
            {item ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={item.image} alt={item.name} style={{
                        width: '100%', height: '100%', objectFit: 'contain' 
                    }} />
                    <button 
                        onClick={handleRemove}
                        style={{
                            width:'20px',
                            height:'20px',
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                        }}
                    >
                        ×
                    </button>
                </div>
            ) : (
                <span>Слот</span>
            )}
        </div>
    );
};

export default ItemSlot;

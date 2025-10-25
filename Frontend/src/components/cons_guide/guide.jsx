import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './guide.css';

const ItemTypes = {
  BLOCK: 'block',
};

// Компонент для перетаскиваемого блока
const DraggableBlock = ({ block }) => {
    const [, ref] = useDrag({
      type: ItemTypes.BLOCK,
      item: { id: block.id },
    });
  
    const blockStyles = {
      text: {
        backgroundColor: '#3C3C3C',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        border: '1px solid white',
      },
      image: {
        backgroundColor: '#3C3C3C',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        border: '1px solid white',
      },
      'text-image': {
        backgroundColor: '#3C3C3C',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Поместите текст справа от изображения
        borderRadius: '10px',
        border: '1px solid white',
        padding: '5px',
        gap: '10px',
      },
      'image-text': {
        backgroundColor: '#3C3C3C',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        border: '1px solid white',
        padding: '5px',
        gap: '10px',
      },
    };
  
    return (
      <div ref={ref} className="draggable-block" style={blockStyles[block.id]}>
        {block.id === 'text' && <div>Текст</div>}
        {block.id === 'image' && <div>Картинка</div>}
        {block.id === 'text-image' && (
          <>
            <div style={{ flexGrow: 1 }}>Текст + Картинка</div>
            <div className="example-image" style={{ width: '50px', height: '50px', backgroundColor: '#999', borderRadius: '5px' }} />
          </>
        )}
        {block.id === 'image-text' && (
          <>
            <div className="example-image" style={{ width: '50px', height: '50px', backgroundColor: '#999', borderRadius: '5px' }} />
            <div style={{ flexGrow: 1 }}>Картинка + Текст</div>
          </>
        )}
      </div>
    );
  };
  
  
  

// Компонент для перетаскиваемых элементов в рабочей области
const DraggableItem = ({ block, index, moveBlock, onDelete }) => {
    const [, ref] = useDrag({
      type: ItemTypes.BLOCK,
      item: { index },
    });
  
    const [imageSrc, setImageSrc] = useState(""); // Состояние для хранения изображения
    
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div ref={ref} className="workspace-item">
        <button onClick={() => moveBlock(index, -1)}>↑</button>
        <button onClick={() => moveBlock(index, 1)}>↓</button>
        <button className="delete-button" onClick={onDelete}>✖</button>
        <div className={block.type === 'text-image' ? 'text-image-container' : 'image-text-container'}>
          {block.type === 'text' && <textarea placeholder="Введите текст..." />}
          {block.type === 'image' && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
          {block.type === 'text-image' && (
            <>
              <textarea placeholder="Введите текст..." />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </>
          )}
          {block.type === 'image-text' && (
            <>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <textarea placeholder="Введите текст..." />
            </>
          )}
        </div>
        {imageSrc && <img src={imageSrc} alt="Загруженное изображение" className="image-preview" />}
      </div>
    );
  };
  
  

// Компонент для рабочей области
const DroppableArea = ({ blocks, setBlocks }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.BLOCK,
      drop(item) {
        // Создайте уникальный ID для нового блока
        const newBlock = { id: `${item.id}-${Date.now()}`, type: item.id };
        setBlocks(prev => [...prev, newBlock]);
      },
    });
  
    const moveBlock = (index, direction) => {
      const newBlocks = [...blocks];
      const targetIndex = index + direction;
  
      if (targetIndex >= 0 && targetIndex < newBlocks.length) {
        const [removed] = newBlocks.splice(index, 1);
        newBlocks.splice(targetIndex, 0, removed);
        setBlocks(newBlocks);
      }
    };
  
    return (
      <div ref={ref} className="workspace-area">
        {blocks.map((block, index) => (
          <DraggableItem 
            key={block.id} 
            index={index} 
            block={block} 
            moveBlock={moveBlock} 
            onDelete={() => {
              setBlocks(prev => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </div>
    );
  };
  

const Guide = () => {
  const initialBlocks = [
    { id: 'text', content: 'Текст' },
    { id: 'image', content: 'Картинка' },
    { id: 'text-image', content: 'Текст + Картинка' },
    { id: 'image-text', content: 'Картинка + Текст' },
  ];

  const [blocks, setBlocks] = useState([]);

  const saveGuide = () => {
    console.log('Сохранить гайд:', blocks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="guide-container">
        <div className="filter-panel">
          <h2>Блоки гайда:</h2>
          {initialBlocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
        </div>
        <div className="workspace">
          <h2>Рабочая область:</h2>
          <DroppableArea blocks={blocks} setBlocks={setBlocks} />
          <button onClick={saveGuide} className="save-button">Сохранить гайд</button>
        </div>
      </div>
    </DndProvider>
        );
      };
      
      export default Guide;
      
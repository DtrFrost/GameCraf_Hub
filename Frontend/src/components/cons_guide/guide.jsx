import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      border: '2px solid #05A5BE',
      cursor: 'grab',
    },
    image: {
      backgroundColor: '#3C3C3C',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      border: '2px solid #05A5BE',
      cursor: 'grab',
    },
    'text-image': {
      backgroundColor: '#3C3C3C',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: '10px',
      border: '2px solid #05A5BE',
      padding: '10px',
      gap: '15px',
      cursor: 'grab',
    },
    'image-text': {
      backgroundColor: '#3C3C3C',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '10px',
      border: '2px solid #05A5BE',
      padding: '10px',
      gap: '15px',
      cursor: 'grab',
    },
  };

  return (
    <div ref={ref} className="draggable-block" style={blockStyles[block.id]}>
      {block.id === 'text' && (
        <div className="block-content">
          <span className="block-icon">📝</span>
          <span>Текст</span>
        </div>
      )}
      {block.id === 'image' && (
        <div className="block-content">
          <span className="block-icon">🖼️</span>
          <span>Картинка</span>
        </div>
      )}
      {block.id === 'text-image' && (
        <div className="block-content">
          <span className="block-icon">📝🖼️</span>
          <span>Текст + Картинка</span>
        </div>
      )}
      {block.id === 'image-text' && (
        <div className="block-content">
          <span className="block-icon">🖼️📝</span>
          <span>Картинка + Текст</span>
        </div>
      )}
    </div>
  );
};

// Компонент для перетаскиваемых элементов в рабочей области
const DraggableItem = ({ block, index, moveBlock, onDelete, onContentChange }) => {
  const [, ref] = useDrag({
    type: ItemTypes.BLOCK,
    item: { index },
  });

  const fileInputRef = useRef(null);

  const handleTextChange = (text) => {
    onContentChange(index, { ...block.content, text });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onContentChange(index, { ...block.content, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageChange({ target: { files } });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div ref={ref} className="workspace-item">
      <div className="block-controls">
        <button onClick={() => moveBlock(index, -1)} title="Поднять выше">↑</button>
        <button onClick={() => moveBlock(index, 1)} title="Опустить ниже">↓</button>
        <button className="delete-button" onClick={onDelete} title="Удалить блок">✖</button>
      </div>
      
      <div className="block-content-area">
        {block.type === 'text' && (
          <textarea 
            placeholder="Введите текст вашего гайда..." 
            value={block.content?.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            className="content-textarea"
          />
        )}
        
        {block.type === 'image' && (
          <div 
            className="image-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {block.content?.image ? (
              <div className="image-preview-container">
                <img src={block.content.image} alt="Загруженное изображение" className="image-preview" />
                <button 
                  type="button" 
                  className="change-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  Сменить изображение
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📁</span>
                <p>Перетащите изображение сюда или кликните для загрузки</p>
                <small>Поддерживаются: JPG, PNG, GIF</small>
              </div>
            )}
          </div>
        )}
        
        {block.type === 'text-image' && (
          <div className="combined-block text-image-layout">
            <textarea 
              placeholder="Введите текст..." 
              value={block.content?.text || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="combined-textarea"
            />
            <div 
              className="image-upload-area combined-image"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {block.content?.image ? (
                <div className="image-preview-container">
                  <img src={block.content.image} alt="Загруженное изображение" className="image-preview" />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">🖼️</span>
                  <p>Добавить изображение</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {block.type === 'image-text' && (
          <div className="combined-block image-text-layout">
            <div 
              className="image-upload-area combined-image"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {block.content?.image ? (
                <div className="image-preview-container">
                  <img src={block.content.image} alt="Загруженное изображение" className="image-preview" />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">🖼️</span>
                  <p>Добавить изображение</p>
                </div>
              )}
            </div>
            <textarea 
              placeholder="Введите текст..." 
              value={block.content?.text || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="combined-textarea"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент для рабочей области
const DroppableArea = ({ blocks, setBlocks }) => {
  const [, ref] = useDrop({
    accept: ItemTypes.BLOCK,
    drop(item) {
      const newBlock = { 
        id: `${item.id}-${Date.now()}`, 
        type: item.id,
        content: {}
      };
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

  const handleContentChange = (index, content) => {
    const newBlocks = [...blocks];
    newBlocks[index].content = content;
    setBlocks(newBlocks);
  };

  return (
    <div ref={ref} className="workspace-area">
      {blocks.length === 0 ? (
        <div className="empty-workspace">
          <span className="empty-icon">📝</span>
          <p>Перетащите блоки из панели слева чтобы начать создавать гайд</p>
        </div>
      ) : (
        blocks.map((block, index) => (
          <DraggableItem 
            key={block.id} 
            index={index} 
            block={block} 
            moveBlock={moveBlock} 
            onDelete={() => setBlocks(prev => prev.filter((_, i) => i !== index))}
            onContentChange={handleContentChange}
          />
        ))
      )}
    </div>
  );
};

// Компонент для информации о гайде
const GuideInfo = ({ title, setTitle, coverImage, setCoverImage, game, setGame }) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageChange({ target: { files } });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="guide-info-section">
      <h3>📋 Информация о гайде</h3>
      
      <div className="guide-info-form">
        <div className="form-group">
          <label>Название гайда *</label>
          <input
            type="text"
            placeholder="Введите название гайда..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        <div className="form-group">
          <label>Игра *</label>
          <input
            type="text"
            placeholder="Для какой игры этот гайд?"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="game-input"
          />
        </div>

        <div className="form-group">
          <label>Обложка гайда</label>
          <div 
            className="cover-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {coverImage ? (
              <div className="cover-preview-container">
                <img src={coverImage} alt="Обложка гайда" className="cover-preview" />
                <button 
                  type="button" 
                  className="change-cover-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  Сменить обложку
                </button>
              </div>
            ) : (
              <div className="cover-upload-placeholder">
                <span className="upload-icon">🖼️</span>
                <p>Перетащите обложку сюда или кликните для загрузки</p>
                <small>Рекомендуемый размер: 1200x600px</small>
              </div>
            )}
          </div>
        </div>
      </div>
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
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const saveGuide = async () => {
    if (!title.trim() || !game.trim()) {
      alert('Пожалуйста, заполните название гайда и название игры');
      return;
    }

    if (blocks.length === 0) {
      alert('Добавьте хотя бы один блок в гайд');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      // Создаем FormData вместо JSON
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('game', game.trim());
      
      // Подготавливаем блоки и загружаем изображения
      const blocksData = blocks.map((block, index) => {
        const blockData = {
          type: block.type,
          content: {
            text: block.content?.text || ''
          },
          hasImage: false
        };

        // Если есть изображение, добавляем его в FormData
        if (block.content?.image && block.content.image.startsWith('data:')) {
          // Конвертируем base64 в blob
          const byteString = atob(block.content.image.split(',')[1]);
          const mimeString = block.content.image.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          
          const blob = new Blob([ab], { type: mimeString });
          formData.append('blockImages', blob, `block-${index}.jpg`);
          blockData.hasImage = true;
        }

        return blockData;
      });

      // Добавляем обложку если есть
      if (coverImage && coverImage.startsWith('data:')) {
        const byteString = atob(coverImage.split(',')[1]);
        const mimeString = coverImage.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        formData.append('coverImage', blob, 'cover.jpg');
      }

      formData.append('blocks', JSON.stringify(blocksData));

      console.log('📤 Отправка гайда с файлами...');

      const response = await fetch('http://localhost:3005/api/guides', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Не устанавливаем Content-Type - браузер сделает это сам с boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
      }

      const data = await response.json();

      alert('✅ Гайд успешно сохранен!');
      console.log('✅ Гайд сохранен:', data);
      
      // Очищаем форму
      setTitle('');
      setGame('');
      setCoverImage('');
      setBlocks([]);

    } catch (error) {
      console.error('❌ Ошибка сохранения гайда:', error);
      alert('❌ Ошибка при сохранении гайда: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Если пользователь не авторизован, перенаправляем
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="guide-container">
        <div className="guide-header">
          <h1>🎮 Конструктор гайдов</h1>
          <p>Создает: <strong>{user.name}</strong></p>
        </div>

        <div className="guide-layout">
          <div className="sidebar">
            <div className="blocks-panel">
              <h3>🧩 Блоки гайда</h3>
              <div className="blocks-list">
                {initialBlocks.map((block) => (
                  <DraggableBlock key={block.id} block={block} />
                ))}
              </div>
            </div>
          </div>

          <div className="main-content">
            <GuideInfo 
              title={title}
              setTitle={setTitle}
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              game={game}
              setGame={setGame}
            />

            <div className="workspace-section">
              <h3>📝 Содержание гайда</h3>
              <DroppableArea blocks={blocks} setBlocks={setBlocks} />
            </div>

            <div className="save-section">
              <button 
                onClick={saveGuide} 
                className="save-button"
                disabled={saving || !title.trim() || !game.trim() || blocks.length === 0}
              >
                {saving ? '💾 Сохранение...' : '💾 Сохранить гайд'}
              </button>
              <div className="guide-stats">
                <span>Блоков: {blocks.length}</span>
                <span>Автор: {user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Guide;
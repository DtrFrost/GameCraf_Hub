import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuidePage.css';

const GuidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3005/api/guides/${id}`);
      setGuide(response.data);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки гайда:', err);
      setError('Не удалось загрузить гайд');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="guide-page">
        <div className="loading">Загрузка гайда...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guide-page">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="guide-page">
        <div className="error">
          <p>Гайд не найден</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-page">
      <div className="guide-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1 className="guide-title">{guide.title}</h1>
        <div className="guide-meta">
          <span className="game">Игра: {guide.game}</span>
          <span className="author">Автор: {guide.author_name}</span>
          <span className="date">
            Создан: {new Date(guide.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>

      {/* ⚠️ БЛОК С ОБЛОЖКОЙ УБРАН - ЕГО ЗДЕСЬ НЕТ ⚠️ */}

      <div className="guide-content">
        {guide.blocks && guide.blocks.map((block, index) => (
          <div key={block.id || index} className={`guide-block ${block.type}-block`}>
            {block.type === 'text' && block.content.text && (
              <div className="text-content">
                <p>{block.content.text}</p>
              </div>
            )}
            {block.type === 'image' && block.content.image && (
              <div className="image-content">
                <img 
                  src={`http://localhost:3005${block.content.image}`} 
                  alt={`Иллюстрация ${index + 1}`} 
                />
              </div>
            )}
            {block.type === 'text-image' && (
              <div className="text-image-content">
                {block.content.text && <p>{block.content.text}</p>}
                {block.content.image && (
                  <img 
                    src={`http://localhost:3005${block.content.image}`} 
                    alt={`Иллюстрация ${index + 1}`} 
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidePage;
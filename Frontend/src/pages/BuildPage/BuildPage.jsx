import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import CommentsList from '../../components/Comments/CommentsList';
import AuthModal from '../../components/Modal/AuthModal';
import './BuildPage.css';

const BuildPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [build, setBuild] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');

  useEffect(() => {
    fetchBuildData();
  }, [id]);

  const fetchBuildData = async () => {
    try {
      setLoading(true);
      
      const buildResponse = await axios.get(`http://localhost:3005/api/builds/${id}`);
      setBuild(buildResponse.data);

      const commentsResponse = await axios.get(`http://localhost:3005/api/comments/build/${id}`);
      setComments(commentsResponse.data);

      const likesResponse = await axios.get(`http://localhost:3005/api/build-likes/build/${id}`);
      setLikes(likesResponse.data.likes);

      if (user) {
        const likedResponse = await axios.get(`http://localhost:3005/api/build-likes/build/${id}/check`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsLiked(likedResponse.data.liked);

        const favoriteResponse = await axios.get(`http://localhost:3005/api/build-favorites/${id}/check`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsFavorited(favoriteResponse.data.favorited);
      }

      setError('');
    } catch (err) {
      console.error('Ошибка загрузки сборки:', err);
      setError('Не удалось загрузить сборку');
    } finally {
      setLoading(false);
    }
  };

  const requireAuth = (action, callback) => {
    if (!user) {
      setAuthAction(action);
      setShowAuthModal(true);
      return false;
    }
    return callback();
  };

  const handleLike = () => {
    requireAuth('поставить лайк', async () => {
      try {
        const response = await axios.post(
          `http://localhost:3005/api/build-likes/build/${id}/toggle`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setIsLiked(response.data.liked);
        setLikes(prev => response.data.liked ? prev + 1 : prev - 1);
      } catch (error) {
        console.error('Ошибка лайка:', error);
      }
    });
  };

  const handleFavorite = () => {
    requireAuth('добавить в избранное', async () => {
      try {
        const response = await axios.post(
          `http://localhost:3005/api/build-favorites/${id}/toggle`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setIsFavorited(response.data.favorited);
      } catch (error) {
        console.error('Ошибка избранного:', error);
      }
    });
  };

  const handleComment = async (text) => {
    requireAuth('оставить комментарий', async () => {
      try {
        const response = await axios.post(
          'http://localhost:3005/api/comments',
          { buildId: id, text },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setComments(prev => [response.data, ...prev]);
      } catch (error) {
        console.error('Ошибка создания комментария:', error);
      }
    });
  };

  const handleReply = async (parentId, text) => {
    requireAuth('ответить на комментарий', async () => {
      try {
        const response = await axios.post(
          'http://localhost:3005/api/comments',
          { buildId: id, text, parentId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const updatedComments = comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data]
            };
          }
          return comment;
        });
        
        setComments(updatedComments);
      } catch (error) {
        console.error('Ошибка создания ответа:', error);
      }
    });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:3005/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const removeComment = (comments, id) => {
        return comments.filter(comment => {
          if (comment.id === id) return false;
          if (comment.replies) {
            comment.replies = removeComment(comment.replies, id);
          }
          return true;
        });
      };

      setComments(prev => removeComment(prev, commentId));
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
    }
  };

  if (loading) {
    return <div className="build-page"><div className="loading">Загрузка сборки...</div></div>;
  }

  if (error || !build) {
    return (
      <div className="build-page">
        <div className="error">
          <p>{error || 'Сборка не найдена'}</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="build-page">
      <div className="build-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>

        <div className="build-header">
          <h1 className="build-title">{build.title}</h1>
          
          <div className="build-actions">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              ❤️ {likes}
            </button>
            <button 
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleFavorite}
            >
              {isFavorited ? '★' : '☆'}
            </button>
          </div>

          <div className="build-meta">
            <span className="game-badge">{build.game_name}</span>
            <span className="character">Персонаж: {build.character_name}</span>
            <span className="author">Автор: {build.author_name}</span>
            <span className="date">
              {new Date(build.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        {build.description && (
          <div className="build-description">
            <h3>Описание сборки</h3>
            <p>{build.description}</p>
          </div>
        )}

        <div className="build-content">
          <div className="character-section">
            <h3>Характеристики персонажа</h3>
            <div className="character-stats">
              <div className="stat">
                <span className="stat-icon">⚔️</span>
                <span className="stat-value">{build.total_damage || 0}</span>
                <span className="stat-label">Урон</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🛡️</span>
                <span className="stat-value">{build.total_defense || 0}</span>
                <span className="stat-label">Защита</span>
              </div>
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{build.total_health || 0}</span>
                <span className="stat-label">Здоровье</span>
              </div>
            </div>
          </div>

          <div className="items-section">
            <h3>Предметы сборки</h3>
            <div className="items-grid">
              {build.items && build.items.map((item, index) => (
                item && (
                  <div key={index} className="build-item">
                    <div className="item-image">
                      <img 
                        src={item.item_image} 
                        alt={item.item_name}
                        onError={(e) => {
                          e.target.src = '/items/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="item-info">
                      <h4>{item.item_name}</h4>
                      <div className="item-stats">
                        {item.damage_bonus > 0 && (
                          <span className="damage-bonus">+{item.damage_bonus} урона</span>
                        )}
                        {item.defense_bonus > 0 && (
                          <span className="defense-bonus">+{item.defense_bonus} защиты</span>
                        )}
                        {item.health_bonus > 0 && (
                          <span className="health-bonus-positive">+{item.health_bonus} здоровья</span>
                        )}
                        {item.health_bonus < 0 && (
                          <span className="health-bonus-negative">{item.health_bonus} здоровья</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="comments-section">
          <CommentsList
            comments={comments}
            onComment={handleComment}
            onReply={handleReply}
            onDelete={handleDeleteComment}
            contentAuthorId={build.user_id}
            contentType="build"
          />
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          action={authAction}
        />
      </div>
    </div>
  );
};

export default BuildPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import CommentsList from '../../components/Comments/CommentsList';
import AuthModal from '../../components/Modal/AuthModal';
import './GuidePage.css';

const GuidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');

  useEffect(() => {
    fetchGuideData();
  }, [id]);

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      
      // Загружаем гайд
      const guideResponse = await axios.get(`http://localhost:3005/api/guides/${id}`);
      setGuide(guideResponse.data);

      // Загружаем комментарии
      const commentsResponse = await axios.get(`http://localhost:3005/api/comments/guide/${id}`);
      setComments(commentsResponse.data);

      // Загружаем лайки
      const likesResponse = await axios.get(`http://localhost:3005/api/likes/guide/${id}`);
      setLikes(likesResponse.data.likes);

      // Проверяем лайк и избранное пользователя
      if (user) {
        const likedResponse = await axios.get(`http://localhost:3005/api/likes/guide/${id}/check`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsLiked(likedResponse.data.liked);

        const favoriteResponse = await axios.get(`http://localhost:3005/api/favorites/guide/${id}/check`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsFavorited(favoriteResponse.data.favorited);
      }

      setError('');
    } catch (err) {
      console.error('Ошибка загрузки гайда:', err);
      setError('Не удалось загрузить гайд');
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
          `http://localhost:3005/api/likes/guide/${id}/toggle`,
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
          `http://localhost:3005/api/favorites/guide/${id}/toggle`,
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
      const response = await axios.post(
        'http://localhost:3005/api/comments',
        { guideId: id, text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setComments(prev => [response.data, ...prev]);
    });
  };

  const handleReply = async (parentId, text) => {
    requireAuth('ответить на комментарий', async () => {
      const response = await axios.post(
        'http://localhost:3005/api/comments',
        { guideId: id, text, parentId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Обновляем комментарии
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
    });
  };

  const handleDeleteComment = async (commentId) => {
    await axios.delete(
      `http://localhost:3005/api/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    // Удаляем комментарий из состояния
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
  };

  if (loading) {
    return <div className="guide-page"><div className="loading">Загрузка гайда...</div></div>;
  }

  if (error || !guide) {
    return (
      <div className="guide-page">
        <div className="error">
          <p>{error || 'Гайд не найден'}</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-page">
      <div className="guide-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>
        <h1 className="guide-title">{guide.title}</h1>
        
        <div className="guide-actions">
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

        <div className="guide-meta">
          <span className="game">Игра: {guide.game}</span>
          <span className="author">Автор: {guide.author_name}</span>
          <span className="date">Создан: {new Date(guide.created_at).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>

      <div className="guide-content">
        {guide.blocks && guide.blocks.map((block, index) => (
          <div key={block.id || index} className={`guide-block ${block.type}-block`}>
            {/* ... существующий код блоков ... */}
          </div>
        ))}
      </div>

      {/* Комментарии */}
      <CommentsList
        comments={comments}
        onComment={handleComment}
        onReply={handleReply}
        onDelete={handleDeleteComment}
        guideAuthorId={guide.user_id}
      />

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </div>
  );
};

export default GuidePage;
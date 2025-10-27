import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Comment from './Comment';
import './CommentsList.css';

const CommentsList = ({ comments, onComment, onReply, onDelete, guideAuthorId }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(commentText);
      setCommentText('');
    } catch (error) {
      console.error('Ошибка отправки комментария:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Комментарии ({comments.length})
      </h3>

      {/* Форма добавления комментария */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Оставьте ваш комментарий..."
            rows="4"
            required
          />
          <div className="comment-form-actions">
            <button 
              type="submit" 
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Войдите, чтобы оставить комментарий</p>
        </div>
      )}

      {/* Список комментариев */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={onReply}
              onDelete={onDelete}
              guideAuthorId={guideAuthorId}
            />
          ))
        ) : (
          <div className="no-comments">
            <p>Пока нет комментариев. Будьте первым!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
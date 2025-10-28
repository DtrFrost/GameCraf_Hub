import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Comment.css';

const Comment = ({ comment, onReply, onDelete, contentAuthorId, contentType }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = comment.author_id === contentAuthorId;
  const canDelete = user && user.id === comment.author_id;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить комментарий?')) {
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Ошибка удаления комментария:', error);
      }
    }
  };

  return (
    <div className={`comment ${comment.parent_id ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          <span className="author-name">{comment.author_name}</span>
          {isAuthor && <span className="author-badge">Автор {contentType === 'build' ? 'сборки' : 'гайда'}</span>}
        </div>
        <div className="comment-actions">
          {user && !comment.parent_id && (
            <button 
              className="reply-btn"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Ответить
            </button>
          )}
          {canDelete && (
            <button 
              className="delete-btn"
              onClick={handleDelete}
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      <div className="comment-content">
        <p>{comment.text}</p>
      </div>

      <div className="comment-footer">
        <span className="comment-date">
          {new Date(comment.created_at).toLocaleDateString('ru-RU')}
        </span>
        {comment.is_edited && (
          <span className="edited-badge">(изменено)</span>
        )}
      </div>

      {showReplyForm && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Ваш ответ..."
            rows="3"
            required
          />
          <div className="reply-actions">
            <button 
              type="button" 
              onClick={() => setShowReplyForm(false)}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={!replyText.trim() || isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Ответить'}
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              contentAuthorId={contentAuthorId}
              contentType={contentType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
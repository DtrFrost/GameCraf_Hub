import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, action = "выполнить это действие" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Требуется авторизация</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p>Чтобы {action}, необходимо войти в систему или зарегистрироваться.</p>
          
          <div className="auth-options">
            <button className="auth-btn login-btn" onClick={handleLogin}>
              Войти
            </button>
            <button className="auth-btn register-btn" onClick={handleRegister}>
              Зарегистрироваться
            </button>
          </div>
          
          <p className="modal-note">
            После регистрации вы сможете комментировать, ставить лайки и добавлять гайды в избранное!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
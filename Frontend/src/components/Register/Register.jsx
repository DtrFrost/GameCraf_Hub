import React from "react";
import './Register.css'; // Подключаем стили

const Register = () => {
  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form>
        <div className="form-group">
        <label>Почта</label>
        <input type="email" required />
        </div>
        <div className="form-group">
        <label>Логин</label>
        <input type="text" required />
        </div>
        <div className="form-group">
        <label>Пароль</label>
        <input type="password" required />
        </div>
        <div className="form-group">
        <label>Повтор пароля</label>
        <input type="password" required />
        </div>
        <div className="form-group">
        <p>
          Есть аккаунт? <a href="/login" className="link">Вход</a>
        </p>
        </div>
        <button type="submit" className="register-button">Регистрация</button>
      </form>
    </div>
  );
};

export default Register;

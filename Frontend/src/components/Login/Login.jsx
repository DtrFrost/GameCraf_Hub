import React from "react";
import './Login.css';

const Login = () => {
  return (
    <div className="register-container">
      <h2>Авторизация</h2>
      <form>
        <div className="form-group">
        <label>Логин</label>
        <input type="text" required />
        </div>
        <div className="form-group">
        <label>Пароль</label>
        <input type="password" required />
        </div>
        <div className="form-group">
        <p>
          Нет аккаунта? <a href="/Register" className="link">Регистрация</a>
        </p>
        </div>
        <button type="submit" className="register-button">Вход</button>
      </form>
    </div>
  );
};

export default Login;

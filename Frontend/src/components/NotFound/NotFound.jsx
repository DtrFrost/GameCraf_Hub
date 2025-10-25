import React from "react";
import { useNavigate } from "react-router-dom";
import './NotFound.css';


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">
        <span>40</span>
        <span className="not-found-highlight">4</span>
      </h1>
      <p className="not-found-message">Страница не найдена, вернитесь на главную</p>
      <button className="not-found-button" onClick={() => navigate("/")}>
        На главную
      </button>
    </div>
  );
};

export default NotFound;
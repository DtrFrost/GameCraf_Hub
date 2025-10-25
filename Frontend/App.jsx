import React from "react";
import Header from "./src/components/Header/header";
import Profile from "./src/components/Profile/Profile"
import Footer from "./src/components/Footer/footer"
import Register from "./src/components/Register/Register"
import Login from "./src/components/Login/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

const App = () => {
  const username = "docmoc4";
  const date = "23 октября 2023 г.";
  const messages = [
    "Топ сборка для последнего обновления 1.4",
    "Купить лучший компьютер для игр",
    "Обновление системы: что нового?",
  ];
  return (
    <Router>
    <div className="app">
      <Header />
      <Routes>
          <Route path="/" element={<Profile username={username} date={date} messages={messages} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      <Footer />
    </div>
    </Router>
  );
};

export default App;

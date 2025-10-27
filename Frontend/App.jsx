import React from "react";
import Header from "./src/components/Header/header";
import Profile from "./src/components/Profile/Profile"
import Footer from "./src/components/Footer/footer"
import Register from "./src/components/Register/Register"
import Login from "./src/components/Login/Login";
import GuidePage from './src/pages/GuidePage/GuidePage'; // ← Убедись что путь правильный
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import './App.css';
import NotFound from "./src/components/NotFound/NotFound";
import Guide from './src/components/cons_guide/guide'

import HomePage from './src/pages/HomePage/HomePage'

import AssemblyConstructor from './src/components/AssemblyConstructor/AssemblyConstructor'

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Загрузка...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <Routes>
        {/* Главная страница - доступна всем */}
        <Route path="/" element={<HomePage />} />
        
        {/* Профиль пользователя - защищенный маршрут */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile 
                username={user ? user.name : "Гость"} 
                date={user ? new Date(user.created_at).toLocaleDateString('ru-RU') : "Не авторизован"} 
                messages={user ? [
                  "Добро пожаловать в ваш профиль!",
                  "Создайте свой первый гайд",
                  "Исследуйте возможности платформы"
                ] : ["Войдите в систему чтобы увидеть ваш профиль"]} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 📍 ДОБАВЬ ЭТОТ МАРШРУТ - страница просмотра гайда */}
        <Route path="/guide/:id" element={<GuidePage />} />
        
        {/* Создание гайда - защищенный маршрут */}
        <Route 
          path="/guide" 
          element={
            <ProtectedRoute>
              <Guide />
            </ProtectedRoute>
          } 
        />

        

        <Route path='/AssemblyConstructor' element={<AssemblyConstructor />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
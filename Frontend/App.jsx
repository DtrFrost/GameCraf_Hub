import React from "react";
import Header from "./src/components/Header/header";
import Profile from "./src/components/Profile/Profile"
import Footer from "./src/components/Footer/footer"
import Register from "./src/components/Register/Register"
import Login from "./src/components/Login/Login";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import './App.css';
import NotFound from "./src/components/NotFound/NotFound";
import Guide from './src/components/cons_guide/guide'

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
        <Route path="/" element={
          <Profile 
            username={user ? user.name : "Гость"} 
            date={user ? new Date(user.created_at).toLocaleDateString('ru-RU') : "Не авторизован"} 
            messages={user ? [
              "Добро пожаловать в ваш профиль!",
              "Создайте свой первый гайд",
              "Исследуйте возможности платформы"
            ] : ["Войдите в систему чтобы увидеть ваш профиль"]} 
          />
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/guide" 
          element={
            <ProtectedRoute>
              <Guide />
            </ProtectedRoute>
          } 
        />
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
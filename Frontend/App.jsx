import React from "react";
import Header from "./src/components/Header/header";
import Profile from "./src/components/Profile/Profile";
import Footer from "./src/components/Footer/footer";
import Register from "./src/components/Register/Register";
import Login from "./src/components/Login/Login";
import GuidePage from './src/pages/GuidePage/GuidePage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import './App.css';
import NotFound from "./src/components/NotFound/NotFound";
import Guide from './src/components/cons_guide/guide';
import HomePage from './src/pages/HomePage/HomePage';
import AssemblyConstructor from './src/components/AssemblyConstructor/AssemblyConstructor';
import BuildPage from './src/pages/BuildPage/BuildPage'; // Добавим страницу просмотра сборки

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
      <main className="main-content">
        <Routes>
          {/* Главная страница - доступна всем */}
          <Route path="/" element={<HomePage />} />
          
          {/* Аутентификация */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Гайды */}
          <Route path="/guide/:id" element={<GuidePage />} />
          <Route 
            path="/guide" 
            element={
              <ProtectedRoute>
                <Guide />
              </ProtectedRoute>
            } 
          />
          
          {/* Сборки */}
          <Route path="/build/:id" element={<BuildPage />} />
          <Route 
            path="/build-constructor" 
            element={
              <ProtectedRoute>
                <AssemblyConstructor />
              </ProtectedRoute>
            } 
          />
          
          {/* Профиль пользователя - защищенный маршрут */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Реддирект со старого пути AssemblyConstructor на новый */}
          <Route 
            path="/AssemblyConstructor" 
            element={<Navigate to="/build-constructor" replace />} 
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
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
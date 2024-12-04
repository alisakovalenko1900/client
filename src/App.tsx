import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import ProfileSelection from './components/ProfileSelection';
import Movies from './components/Movies';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Авторизация
  const [profileSelected, setProfileSelected] = useState(false); // Выбор профиля
  const [isKidsMode, setIsKidsMode] = useState(false); // Детский режим

  return (
    <Router>
      <Routes>
        {/* Авторизация */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isKidsMode ? (
                <Navigate to="/movies" /> // Перенаправление в детский режим
              ) : (
                <Navigate to="/profiles" /> // Перенаправление в обычный режим
              )
            ) : (
              <Login
                onLogin={(kidsMode: boolean) => {
                  setIsAuthenticated(true);
                  setIsKidsMode(kidsMode); // Сохраняем режим
                }}
              />
            )
          }
        />

        {/* Выбор профиля */}
        <Route
          path="/profiles"
          element={
            isAuthenticated && !isKidsMode ? (
              profileSelected ? (
                <Navigate to="/movies" />
              ) : (
                <ProfileSelection onSelectProfile={() => setProfileSelected(true)} />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Фильмы */}
        <Route
          path="/movies"
          element={
            isAuthenticated ? (
              <Movies isKidsMode={isKidsMode} /> // Передаем статус
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Забыли пароль */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

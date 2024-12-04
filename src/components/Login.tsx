import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  onLogin: (kidsMode: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isKidsMode, setIsKidsMode] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/register' : '/login';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      alert(data.message); // Показываем сообщение из ответа сервера

      if (!isRegistering) {
        onLogin(isKidsMode); // Передаем статус детского режима
      }
    } catch (error: any) {
      alert(error.message || 'Ошибка подключения к серверу');
    }
  };  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isKidsMode}
            onChange={(e) => setIsKidsMode(e.target.checked)}
          />
          Детский режим
        </label>
        <button type="submit">{isRegistering ? 'Зарегистрироваться' : 'Войти'}</button>
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
        </button>
        {/* Новая кнопка "Забыли пароль?" */}
        {!isRegistering && (
          <button
            type="button"
            className="forgot-password-button"
            onClick={() => navigate('/forgot-password')}
          >
            Забыли пароль?
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;

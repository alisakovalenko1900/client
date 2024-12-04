import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            setMessage('Error: Unable to send reset email');
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleForgotPassword} className="forgot-password-form">
                <h2>Забыли пароль?</h2>
                <div>
                    <input
                        type="email"
                        placeholder="Введите свой e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '70px' }}>
                    <button type="submit">Отправить ссылку для сброса пароля</button>
                </div>
                <p>{message}</p>
            </form>
        </div>
    );
};

export default ForgotPassword;

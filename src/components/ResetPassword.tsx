import React, { useState } from 'react';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            setMessage('Error: Unable to reset password');
        }
    };

    return (
        <form onSubmit={handleResetPassword}>
            <h2>Сбросить пароль</h2>
            <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <button type="submit">Сбросить пароль</button>
            <p>{message}</p>
        </form>
    );
};

export default ResetPassword;

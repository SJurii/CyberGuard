import { useState } from "react";
import "../registration/styles/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.text();
        alert(data);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Вход</h2>

                <form onSubmit={handleLogin}>
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

                    <button type="submit">Войти</button>
                </form>

                <div className="auth-footer">
                    Нет аккаунта? <a href="/register">Регистрация</a>
                </div>
            </div>
        </div>
    );
}

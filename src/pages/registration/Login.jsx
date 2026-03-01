import { useState } from "react";
import "../registration/styles/auth.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Сохраняем всё, что прислал сервер
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userId", data.id); // <--- Важно для страницы профиля
            localStorage.setItem("userName", data.username);

            navigate("/profile");
        }else {
            // Если сервер вернул 401 или 403
            const errorText = await response.text();
            alert("Ошибка входа: " + errorText);
        }
    } catch (error) {
        console.error("Ошибка сети:", error);
        alert("Не удалось связаться с сервером");
    }
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

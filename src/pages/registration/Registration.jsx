import { useState } from "react";
import "../registration/styles/auth.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                email,
                password
            })
        });
        if (response.ok) {
            //const data = await response.text();
            //alert(data);
            navigate("/login");
        }else{
            alert("Ошибка при регистрации");
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Ошибка при регистрации");
                
    };
}

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Регистрация</h2>

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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

                    <button type="submit">Создать аккаунт</button>
                </form>

                <div className="auth-footer">
                    Уже есть аккаунт? <a href="/login">Войти</a>
                </div>
            </div>
        </div>
    );
}

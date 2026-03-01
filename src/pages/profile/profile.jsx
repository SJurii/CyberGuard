import React, { useEffect, useState } from "react";
import "../profile/styles/profile.css";
import { NavLink, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  // 1. Инициализируем состояние (null по умолчанию)
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Убедись, что эти ключи совпадают с тем, что ты сохранил при Login!
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken"); // В прошлом шаге мы сохраняли как userToken

    if (!token) {
        navigate("/login");
        return;
    }

    fetch(`http://localhost:8080/api/profile/${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Не удалось загрузить профиль");
        return res.json();
    })
    .then(data => {
        setUserData(data); 
    })
    .catch(err => {
        console.error("Ошибка:", err);
        // Если токен плохой — можно разлогинить
        // localStorage.clear();
        // navigate("/login");
    });
  }, [navigate]);

  // 2. Пока данные не пришли, показываем индикатор загрузки
  if (!userData) {
    return <div className="loading">Загрузка данных профиля...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Левая колонка */}
        <aside className="profile-sidebar">
          <div className="avatar-wrapper">
            <div className="avatar-main">👤</div>
            <button className="edit-avatar">📷</button>
          </div>
          
          <div className="user-bio">
            <h1>{userData.name}</h1>
            <p className="user-rank">{userData.rank || "Новичок"}</p>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span>📧 Email:</span>
              <strong>{userData.email}</strong>
            </div>
            <div className="detail-item">
              <span>📅 Регистрация:</span>
              {/* Если дата с сервера — проверь формат поля */}
              <strong>{userData.birthDate || "Не указана"}</strong>
            </div>
          </div>

            <NavLink to="/" className="back-link">
                <button className="back-btn">Назад</button>
            </NavLink>
            
            <button className="logout-btn" onClick={() => {
                localStorage.clear();
                navigate("/login");
            }}>Выйти</button>
        </aside>
        
        {/* Правая колонка */}
        <main className="profile-main">
          <section className="stats-grid">
            <div className="stat-card points">
              <h3>Баллы опыта</h3>
              <div className="points-val">{userData.points || 0}</div>
              <p>До следующего ранга: {1500 - (userData.points || 0)} XP</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${(userData.points / 1500) * 100}%`}}></div>
              </div>
            </div>
          </section>

          <section className="achievements-section">
            <h2>Достижения</h2>
            <div className="achievements-list">
              {/* Проверяем, есть ли достижения в данных с сервера */}
              {userData.achievements && userData.achievements.length > 0 ? (
                userData.achievements.map(ach => (
                  <div key={ach.id} className="achievement-card">
                    <span className="ach-icon">{ach.icon}</span>
                    <div className="ach-info">
                      <h4>{ach.title}</h4>
                      <p>{ach.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Достижений пока нет. Пора в бой!</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "../profile/styles/profile.css";
import { NavLink, useNavigate } from "react-router-dom";

const Profile = () => {
  const myId = localStorage.getItem("userId"); // Назовем явно "мой ID"
  const { id } = useParams(); // ID из URL
  const navigate = useNavigate();
  const myProfile = !id || id === myId;

  const [userData, setUserData] = useState(null);

  // Определяем итоговый ID для запроса: 
  // Если в URL есть id — берем его, если нет — берем свой.
  const targetId = id || myId;

  useEffect(() => {
    const token = localStorage.getItem("userToken"); 

    if (!token) {
        navigate("/login");
        return;
    }

    // Очищаем старые данные перед загрузкой новых (чтобы не видеть чужой профиль секунду)
    setUserData(null);

    fetch(`http://localhost:8080/api/profile/${targetId}`, {
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
    });

    // ВАЖНО: useEffect должен срабатывать каждый раз, когда меняется targetId
  }, [targetId, navigate]);

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
            <p className="user-rank">{userData.rank?.name || "Новичок"}</p>
          </div>

          <div className="user-details">
           {myProfile ? (
             <div className="detail-item">
              <span>📧 Email:</span>
              <strong>{userData.email}</strong>
            </div>) : (null)}
    
            <div className="detail-item">
              <span>📅 Регистрация:</span>
              {/* Если дата с сервера — проверь формат поля */}
              <strong>{userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("ru-RU")
                  : "Не указана" }
                  </strong>
            </div>
          </div>

            <NavLink to="/" className="back-link">
                <button className="back-btn">Назад</button>
            </NavLink>
            {myProfile ? (
            <button className="logout-btn" onClick={() => {
                localStorage.clear();
                navigate("/login");
            }}>Выйти</button>):(null)}
        </aside>
        
        {/* Правая колонка */}
        <main className="profile-main">
          <section className="stats-grid">
            <div className="stat-card points">
              <h3>Баллы опыта</h3>
              <div className="points-val">{userData.totalPoints || 0}</div>
              <p>До следующего ранга: {(userData.nextRankPoints - (userData.totalPoints || 0)) || 0} XP</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${(userData.totalPoints / userData.nextRankPoints) * 100}%`}}></div>
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
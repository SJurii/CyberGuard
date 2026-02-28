import React from "react";
import "../profile/styles/profile.css";
import { NavLink } from "react-router-dom";

const Profile = () => {
  // В будущем эти данные придут из твоего бэкенда на Spring Boot
  const userData = {
    name: "Кибер-Защитник",
    email: "user@cyberguard.pro",
    birthDate: "15.05.2000",
    points: 1250,
    rank: "Младший аналитик",
    achievements: [
      { id: 1, icon: "🛡️", title: "Первая защита", desc: "Распознал SMS-атаку" },
      { id: 2, icon: "🔍", title: "Сыщик", desc: "Нашел 5 скрытых улик" },
      { id: 3, icon: "🔥", title: "В ударе", desc: "3 дня обучения подряд" },
    ]
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Левая колонка: Инфо пользователя */}
        <aside className="profile-sidebar">
          <div className="avatar-wrapper">
            <div className="avatar-main">👤</div>
            <button className="edit-avatar">📷</button>
          </div>
          
          <div className="user-bio">
            <h1>{userData.name}</h1>
            <p className="user-rank">{userData.rank}</p>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span>📧 Email:</span>
              <strong>{userData.email}</strong>
            </div>
            <div className="detail-item">
              <span>📅 Регистрация:</span>
              <strong>{userData.birthDate}</strong>
            </div>
          </div>

            <NavLink to="/" className="back-link">
                <button className="back-btn">
                Назад
                </button>
            </NavLink>
        </aside>
        

        {/* Правая колонка: Прогресс и достижения */}
        <main className="profile-main">
          <section className="stats-grid">
            <div className="stat-card points">
              <h3>Баллы опыта</h3>
              <div className="points-val">{userData.points}</div>
              <p>До следующего ранга: 250 XP</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
            </div>
          </section>

          <section className="achievements-section">
            <h2>Достижения</h2>
            <div className="achievements-list">
              {userData.achievements.map(ach => (
                <div key={ach.id} className="achievement-card">
                  <span className="ach-icon">{ach.icon}</span>
                  <div className="ach-info">
                    <h4>{ach.title}</h4>
                    <p>{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

      </div>
    </div>
  );
};

export default Profile;
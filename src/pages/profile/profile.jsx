import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import * as Icons from "lucide-react";
import "../profile/styles/profile.css";

const Profile = () => {
  const myId = localStorage.getItem("userId");
  const { id } = useParams();
  const navigate = useNavigate();
  const myProfile = !id || id === myId;
  const [userData, setUserData] = useState(null);

  const targetId = id || myId;

  // Тот же эффект скролла для единства дизайна
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken"); 
    if (!token) { navigate("/login"); return; }

    setUserData(null);
    fetch(`http://localhost:8080/api/profile/${targetId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
    })
    .then(data => setUserData(data))
    .catch(err => console.error(err));
  }, [targetId, navigate]);

  const AchievementIcon = ({ name, color = "#6366f1" }) => {
    const LucideIcon = Icons[name] || Icons.Award;
    return <LucideIcon color={color} size={32} strokeWidth={1.5} className="ach-icon" />;
  };

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">Загрузка защищенных данных...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <aside className="profile-sidebar">
          <div className="avatar-wrapper">
            <div className="avatar-main">
              <Icons.User size={60} color="#6366f1" strokeWidth={1} />
            </div>
            {myProfile && <button className="edit-avatar"><Icons.Camera size={16}/></button>}
          </div>
          
          <div className="user-bio">
            <h1>{userData.name}</h1>
            <p className="user-rank">{userData.rank?.name || "Агент безопасности"}</p>
          </div>

          <div className="user-details">
            {myProfile && (
              <div className="detail-item">
                <span>Электронная почта</span>
                <strong>{userData.email}</strong>
              </div>
            )}
            <div className="detail-item">
              <span>В системе с</span>
              <strong>{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("ru-RU") : "---"}</strong>
            </div>
          </div>

          <div className="sidebar-actions">
            <NavLink to="/" className="back-link">
                <button className="back-btn">На главную</button>
            </NavLink>
            {myProfile && (
              <button className="logout-btn" onClick={() => {
                  localStorage.clear();
                  navigate("/login");
              }}>Терминировать сессию</button>
            )}
          </div>
        </aside>
        
        <main className="profile-main">
          <section className="stat-card">
            <h3>Текущий опыт (XP)</h3>
            <div className="points-val">{userData.totalPoints || 0}</div>
            <p>До следующего уровня: <strong>{(userData.nextRankPoints - (userData.totalPoints || 0)) || 0} XP</strong></p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${Math.min((userData.totalPoints / userData.nextRankPoints) * 100, 100)}%`}}></div>
            </div>
          </section>

          <section className="achievements-section">
            <h2>Достигнутые цели</h2>
            <div className="achievements-list">
              {userData.achievements?.length > 0 ? (
                userData.achievements.map(ach => (
                  <div key={ach.id} className="achievement-card">
                    <AchievementIcon name={ach.icon} />
                    <div className="ach-info">
                      <h4>{ach.title}</h4>
                      <p>{ach.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-achievements">Активных достижений пока нет. Начните обучение для их получения.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
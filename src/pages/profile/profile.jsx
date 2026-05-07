import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import * as Icons from "lucide-react";
import "../profile/styles/profile.css";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user: currentUser, updateProfile } = useAuth();// Тот, кто смотрит страницу
  const myId = currentUser?.id;
  const { id } = useParams();
  const navigate = useNavigate();
  
  const myProfile = !id || id === myId;
  const isAdmin = currentUser?.role === "ADMIN"; 
  const targetId = id || myId;

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!targetId || targetId === "null" || targetId === "undefined") return;

    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }

    setUserData(null);

    fetch(`http://localhost:8080/api/profile/${targetId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        setUserData(data);
        setNewName(data.name);
    })
    .catch(err => console.error("Fetch error:", err));
  }, [targetId, navigate]);

  const handleUpdateName = () => {
    const token = localStorage.getItem("userToken");
    
    fetch(`http://localhost:8080/api/admin/users/${targetId}/update-name`, {
        method: "PATCH",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newName })
    })
    .then(async res => {
        if (res.ok) {
            // 1. Обновляем данные в текущем компоненте
            setUserData(prev => ({ ...prev, name: newName }));
            
            // 2. Если мы редактируем СВОЙ профиль, обновляем данные в AuthContext
            if (myProfile && updateProfile) {
                updateProfile({ ...currentUser, name: newName });
            }
            
            setIsEditing(false);
            alert("Имя успешно обновлено");
        } else {
            const error = await res.text();
            alert("Ошибка: " + error);
        }
    })
    .catch(err => {
        console.error("Update error:", err);
        alert("Ошибка соединения с сервером");
    });
  };

  const handleChangeRole = (newRole) => {
    const token = localStorage.getItem("userToken");
    
    fetch(`http://localhost:8080/api/admin/users/${targetId}/role`, {
        method: "PATCH",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(async res => {
        if (res.ok) {
            setUserData(prev => ({ ...prev, role: newRole }));
        } else {
            const errorText = await res.text();
            alert(errorText || "Ошибка при смене роли");
        }
    })
    .catch(err => {
        console.error("Role update error:", err);
        alert("Критическая ошибка соединения");
    });
  };

  const AchievementIcon = ({ name, color = "#6366f1" }) => {
    const LucideIcon = Icons[name] || Icons.Award;
    return (
      <div className="ach-icon-wrapper" style={{ '--ach-color': color }}>
        <LucideIcon size={24} strokeWidth={2} className="ach-icon-svg" />
      </div>
    );
  };

  if (!userData) {
    return <div className="profile-page"><div className="loading-spinner">Загрузка...</div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <aside className="profile-sidebar">
          {isAdmin && !myProfile && (
            <div className="admin-badge-panel">
              <Icons.ShieldAlert size={16} />
              <span>ADMIN ACCESS</span>
            </div>
          )}

          <div className="avatar-wrapper">
            <div className="avatar-main">
              <Icons.User size={60} color="#6366f1" strokeWidth={1} />
            </div>
          </div>
          
          <div className="user-bio">
            {isEditing ? (
              <div className="edit-name-group">
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="admin-input"
                />
                <button onClick={handleUpdateName} className="save-btn small"><Icons.Check size={14}/></button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn small"><Icons.X size={14}/></button>
              </div>
            ) : (
              <div className="name-display">
                <h1>{userData.name}</h1>
                {isAdmin && <Icons.Edit2 size={16} className="edit-trigger" onClick={() => setIsEditing(true)} />}
              </div>
            )}
            <p className="user-rank">{userData.rank?.name || "Агент безопасности"}</p>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span>Роль в системе</span>
              <strong style={{color: userData.role === 'ADMIN' ? '#f43f5e' : '#10b981'}}>
                {userData.role}
              </strong>
            </div>
            {isAdmin && (
              <div className="detail-item">
                <span>Электронная почта</span>
                <strong>{userData.email}</strong>
              </div>
            )}
          </div>

          {isAdmin && !myProfile && (
            <div className="admin-actions-block">
              
              {userData.role === "ADMIN" ? (
                <button className="role-btn demote" onClick={() => handleChangeRole("USER")}>
                   <Icons.UserMinus size={14}/> Снять админа
                </button>
              ) : (
                <button className="role-btn promote" onClick={() => handleChangeRole("ADMIN")}>
                   <Icons.ShieldCheck size={14}/> Сделать админом
                </button>
              )}
            </div>
          )}

          <div className="sidebar-actions">
            <NavLink to="/dashboard" className="back-link">
                <button className="back-btn">На главную</button>
            </NavLink>
            {myProfile && (
              <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                Терминировать сессию
              </button>
            )}
          </div>
        </aside>
        
        <main className="profile-main">
          <section className="stat-card">
            <div className="card-header">
                <Icons.Zap size={20} color="#6366f1" />
                <h3>Текущий опыт (XP)</h3>
            </div>
            <div className="points-val">{userData.totalPoints || 0}</div>
            <div className="progress-container">
                <div className="progress-info">
                    <span>До следующего ранга </span>
                    <span>{Math.round(Math.min((userData.totalPoints / (userData.nextRankPoints || 1) * 100), 100))}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${Math.min((userData.totalPoints / (userData.nextRankPoints || 1)) * 100, 100)}%`}}></div>
                </div>
            </div>
          </section>

          <section className="achievements-section">
            <div className="section-header">
                <div className="title-with-icon">
                    <Icons.Trophy size={22} className="title-icon-gold" />
                    <h3>Достижения агента</h3>
                </div>
                <span className="ach-count">{userData.achievements?.length || 0} получено</span>
            </div>

            <div className="achievements-modern-grid">
                {userData.achievements && userData.achievements.length > 0 ? (
                    userData.achievements.map((ach) => (
                        <div key={ach.id} className="ach-card">
                            {/* Фоновое свечение для атмосферы */}
                            <div className="ach-card-glow" style={{ background: ach.color }}></div>
                            
                            <div className="ach-card-top">
                                <AchievementIcon name={ach.iconName} color={ach.color} />
                                <div className="ach-text-main">
                                    <div className="ach-status-row">
                                        <span className="ach-date">Разблокировано</span>
                                        <span className="ach-dot">•</span>
                                    </div>
                                    <p className="ach-description-simple">{ach.title}</p>
                                </div>
                            </div>

                            {/* Оставляем тултип, если описание слишком длинное, или можно его убрать */}
                            <div className="ach-tooltip">{ach.description}</div>
                        </div>
                    ))
                ) : (
                    <div className="ach-empty-state">
                        <div className="empty-icon-wrap">
                            <Icons.Lock size={32} />
                        </div>
                        <p>Достижения заблокированы. Проходите сценарии социальной инженерии, чтобы получить их.</p>
                    </div>
                )}
            </div>
        </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
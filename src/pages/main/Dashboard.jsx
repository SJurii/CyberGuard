import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Award, Zap, ShieldCheck, Target, Users, LayoutGrid } from 'lucide-react';
import "../main/styles/dashboard.css";
import { useAuth } from  "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

 
  const [displayUser] = useState({
    name: user?.username || "Гость",
    role: user?.role || "USER",
    xp: user?.points || 0,
    totalXp: user?.nextPoints || 0,
    currentRank: user?.rank || "Новичок",
    nextMission: { id: "sql_case_02", title: "SQL Инъекция: Взлом БД" }
  });

  // Эффект скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Расчет прогресса
  const progressPercentage = (displayUser.xp / displayUser.totalXp) * 100;
  const isAdmin = displayUser.role === "ADMIN";

  return (
    <div className="dashboard-page">
      <header className="welcome-header">
        <h1>С возвращением, {displayUser.name}! 🛡️</h1>
        <p>Статус системы: Стабильно. Защита активна.</p>
      </header>

      <main className="container">
        <div className="dashboard-grid">
          
          {/* 1. Карточка рейтинга (XP) */}
          <div className="stat-card">
            <div className="card-header">
              <Award size={20} />
              <h3>Ваш прогресс</h3>
            </div>
            <div className="xp-stat animate-fade">
              <div className="xp-current">{displayUser.xp}</div>
              <div className="xp-total"> / {displayUser.totalXp} XP</div>
            </div>
            <div className="xp-bar-container">
              <div className="xp-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p style={{marginTop: '15px', color: '#94a3b8', textAlign: 'center', fontSize: '13px'}}>
               До ранга "{displayUser.currentRank}" осталось {displayUser.totalXp - displayUser.xp} XP
            </p>
          </div>

          {/* 2. Карточка "Быстрый старт" */}
          <div className="cta-card stat-card">
            <div className="card-header" style={{color: '#a855f7'}}>
              <Target size={20} />
              <h3>Следующая миссия</h3>
            </div>
            <p>Вы остановились на кейсе: <strong>{displayUser.nextMission.title}</strong>.</p>
            <NavLink to={"/map"}>
            <button className="start-btn" onClick={() => navigate(`/scenario/player/${displayUser.nextMission.id}`)}>
              <Zap size={16} inline style={{marginRight: '8px'}}/> Продолжить
            </button>
            </NavLink>
          </div>

          {/* 3. Карточка статистики (например, количество решенных кейсов) */}
          <div className="stat-card">
             <div className="card-header" style={{color: '#10b981'}}>
               <ShieldCheck size={20}/>
               <h3>Статистика защит</h3>
             </div>
             <div className="xp-statanimate-fade">
                 <div className="xp-current" style={{color: '#10b981'}}>12</div>
                 <div className="xp-total"> кейсов решено</div>
             </div>
             <p style={{marginTop: '15px', color: '#94a3b8', fontSize: '13px'}}>Вы отразили 90% виртуальных атак.</p>
          </div>

        </div>

        {/* 4. СЕКЦИЯ ДЛЯ АДМИНА (Видна только тебе) */}
        {isAdmin && (
          <div className="admin-dashboard-section animate-fade">
            <h3>Центр Управления (ADMIN)</h3>
            <p style={{color: '#94a3b8', marginBottom: '20px', fontSize: '14px'}}>
               У вас есть доступ к редактированию контента и управлению пользователями.
            </p>
            <div className="admin-actions">
                <button className="admin-btn" onClick={() => navigate('/admin/users')}>
                  <Users size={16} inline style={{marginRight: '8px'}}/> Управление пользователями
                </button>
                <button className="admin-btn" onClick={() => navigate('/map')}>
                  <LayoutGrid size={16} inline style={{marginRight: '8px'}}/> Редактор карты сценариев
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
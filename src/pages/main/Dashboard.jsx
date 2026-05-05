import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Zap, ShieldCheck, Target, Users, 
  LayoutGrid, User, Map as MapIcon, Trophy 
} from 'lucide-react';
import "../main/styles/dashboard.css";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const xp = user?.points || 0;
  const totalXp = user?.nextPoints || 100;
  const progressPercentage = totalXp > 0 ? (xp / totalXp) * 100 : 0;
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="dashboard-page">
      <header className="welcome-header">
        <div className="header-content">
          <h1>С возвращением, {user?.username || "Гость"}! 🛡️</h1>
          <p>Статус системы: Стабильно. Защита активна.</p>
        </div>
        
        {/* КНОПКИ НАВИГАЦИИ В ШАПКЕ */}
        <div className="header-nav-buttons">
          <button className="nav-action-btn leaderboard-btn" onClick={() => navigate('/profile/leaderboard')}>
            <Trophy size={18} />
            <span>Таблица лидеров</span>
          </button>
          <button className="nav-action-btn profile-btn" onClick={() => navigate('/profile')}>
            <User size={18} />
            <span>Мой Профиль</span>
          </button>
          <button className="nav-action-btn map-btn" onClick={() => navigate('/map')}>
            <MapIcon size={18} />
            <span>Карта Системы</span>
          </button>
        </div>
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
              <div className="xp-current">{xp}</div>
              <div className="xp-total"> / {totalXp} XP</div>
            </div>
            <div className="xp-bar-container">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p style={{marginTop: '15px', color: '#94a3b8', textAlign: 'center', fontSize: '13px'}}>
               До следующего уровня осталось {totalXp - xp} XP
            </p>
          </div>

          {/* 2. Карточка "Быстрый старт" */}
          <div className="cta-card stat-card">
            <div className="card-header" style={{color: '#a855f7'}}>
              <Target size={20} />
              <h3>Следующая миссия</h3>
            </div>
            <p>Вы остановились на кейсе: <strong>SQL Инъекция: Взлом БД</strong>.</p>
            <button 
              className="start-btn" 
              onClick={() => navigate(`/scenario/player/sql_case_02`)}
            >
              <Zap size={16} style={{marginRight: '8px', display: 'inline'}}/> Продолжить
            </button>
          </div>

          {/* 3. Статистика защит */}
          <div className="stat-card">
             <div className="card-header" style={{color: '#10b981'}}>
               <ShieldCheck size={20}/>
               <h3>Статистика защит</h3>
             </div>
             <div className="xp-stat animate-fade">
                 <div className="xp-current" style={{color: '#10b981'}}>12</div>
                 <div className="xp-total"> кейсов решено</div>
             </div>
             <p style={{marginTop: '15px', color: '#94a3b8', fontSize: '13px'}}>
                Вы отразили 90% виртуальных атак.
             </p>
          </div>
        </div>

        {/* 4. СЕКЦИЯ ДЛЯ АДМИНА */}
        {isAdmin && (
          <div className="admin-dashboard-section animate-fade">
            <h3>Центр Управления (ADMIN)</h3>
            <p style={{color: '#94a3b8', marginBottom: '20px', fontSize: '14px'}}>
               У вас есть доступ к редактированию контента и управлению пользователями.
            </p>
            <div className="admin-actions">
                <button className="admin-btn" onClick={() => navigate('/admin/users')}>
                  <Users size={16} style={{marginRight: '8px', display: 'inline'}}/> Управление пользователями
                </button>
                <button className="admin-btn" onClick={() => navigate('/map')}>
                  <LayoutGrid size={16} style={{marginRight: '8px', display: 'inline'}}/> Редактор карты
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
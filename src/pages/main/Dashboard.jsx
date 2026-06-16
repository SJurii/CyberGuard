import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Terminal, BookOpen, 
  LayoutGrid, User, Map as MapIcon, Trophy, Users 
} from 'lucide-react';
import "../main/styles/dashboard.css";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adminOpen, setAdminOpen] = React.useState(false);

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
        
        {/* ГЛАВНАЯ ПАНЕЛЬ: прогресс баллов на всю ширину */}
        <div className="main-progress-hero stat-card">
          <div className="card-header" style={{color: '#6366f1'}}>
            <Award size={24} />
            <h3>Текущий оперативный статус и очки опыта</h3>
          </div>
          <div className="xp-stat-hero">
            <span className="xp-current">{xp}</span>
            <span className="xp-total"> / {totalXp} XP</span>
          </div>
          <div className="xp-bar-container" style={{ height: '12px', marginTop: '25px' }}>
            <div 
              className="xp-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p style={{marginTop: '20px', color: '#94a3b8', fontSize: '14px', fontWeight: '500'}}>
             До верификации следующего квалификационного ранга осталось {totalXp - xp} XP
          </p>
        </div>

        {/* СЕТКА СТАТИЧЕСКОГО ИНФО-КОНТЕНТА */}
        <div className="dashboard-grid">
          
          {/* Статичная инфо-карточка 1 */}
          <div className="stat-card">
            <div className="card-header" style={{color: '#f43f5e'}}>
              <Terminal size={20} />
              <h3>Актуальные киберугрозы</h3>
            </div>
            <ul style={{ paddingLeft: '0', listStyle: 'none', color: '#94a3b8', fontSize: '14px', lineHeight: '2' }}>
              <li>⚠️ <strong style={{color: '#fff'}}>Email:</strong> Потоковые фишинг-атаки на HR сектор.</li>
              <li>⚠️ <strong style={{color: '#fff'}}>SMS:</strong> Маскировка под сервисы доставки отправлений.</li>
              <li>⚠️ <strong style={{color: '#fff'}}>SQL:</strong> Инъекции типа Blind/Time-based в старых СУБД.</li>
            </ul>
          </div>

          {/* Статичная инфо-карточка 2 */}
          <div className="stat-card">
             <div className="card-header" style={{color: '#10b981'}}>
               <BookOpen size={20}/>
               <h3>Памятка киберинженера</h3>
             </div>
             <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                Используйте вкладку <strong>«Карта Системы»</strong> в правом верхнем углу экрана для доступа ко всем доступным симуляциям и интерактивным сценариям тренировки атаки/защиты.
             </p>
          </div>
        </div>

        {/* 4. СЕКЦИЯ ДЛЯ АДМИНА — ОСТАЛАСЬ БЕЗ ИЗМЕНЕНИЙ */}
        {isAdmin && (
          <div className="admin-dashboard-section animate-fade">
            <h3>Центр Управления (ADMIN)</h3>
            <p style={{color: '#94a3b8', marginBottom: '20px', fontSize: '14px'}}>
              У вас есть доступ к редактированию контента и управлению системой.
            </p>

            <button
              className="admin-btn main-admin-btn"
              onClick={() => setAdminOpen(!adminOpen)}
            >
              <LayoutGrid size={16} style={{marginRight: '8px', display: 'inline'}}/>
              Управление
            </button>

            {adminOpen && (
              <div className="admin-actions expanded">
                <button className="admin-btn" onClick={() => navigate('/admin/users')}>
                  <Users size={16} style={{marginRight: '8px', display: 'inline'}}/>
                  Управление пользователями
                </button>

                <button className="admin-btn" onClick={() => navigate('/map', { state: { openEditor: true } })}>
                  <MapIcon size={16} style={{marginRight: '8px', display: 'inline'}}/>
                  Сценарии (редактор)
                </button>

                <button className="admin-btn" onClick={() => navigate('/adminAchievements')}>
                  <Trophy size={16} style={{marginRight: '8px', display: 'inline'}}/>
                  Добавление достижений
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react'; // Добавили useState
import { useNavigate } from 'react-router-dom';
import { User, Mail, Database, Brain, Wifi, LockKeyhole } from 'lucide-react';
import styles from "./styles/map.module.css"; 

const scenarios = [
  { id: 1, title: 'SMS-Фишинг', difficulty: 'Легко', path: '/scenario_sms', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' },
  // ИСПРАВЛЕНО: Путь теперь без /player/ согласно вашему запросу
  { id: 2, title: 'Email-Фишинг', difficulty: 'Легко', path: '/scenario/email', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' }, 
  { id: 3, title: 'SQL Инъекция', difficulty: 'Средне', path: '/non', icon: <Database size={40} strokeWidth={1} />, color: '99, 102, 241', status: 'locked' },
  { id: 4, title: 'Социальная инженерия', difficulty: 'Сложно', path: '/non', icon: <Brain size={40} strokeWidth={1} />, color: '245, 158, 11', status: 'locked' },
  { id: 5, title: 'Взлом Wi-Fi', difficulty: 'Хардкор', path: '/non', icon: <Wifi size={40} strokeWidth={1} />, color: '244, 63, 94', status: 'locked' },
];

const MapPage = () => {
  const navigate = useNavigate(); 
  const [userRole, setUserRole] = useState(null); // Роль теперь в состоянии

  useEffect(() => {
    // ИСПРАВЛЕНО: Безопасное получение роли из объекта userData
    const rawData = localStorage.getItem("userData");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setUserRole(parsed.role);
        console.log("Роль пользователя определена:", parsed.role);
      } catch (e) {
        console.error("Ошибка парсинга данных пользователя:", e);
      }
    }

    // Эффект скролла
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = (path, status) => {
    if (status !== 'locked') {
      console.log("Переход по пути:", path);
      navigate(path);
    }
  };

  return (
    <div className={styles['map-page']}>
     <header className={styles['map-header']}>
        <div className={styles['header-top']}>
          <h1 className={styles['map-title']}>КАРТА КИБЕР-УГРОЗ</h1>
          <div className={styles['header-side']}>
            {/* ОБНОВЛЕННАЯ КНОПКА ПРОФИЛЯ */}
            <button className={styles['profile-nav-btn']} onClick={() => navigate('/profile')}>
              <div className={styles['btn-icon-wrapper']}>
                <User size={14} />
              </div>
              <span>Профиль</span>
            </button>

            {userRole === 'ADMIN' && ( 
              <button className={styles['admin-nav-btn']} onClick={() => navigate('/admin')}>
                <LockKeyhole size={16} />
                <span>Панель управления</span>
              </button>
            )}
          </div>
        </div>
        <p className={styles['map-subtitle']}>Оперативный сектор: выбор миссии </p>
      </header>

      <div className={styles['scenarios-grid']}>
        {scenarios.map((scen) => (
          <div 
            key={scen.id}
            style={{ '--accent-color': scen.status === 'locked' ? '148, 163, 184' : scen.color }}
            className={`${styles['scenario-card']} ${styles[scen.status]}`}
          >
            <div className={styles['card-icon']}>
                {scen.icon}
            </div>
            <div className={styles['card-content']}>
              <h3>{scen.title}</h3>
              <span className={styles['difficulty-tag']}>{scen.difficulty}</span>
            </div>
            
            {scen.status === 'locked' ? (
              <div className={styles['lock-overlay']}>
                <LockKeyhole size={16} /> 
                Заблокировано
              </div>
            ) : (
              <button 
                className={styles['start-btn']} 
                onClick={() => handleStart(scen.path, scen.status)}
              >
                {scen.status === 'completed' ? 'Повторить' : 'Начать миссию'}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className={styles['goHome']}>
        <button className={styles['home-btn']} onClick={() => navigate('/dashboard')}>Вернуться на базу</button>
      </div>
    </div>
  );
};

export default MapPage;
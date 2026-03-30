import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Database, Brain, Wifi, LockKeyhole } from 'lucide-react'; // Импорт иконок
import styles from "./styles/map.module.css"; 

const scenarios = [
  // Цвета в формате RGB: 99, 102, 241
  { id: 1, title: 'SMS-Фишинг', difficulty: 'Легко', path: '/scenario_sms', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' }, // Синий (Информация)
  { id: 2, title: 'Email-Фишинг', difficulty: 'Легко', path: '/scenario/email', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' }, // Синий
  { id: 3, title: 'SQL Инъекция', difficulty: 'Средне', path: '/non', icon: <Database size={40} strokeWidth={1} />, color: '99, 102, 241', status: 'locked' }, // Фиолетовый (Базы)
  { id: 4, title: 'Социальная инженерия', difficulty: 'Сложно', path: '/non', icon: <Brain size={40} strokeWidth={1} />, color: '245, 158, 11', status: 'locked' }, // Оранжевый (Паника/Манипуляция)
  { id: 5, title: 'Взлом Wi-Fi', difficulty: 'Хардкор', path: '/non', icon: <Wifi size={40} strokeWidth={1} />, color: '244, 63, 94', status: 'locked' }, // Красный (Критическое/Сеть)
];

const MapPage = () => {
  const navigate = useNavigate(); 

  // Эффект скролла для фона
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = (path, status) => {
    if (status !== 'locked') {
      navigate(path);
    }
  };

  return (
    <div className={styles['map-page']}>
     <header className={styles['map-header']}>
        <div className={styles['header-top']}>
          <h1 className={styles['map-title']}>КАРТА КИБЕР-УГРОЗ</h1>
          <div className={styles['header-side']}>
            <button className={styles['profile-nav-btn']} onClick={() => navigate('/profile')}>
              <User size={16} />
              Профиль
            </button>
          </div>
        </div>
        <p className={styles['map-subtitle']}>Оперативный сектор: выбор миссии</p>
      </header>

      <div className={styles['scenarios-grid']}>
        {scenarios.map((scen) => (
          <div 
            key={scen.id}
            // Передаем уникальный цвет как инлайн-стиль для CSS переменной
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
        <button className={styles['home-btn']} onClick={() => navigate('/')}>Вернуться на базу</button>
      </div>
    </div>
  );
};

export default MapPage;
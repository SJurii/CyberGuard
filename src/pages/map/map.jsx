import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../scenario_sms"// Не забудь создать этот CSS файл
import styles from "../map/styles/map.module.css"; // И этот для стилей карты";

const scenarios = [
  { id: 1, title: 'SMS-Фишинг', difficulty: 'Легко', path: '/scenario_sms', icon: '📱', color: '#4facfe', status: 'available' },
  { id: 2, title: 'SQL Инъекция', difficulty: 'Средне', path: '/non', icon: '💉', color: '#00f2fe', status: 'locked' },
  { id: 3, title: 'Социальная инженерия', difficulty: 'Сложно', path: '/non', icon: '🎭', color: '#f093fb', status: 'locked' },
  { id: 4, title: 'Взлом Wi-Fi', difficulty: 'Хардкор', path: '/non', icon: '📡', color: '#667eea', status: 'locked' },
];

const MapPage = () => {

  const navigate = useNavigate(); 

  const handleStart = (path, status) => {
    if (status !== 'locked') {
      navigate(path);
    }
    else {
      alert("Этот сценарий пока недоступен. Пройди предыдущие миссии, чтобы разблокировать его!");
    }
  };

  return (

    <div className={styles['map-page']}>
     <header className={styles['map-header']}>
        <div className={styles['header-top']}>
          {/* Левая распорка для баланса */}
          <div className={styles['header-side']}></div> 

          <h1 className={styles['map-title']}>КАРТА КИБЕР-УГРОЗ</h1>

          {/* Правая часть с кнопкой */}
          <div className={styles['header-side']}>
            <button 
              className={styles['profile-nav-btn']} 
              onClick={() => navigate('/profile')}
            >
              <span className={styles['profile-icon']}>👤</span>
              <span className={styles['profile-text']}>Профиль</span>
            </button>
          </div>
        </div>
        <p className={styles['map-subtitle']}>Выбери миссию и начни обучение</p>
      </header>

      <div className={styles['scenarios-grid']}>
        {scenarios.map((scen) => (
          <div 
            key={scen.id}
            className={`${styles['scenario-card']} ${styles[scen.status]}`}
            style={{ '--accent-color': scen.color }}
          >
            <div className={styles['card-icon']}>{scen.icon}</div>
            <div className={styles['card-content']}>
              <h3>{scen.title}</h3>
              <span className={styles['difficulty-tag']}>{scen.difficulty}</span>
            </div>
            
            {scen.status === 'locked' ? (
              <div className={styles['lock-overlay']}>🔒 Заблокировано</div>
            ) : (
              <button 
                className={styles['start-btn']} 
                onClick={() => handleStart(scen.path)}
              >
                {scen.status === 'completed' ? 'Повторить' : 'Начать'}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className={styles['goHome']}>
        <button className={styles['home-btn']} onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    </div>
  );
};

export default MapPage;
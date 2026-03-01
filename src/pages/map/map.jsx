import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../scenario_sms"// Не забудь создать этот CSS файл
import "../map/map.css"; // И этот для стилей карты";

const scenarios = [
  { id: 1, title: 'SMS-Фишинг', difficulty: 'Легко', icon: '📱', color: '#4facfe', status: 'completed' },
  { id: 2, title: 'SQL Инъекция', difficulty: 'Средне', icon: '💉', color: '#00f2fe', status: 'available' },
  { id: 3, title: 'Социальная инженерия', difficulty: 'Сложно', icon: '🎭', color: '#f093fb', status: 'available' },
  { id: 4, title: 'Взлом Wi-Fi', difficulty: 'Хардкор', icon: '📡', color: '#667eea', status: 'locked' },
];

const ScenarioMap = () => {
  const navigate = useNavigate();

  const handleStart = (id) => {
    navigate(`/scenario/${id}`);
  };

  return (
    <div className="map-page">
      <header className="map-header">
        <h1>Карта Кибер-Угроз</h1>
        <p>Выбери миссию и начни обучение</p>
      </header>

      <div className="scenarios-grid">
        {scenarios.map((scen) => (
          <div 
            key={scen.id} 
            className={`scenario-card ${scen.status}`}
            style={{ '--accent-color': scen.color }}
          >
            <div className="card-icon">{scen.icon}</div>
            <div className="card-content">
              <h3>{scen.title}</h3>
              <span className="difficulty-tag">{scen.difficulty}</span>
            </div>
            
            {scen.status === 'locked' ? (
              <div className="lock-overlay">🔒 Заблокировано</div>
            ) : (
              <button className="start-btn" onClick={() => handleStart(scen.id)}>
                {scen.status === 'completed' ? 'Повторить' : 'Начать'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioMap;
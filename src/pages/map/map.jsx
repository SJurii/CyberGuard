import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Database, Brain, Wifi, LockKeyhole, X } from 'lucide-react';
import styles from "./styles/map.module.css"; 

const scenarios = [
  { id: 1, title: 'SMS-Фишинг', difficulty: 'Легко', path: '/scenario_sms', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' },
  { id: 2, title: 'Email-Фишинг', difficulty: 'Легко', path: '/scenario/email', icon: <Mail size={40} strokeWidth={1} />, color: '14, 165, 233', status: 'available' }, 
  { id: 3, title: 'SQL Инъекция', difficulty: 'Средне', path: '/non', icon: <Database size={40} strokeWidth={1} />, color: '99, 102, 241', status: 'locked' },
  { id: 4, title: 'Социальная инженерия', difficulty: 'Сложно', path: '/non', icon: <Brain size={40} strokeWidth={1} />, color: '245, 158, 11', status: 'locked' },
  { id: 5, title: 'Взлом Wi-Fi', difficulty: 'Хардкор', path: '/non', icon: <Wifi size={40} strokeWidth={1} />, color: '244, 63, 94', status: 'locked' },
];

const MapPage = () => {
  const navigate = useNavigate(); 
  const [userRole, setUserRole] = useState(null);
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  
  
  // Состояние для нового сценария под структуру твоей БД
  const [newScenario, setNewScenario] = useState({
    name: '',
    title: '',
    type: 'Email',
    content: { start: "step1", steps: { step1: { from: "", text: "", options: [] } } }
  });

  useEffect(() => {
    const rawData = localStorage.getItem("userData");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setUserRole(parsed.role);
      } catch (e) {
        console.error("Ошибка парсинга данных пользователя:", e);
      }
    }

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Единая функция отправки данных
  const handleCreateScenario = async () => {
    const token = localStorage.getItem("userToken"); // Берем токен для авторизации
    
    try {
      // Формируем объект для отправки (Payload)
      const payload = {
        ...newScenario,
        // Если техническое ID не заполнено, генерируем его из заголовка
        name: newScenario.name || newScenario.title.toLowerCase().replace(/\s+/g, '_'),
        // Превращаем текст из поля контента в реальный JSON-объект
        content: typeof newScenario.content === 'string' 
          ? JSON.parse(newScenario.content) 
          : newScenario.content
      };

      const response = await fetch('http://localhost:8080/api/admin/scenarios', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload) // Отправляем данные в БД
      });
      
      if (response.ok) {
        alert("Операция успешно развернута в системе!");
        setIsAdminEditing(false); // Закрываем модалку
        // Сбрасываем форму
        setNewScenario({
          name: '',
          title: '',
          type: 'Email',
          content: { start: "step1", steps: { step1: { from: "", text: "", options: [] } } }
        });
      } else {
        alert("Ошибка при сохранении. Проверьте права доступа.");
      }
    } catch (err) {
      // Если пользователь ввел кривой JSON, JSON.parse выдаст ошибку здесь
      alert("Ошибка: проверьте корректность формата JSON в поле контента");
      console.error("Ошибка парсинга:", err);
    }
  };

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
            
            {userRole === 'ADMIN' && (
              <button 
                className={styles['toggle-editor-btn']} 
                onClick={() => setIsAdminEditing(true)}
              >
                <LockKeyhole size={14} style={{ marginRight: '8px' }} />
                Новая операция
              </button>
            )}

            <button className={styles['profile-nav-btn']} onClick={() => navigate('/profile')}>
              <div className={styles['btn-icon-wrapper']}>
                <User size={14} />
              </div>
              <span>Профиль</span>
            </button>
          </div>
        </div>
        <p className={styles['map-subtitle']}>Оперативный сектор: выбор миссии </p>
      </header>

      {isAdminEditing && (
        <div className={styles['admin-modal-overlay']}>
          <div className={styles['admin-editor-card']}>
            <div className={styles['modal-header']}>
              <h3>Добавление новой операции</h3>
              <button onClick={() => setIsAdminEditing(false)} className={styles['close-modal-btn']}>
                <X size={20} />
              </button>
            </div>

            <div className={styles['modal-body']}>
              {/* Поля TITLE и NAME в один ряд */}
              <div className={styles['input-grid']}>
                <div className={styles['input-group']}>
                  <label>Публичный заголовок (title)</label>
                  <input 
                    type="text" 
                    placeholder="Задержка посылки..."
                    value={newScenario.title}
                    onChange={(e) => setNewScenario({...newScenario, title: e.target.value})}
                  />
                </div>
                <div className={styles['input-group']}>
                  <label>Техническое ID (name)</label>
                  <input 
                    type="text" 
                    placeholder="delivery_scam"
                    value={newScenario.name}
                    onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles['input-group']}>
                <label>Тип коммуникации (type)</label>
                <select 
                  value={newScenario.type}
                  onChange={(e) => setNewScenario({...newScenario, type: e.target.value})}
                >
                  <option value="Email">Email (Фишинг)</option>
                  <option value="SMS">SMS (Фишинг)</option>
                  <option value="SQL">SQL Инъекция</option>
                  <option value="SOCIAL_ENGINEERING">Социальная инженерия (Общее)</option>
                  <option value="WIFI">Взлом Wi-Fi / Сети</option>
                </select>
              </div>

              <div className={styles['input-group']}>
                <label>Контент сценария (JSON content)</label>
                <textarea 
                  className={styles['json-textarea']}
                  rows="8"
                  placeholder='{"start": "step1", "steps": { ... }}'
                  value={typeof newScenario.content === 'object' 
                    ? JSON.stringify(newScenario.content, null, 2) 
                    : newScenario.content
                  }
                  onChange={(e) => setNewScenario({...newScenario, content: e.target.value})}
                />
              </div>

              <button className={styles['save-scenario-btn']} onClick={handleCreateScenario}>
                Записать в базу данных
              </button>
            </div>
          </div>
        </div>
      )}

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
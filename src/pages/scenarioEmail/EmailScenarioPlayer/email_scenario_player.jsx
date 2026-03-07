import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scenarios, scenarioOrder } from "./scenarios"; // Импортируем твои данные
import "../EmailScenarioPlayer/email_player.css";

const EmailScenarioPlayer = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const scenario = scenarios[id];
  console.log("Загруженный", scenarios); 
  console.log("Загруженный сценарий:", scenario); 
  
  const [currentStepId, setCurrentStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [risk, setRisk] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  // 1. Инициализация при загрузке
  useEffect(() => {
    if (scenario) {
      setCurrentStepId(scenario.start);
      setHistory([]); // Очищаем историю при смене сценария
      setRisk(0);
      setIsEnded(false);
    }
  }, [id, scenario]);

  // 2. Обработка перехода по шагам
  useEffect(() => {
    if (currentStepId && scenario) {
      const step = scenario.steps[currentStepId];
      if (step) {
        setHistory((prev) => [...prev, { ...step, id: currentStepId }]);
        if (step.end) setIsEnded(true);
      }
    }
  }, [currentStepId, scenario]);

  const handleAction = (answer) => {
    setRisk((prev) => prev + (answer.risk || 0));
    setCurrentStepId(answer.next);
  };

  // 3. Логика для кнопки "Следующий кейс"
  const getNextScenarioId = () => {
    const currentIndex = scenarioOrder.indexOf(id);
    if (currentIndex !== -1 && currentIndex < scenarioOrder.length - 1) {
      return scenarioOrder[currentIndex + 1];
    }
    return null;
  };

  const nextId = getNextScenarioId();

  if (!scenario) {
    return (
      <div className="error-screen">
        <h2>Кейс "{id}" не найден</h2>
        <button onClick={() => navigate("/")}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="gmail-layout">
      {/* Шапка Gmail */}
      <header className="gmail-nav">
        <div className="nav-left">
          <div className="menu-icon" onClick={() => navigate("/")}>☰</div>
          <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" alt="Gmail" />
        </div>
        <div className="nav-search">
          <input type="text" placeholder="Поиск в почте" disabled />
        </div>
      </header>

      <div className="gmail-main">
        {/* Боковая панель */}
        <aside className="gmail-sidebar">
          <button className="compose-btn">＋ Написать</button>
          <ul className="sidebar-list">
            <li className="active">📥 Входящие <span className="count">1</span></li>
            <li>⭐ Помеченные</li>
            <li>📨 Отправленные</li>
            <li>📄 Черновики</li>
            <li>🗑️ Корзина</li>
          </ul>
        </aside>

        {/* Тело письма */}
        <section className="email-view">
          <div className="email-toolbar">
            <button onClick={() => navigate("/scenario/email")} title="Назад">←</button>
            <button title="Архив">📥</button>
            <button title="Спам">⚠️</button>
            <button title="Удалить">🗑️</button>
          </div>

          <div className="email-container-scroll">
            <h1 className="email-subject">{scenario.subject || "Без темы"}</h1>
            
            <div className="email-thread">
              {history.map((step, index) => (
                <div 
                  key={index} 
                  className={`email-card-animation ${step.from === 'System' ? 'system-note' : 'email-message'}`}
                >
                  {step.from !== 'System' && (
                    <div className="email-meta">
                      <div className="sender-avatar">{step.from[0]}</div>
                      <div className="sender-info">
                        <div className="sender-row">
                          <span className="sender-name">{step.from}</span>
                          <span className="email-time">10:45 (2 мин. назад)</span>
                        </div>
                        <div className="recipient-row">кому: мне ▾</div>
                      </div>
                    </div>
                  )}

                  <div className="email-body-text">
                    {step.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  {/* Кнопки ответов (только для последнего сообщения в истории) */}
                  {!isEnded && index === history.length - 1 && step.answers && (
                    <div className="email-interactive-actions">
                      {step.answers.map((ans, i) => (
                        <button 
                          key={i} 
                          className={ans.text.length > 20 ? "long-action-link" : "gmail-standard-btn"}
                          onClick={() => handleAction(ans)}
                        >
                          {ans.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Финальный экран внутри прокрутки */}
            {isEnded && (
              <div className="final-report-card">
                <div className="report-header">
                  <span className={`status-pill ${risk > 40 ? 'danger' : 'success'}`}>
                    {risk > 40 ? 'Угроза' : 'Безопасно'}
                  </span>
                </div>
                <h2>{risk > 40 ? 'Аккаунт скомпрометирован!' : 'Вы успешно отразили атаку!'}</h2>
                <p>Ваши действия привели к уровню риска: <strong>{risk}%</strong></p>
                
                <div className="final-actions">
                  <button className="retry-btn" onClick={() => window.location.reload()}>
                    🔄 Переиграть
                  </button>
                  
                  {nextId ? (
                    <button className="next-btn" onClick={() => navigate(`/scenario/email/player/${nextId}`)}>
                      ⏩ Следующий кейс
                    </button>
                  ) : (
                    <button className="exit-btn" onClick={() => navigate("/scenario/email")}>
                      🏠 В меню
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Плашка уровня опасности */}
      <div className={`risk-meter-fixed ${risk > 40 ? 'high-risk' : ''}`}>
        <div className="risk-text">
          <span>Уровень опасности:</span>
          <strong>{risk}%</strong>
        </div>
        <div className="meter-bg">
          <div 
            className="meter-fill" 
            style={{ 
              width: `${Math.min(risk, 100)}%`,
              background: risk > 60 ? '#ea4335' : (risk > 30 ? '#fbbc05' : '#34a853')
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EmailScenarioPlayer;
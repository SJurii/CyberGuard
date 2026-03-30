import React, { useState, useEffect } from "react";
import "../styles/style_sms.css";
import { NavLink } from "react-router-dom";
import { AlertTriangle, ShieldCheck, Zap } from "lucide-react"; // Если используешь lucide-react

const ScenarioSMS = () => {
  const [activeHint, setActiveHint] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // Эффект скролла для фона
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hints = [
    { id: 'sender', title: 'ОТПРАВИТЕЛЬ', text: 'Имя "Bank_Official" подделано. Настоящие банки используют защищенные альфа-имена или короткие номера, которые нельзя просто так купить.' },
    { id: 'urgency', title: 'МАНИПУЛЯЦИЯ', text: 'Слова "Срочно" и "заблокирована" — классика социальной инженерии. Вас заставляют действовать на эмоциях, отключая логику.' },
    { id: 'link', title: 'ФИШИНГ', text: 'Сокращенные ссылки (bit.ly) — главный признак кражи данных. Банк всегда пришлет ссылку на свой официальный домен.' }
  ];

  return (
    <div className="sms_page">
      <header className="header">
        <h1 className="header_text">АНАЛИЗ УГРОЗЫ: CASE_01</h1>
      </header>

      <main className="content-wrapper">
        <section className="simulation-container">
          <div className="phone-wrapper">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="status-bar">
                  <span>12:40</span>
                  <span>LTE 🔋</span>
                </div>
                
                <div className="sms-bubble">
                  <span className={`target ${activeHint === 'sender' ? 'active' : ''}`} onMouseEnter={() => setActiveHint('sender')}>
                    <p className="sender">Bank Official</p>
                  </span>
                  <p className="message">
                    <span className={`target ${activeHint === 'urgency' ? 'active' : ''}`} onMouseEnter={() => setActiveHint('urgency')}>
                      Ваша карта заблокирована! Срочно
                    </span> подтвердите личность по ссылке: 
                    <span className="fake-link" onClick={() => setShowWarning(true)} onMouseEnter={() => setActiveHint('link')}>
                       bit.ly/secur-e-check-342
                    </span>
                  </p>
                </div>

                {showWarning && (
                  <div className="warning-overlay">
                    <AlertTriangle size={48} style={{margin: '0 auto 15px'}} />
                    <h3>СИСТЕМА ВЗЛОМАНА</h3>
                    <p>Вы только что передали свои данные мошенникам.</p>
                    <button className="btn_back" onClick={() => setShowWarning(false)}>Вернуться к анализу</button>
                  </div>
                )}
              </div>
            </div>
            <p className="instruction">Наведите на подсвеченные зоны для анализа тактики</p>
          </div>

          <div className="analysis-board">
            <h2>Протокол разбора</h2>
            <div className="hint-display">
              {activeHint ? (
                <div className="hint-content animate-fade">
                  <p className="hint-text">
                    <strong>{hints.find(h => h.id === activeHint).title}: </strong>
                    {hints.find(h => h.id === activeHint).text}
                  </p>
                </div>
              ) : (
                <p className="hint-placeholder">Ожидание выбора цели на мониторе смартфона...</p>
              )}
            </div>
            <div className="quick-facts">
              <div className="fact">
                <Zap size={16} color="var(--secondary)" />
                <span><strong>90%</strong> атак используют эффект срочности.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="learning-blocks">
          <div className="learn-card">
            <h3>Механика Смишинга</h3>
            <p>Злоумышленники используют SMS, чтобы обойти спам-фильтры почты. Это создает иллюзию персонального и важного сообщения прямо в вашем телефоне.</p>
          </div>
          <div className="learn-card danger">
            <h3>Протокол защиты:</h3>
            <ul>
              <li>Не открывайте ссылки из подозрительных SMS.</li>
              <li>Проверяйте статус карты только в официальном приложении.</li>
              <li>Игнорируйте угрозы блокировки — банк позвонит сам или пришлет пуш.</li>
            </ul>
          </div>
        </section>

        <section className="final-action">
          <div className="ready-card">
            <h2>ГОТОВЫ К ПОЛЕВОМУ ТЕСТУ?</h2>
            <p>Проверьте свою бдительность в симуляции реального времени. Одна ошибка — и ваш виртуальный счет будет обнулен.</p>
            
            <div className="stats-mini">
              <span><ShieldCheck size={18} inline /> 5 Уровней</span>
              <span>🔥 +50 XP за успех</span>
            </div>

            <div className="btn-group">
              <NavLink className="start-btn-premium" to="/scenario/sms/interesting_sc">
                ЗАПУСТИТЬ ТРЕНАЖЕР
              </NavLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScenarioSMS;
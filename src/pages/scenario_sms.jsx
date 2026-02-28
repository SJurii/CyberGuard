import React, { useState } from "react";
import "../styles/style_sms.css";
import { NavLink } from "react-router-dom";

const ScenarioSMS = () => {
  const [activeHint, setActiveHint] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const hints = [
    { id: 'sender', text: '🚩 Имя "Bank_Official" выглядит официально, но банки часто используют короткие номера или уникальные буквенные имена. Мошенники подделывают их через сервисы рассылок.' },
    { id: 'urgency', text: '🚩 Слова "Срочно" и "заблокирована" создают панику. Это психологический триггер — социальная инженерия.' },
    { id: 'link', text: '🚩 Ссылка bit.ly скрывает реальный адрес. Настоящие банки никогда не используют сокращатели ссылок для входа в кабинет.' }
  ];

  return (
    <div className="sms_page">
      <header className="header">
        <h1 className="header_text">Кейс #1: Тревожное сообщение</h1>
      </header>

      <main className="content-wrapper">
        <section className="simulation-container">
          {/* Левая часть: Макет телефона */}
          <div className="phone-wrapper">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="status-bar">12:40 📶 🔋</div>
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
                    <p><strong>Ловушка!</strong></p>
                    <p>Вы перешли по фишинговой ссылке. В реальной жизни это могло стоить вам всех средств на карте.</p>
                    <button className="btn_back" onClick={() => setShowWarning(false)}>Вернуться и изучить</button>
                  </div>
                )}
              </div>
            </div>
            <p className="instruction">Наведи на подсвеченные части текста в телефоне</p>
          </div>

          {/* Правая часть: Динамическая информация */}
          <div className="analysis-board">
            <h2>Анализ угрозы</h2>
            <div className="hint-display">
              {activeHint ? (
                <p className="hint-text animate-fade">{hints.find(h => h.id === activeHint).text}</p>
              ) : (
                <p className="hint-placeholder">Наведи на элементы сообщения слева, чтобы разобрать тактику мошенников.</p>
              )}
            </div>
            <div className="quick-facts">
              <div className="fact">
                <strong>90%</strong> атак начинаются с поддельного чувства срочности.
              </div>
            </div>
          </div>
        </section>

        {/* Секция 3: Подробная информация (вместо скучного текста) */}
        <section className="learning-blocks">
          <div className="learn-card">
            <h3>Как работает Смишинг?</h3>
            <p>SMS-фишинг (Смишинг) — это отправка сообщений от имени доверенных лиц. Цель: заманить вас на сайт-двойник, который выглядит в точности как ваш банк.</p>
          </div>
          <div className="learn-card danger">
            <h3>Чего нельзя делать:</h3>
            <ul>
              <li>Переходить по ссылкам "подтверждения данных".</li>
              <li>Вводить ПИН-код или CVV на сайтах из SMS.</li>
              <li>Перезванивать по номеру из этого же сообщения.</li>
            </ul>
          </div>
        </section>

        <section className="final-action">
          <div className="ready-card">
            <div className="card-icon-wrap">
              <div className="pulse-ring"></div>
              <span className="icon-main">🎯</span>
            </div>
            
            <div className="card-content">
              <h2>Проверим ваши навыки?</h2>
              <p>
                Теория — это хорошо, но в кибербезопасности решает практика. 
                Сможете ли вы распознать обман, когда на кону стоят <strong>ваши деньги</strong>?
              </p>
              
              <div className="stats-mini">
                <span>⏱ 5 минут</span>
                <span>🔥 5 реальных кейсов</span>
              </div>

              <div className="btn-group">
                <NavLink className="start-btn-premium" to="/scenario/sms/interesting_sc">
                  Запустить тренажер
                </NavLink>
                <NavLink className="secondary-btn-flat" to="/">
                  На главную
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScenarioSMS;
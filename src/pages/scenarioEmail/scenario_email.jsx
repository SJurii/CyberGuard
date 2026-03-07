import React, { useState } from "react";
import "../scenarioEmail/style_email.css"; 
import { NavLink } from "react-router-dom";

const ScenarioEmail = () => {
  const [activeHint, setActiveHint] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const hints = [
    { 
      id: 'sender', 
      text: '🚩 Внимательно посмотрите на домен: "rnicrosoft.com". Мошенники заменили "m" на "rn". В обычном шрифте это почти незаметно, но ведет на совершенно другой сайт.' 
    },
    { 
      id: 'security_tag', 
      text: '🚩 Теги вроде [URGENT] или [SECURITY ALERT] в теме письма заставляют вас действовать быстро, не включая критическое мышление.' 
    },
    { 
      id: 'button', 
      text: '🚩 Кнопки в письмах — главная ловушка. Если навести на нее (но не кликать), в углу браузера часто виден реальный адрес, который может быть типа "login-fake-site.net".' 
    }
  ];

  return (
    <div className="email_page">
      <header className="header">
        <h1 className="header_text">Кейс #2: Визуальный двойник (Email)</h1>
      </header>

      <main className="content-wrapper">
        <section className="simulation-container">
          {/* Левая часть: Макет Gmail */}
          <div className="gmail-wrapper">
            <div className="gmail-mockup">
              <div className="gmail-sidebar">
                <div className="compose-btn">＋ Написать</div>
                <ul className="folders">
                  <li className="active">📥 Входящие</li>
                  <li>⭐ Помеченные</li>
                  <li>📨 Отправленные</li>
                  <li>🗑 Корзина</li>
                </ul>
              </div>
              
              <div className="gmail-content">
                <div className="gmail-toolbar">
                  <span>←</span> <span>🗑</span> <span>📩</span> <span>⋮</span>
                </div>
                
                <div className="email-header-info">
                  <h2 className={`target ${activeHint === 'security_tag' ? 'active' : ''}`} 
                      onMouseEnter={() => setActiveHint('security_tag')}>
                    [SECURITY ALERT] Unusual sign-in activity
                  </h2>
                  <div className="sender-line">
                    <div className="avatar">M</div>
                    <div className="sender-details">
                      <span className={`target ${activeHint === 'sender' ? 'active' : ''}`} 
                            onMouseEnter={() => setActiveHint('sender')}>
                        <strong>Microsoft Security Team</strong> &lt;account-security@rnicrosoft.com&gt;
                      </span>
                      <p className="to-me">кому: мне ▾</p>
                    </div>
                  </div>
                </div>

                <div className="email-body">
                  <p>Уважаемый пользователь,</p>
                  <p>Мы зафиксировали подозрительный вход в ваш аккаунт Microsoft из нового местоположения:</p>
                  <div className="info-box">
                    <p><strong>Страна:</strong> Нигерия (Lagos)</p>
                    <p><strong>IP:</strong> 102.129.145.1</p>
                  </div>
                  <p>Если это были не вы, пожалуйста, подтвердите владение аккаунтом, чтобы предотвратить блокировку.</p>
                  
                  <button className={`gmail-action-btn target ${activeHint === 'button' ? 'active' : ''}`}
                          onMouseEnter={() => setActiveHint('button')}
                          onClick={() => setShowWarning(true)}>
                    Secure My Account
                  </button>
                  
                  <p className="footer-text">С уважением,<br/>Microsoft Account Security</p>
                </div>

                {showWarning && (
                  <div className="warning-overlay-email">
                    <div className="warning-content">
                      <h3>⚠️ Данные под угрозой!</h3>
                      <p>Вы нажали на кнопку, которая ведет на <strong>фишинговый сайт-клон</strong>.</p>
                      <p>Обратите внимание на адрес отправителя: <strong>rn</strong>icrosoft (r + n) вместо <strong>m</strong>icrosoft.</p>
                      <button className="btn_back" onClick={() => setShowWarning(false)}>Вернуться к анализу</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="instruction">Наведи на элементы письма, чтобы найти ловушки</p>
          </div>

          {/* Правая часть: Анализ */}
          <div className="analysis-board">
            <h2>Анализ Email-угрозы</h2>
            <div className="hint-display">
              {activeHint ? (
                <p className="hint-text animate-fade">{hints.find(h => h.id === activeHint).text}</p>
              ) : (
                <p className="hint-placeholder">Исследуйте детали письма слева. Особое внимание уделите адресу отправителя и доменам.</p>
              )}
            </div>
            <div className="quick-facts">
              <div className="fact">
                <strong>Homograph Attack</strong> — тактика использования похожих символов (например, кириллическая "о" вместо латинской "o").
              </div>
            </div>
          </div>
        </section>

        {/* Секция 3: Обучение */}
        <section className="learning-blocks">
          <div className="learn-card">
            <h3>Проверка домена</h3>
            <p>Всегда нажимайте на имя отправителя в Gmail, чтобы увидеть полный адрес после символа @. Мошенники часто называют аккаунт "Google Support", но адрес при этом может быть "support@xyz-123.net".</p>
          </div>
          <div className="learn-card danger">
            <h3>Золотые правила почты:</h3>
            <ul>
              <li>Не вводите пароль на страницах, открытых по ссылкам из писем.</li>
              <li>Если письмо пугает блокировкой — зайдите на официальный сайт вручную через браузер.</li>
              <li>Проверяйте "хвост" ссылки перед кликом.</li>
            </ul>
          </div>
        </section>

        <section className="final-action">
          <div className="ready-card email-theme">
             <div className="card-content">
              <h2>Готовы к тренажеру?</h2>
              <p>Мы подготовили для вас сценарии с Gmail, Outlook и корпоративной почтой. Проверьте свою зоркость!</p>
              <div className="btn-group">
                <NavLink className="start-btn-premium" to="/scenario/email/player/lottery_scam">
                  Начать проверку
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScenarioEmail;
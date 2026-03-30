import React, { useState, useEffect } from "react";
import "../scenarioEmail/style_email.css"; 
import { NavLink } from "react-router-dom";
import { Mail, ShieldAlert, Fingerprint, MousePointer2 } from "lucide-react";

const ScenarioEmail = () => {
  const [activeHint, setActiveHint] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hints = [
    { 
      id: 'sender', 
      title: 'ГОМОГРАФ-АТАКА',
      text: 'Внимательно посмотрите на домен: "rnicrosoft.com". Мошенники заменили "m" на "rn". В обычном шрифте это почти незаметно.' 
    },
    { 
      id: 'security_tag', 
      title: 'МАНИПУЛЯЦИЯ',
      text: 'Теги вроде [SECURITY ALERT] создают ложное чувство тревоги, заставляя пользователя совершать ошибки под давлением.' 
    },
    { 
      id: 'button', 
      title: 'ТОЧКА ВЗЛОМА',
      text: 'Кнопки — это "пусковые крючки". Всегда наводите курсор без клика, чтобы увидеть реальный URL в углу экрана.' 
    }
  ];

  return (
    <div className="email_page">
      <header className="header">
        <h1 className="header_text">CASE_02: ЦИФРОВОЙ КЛОН</h1>
      </header>

      <main className="content-wrapper">
        <section className="simulation-container" style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', background: 'rgba(255,255,255,0.02)', padding: '50px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)'}}>
          
          <div className="gmail-wrapper">
            <div className="gmail-mockup">
              <div className="gmail-sidebar">
                <div className="compose-btn">＋ COMPOSE</div>
                <ul className="folders">
                  <li className="active">📥 Inbox</li>
                  <li>⭐ Starred</li>
                  <li>📨 Sent</li>
                  <li>🗑 Trash</li>
                </ul>
              </div>
              
              <div className="gmail-content">
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
                        <strong>Microsoft Security Team</strong> <span style={{opacity: 0.6}}>&lt;account-security@rnicrosoft.com&gt;</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="email-body">
                  <p>System detected a suspicious login attempt from an unrecognized location:</p>
                  <div className="info-box">
                    <p><strong>LOCATION:</strong> Lagos, Nigeria</p>
                    <p><strong>IP_ADDR:</strong> 102.129.145.1</p>
                    <p><strong>DEVICE:</strong> Linux/X11</p>
                  </div>
                  <p>If this was not you, please verify your identity to secure your account.</p>
                  
                  <button className={`gmail-action-btn target ${activeHint === 'button' ? 'active' : ''}`}
                          onMouseEnter={() => setActiveHint('button')}
                          onClick={() => setShowWarning(true)}>
                    SECURE ACCOUNT
                  </button>
                </div>

                {showWarning && (
                  <div className="warning-overlay-email">
                    <div className="warning-content">
                      <ShieldAlert size={48} color="#f43f5e" style={{marginBottom: '20px'}} />
                      <h3>SESSION COMPROMISED</h3>
                      <p>Вы перешли по фишинговой ссылке. Теперь у хакеров есть доступ к вашему токену авторизации.</p>
                      <button className="btn_back" style={{background: '#f43f5e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', marginTop: '15px'}} onClick={() => setShowWarning(false)}>Вернуться</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="analysis-board">
            <h2>Протокол анализа</h2>
            <div className="hint-display" style={{background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '20px', minHeight: '200px', border: '1px solid rgba(255,255,255,0.05)'}}>
              {activeHint ? (
                <div className="animate-fade">
                  <h4 style={{color: 'var(--secondary)', marginBottom: '10px'}}>{hints.find(h => h.id === activeHint).title}</h4>
                  <p className="hint-text">{hints.find(h => h.id === activeHint).text}</p>
                </div>
              ) : (
                <p style={{opacity: 0.5}}>Наведите на элементы интерфейса слева для расшифровки угроз...</p>
              )}
            </div>
            <div className="quick-facts" style={{marginTop: '30px'}}>
               <div className="fact" style={{display:'flex', gap: '10px', fontSize: '14px', color: '#94a3b8'}}>
                  <Fingerprint size={18} color="var(--secondary)" />
                  <span><strong>92%</strong> фишинговых атак используют подмену символов.</span>
               </div>
            </div>
          </div>
        </section>

        <section className="learning-blocks">
          <div className="learn-card">
            <h3>DNS & Домены</h3>
            <p>Мошенники регистрируют домены, которые визуально похожи на оригинал. Например: <strong>googIe.com</strong> (с большой 'I') вместо <strong>google.com</strong>.</p>
          </div>
          <div className="learn-card danger">
            <h3>Чек-лист безопасности:</h3>
            <ul>
              <li>Проверяйте "Reply-to" адрес в заголовках.</li>
              <li>Не открывайте вложения .zip или .html от незнакомцев.</li>
              <li>Используйте 2FA (двухфакторную аутентификацию).</li>
            </ul>
          </div>
        </section>

        <section className="final-action" style={{textAlign: 'center', marginTop: '40px'}}>
            <NavLink className="start-btn-premium" style={{padding: '20px 60px', textDecoration: 'none', fontSize: '20px'}} to="/scenario/email/player/lottery_scam">
              НАЧАТЬ МИССИЮ
            </NavLink>
        </section>
      </main>
    </div>
  );
};

export default ScenarioEmail;
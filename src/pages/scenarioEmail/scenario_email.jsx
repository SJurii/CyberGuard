import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { 
  Mail, ShieldAlert, Fingerprint, MousePointer2, 
  LayoutGrid, User, Home, ArrowLeft, Info, AlertTriangle 
} from "lucide-react";
import "../scenarioEmail/style_email.css"; 

const ScenarioEmail = () => {
  const navigate = useNavigate();
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
      {/* ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <header className="header">
        <div className="header_left">
           <h1 className="header_text">CASE_02: ЦИФРОВОЙ КЛОН</h1>
        </div>
        
        <nav className="header_nav">
          <button className="nav_glass_btn" onClick={() => navigate('/dashboard')}>
            <Home size={18} />
            <span>Главная</span>
          </button>
          <button className="nav_glass_btn" onClick={() => navigate('/map')}>
            <LayoutGrid size={18} />
            <span>Карта</span>
          </button>
          <button className="nav_glass_btn" onClick={() => navigate('/profile')}>
            <User size={18} />
            <span>Профиль</span>
          </button>
        </nav>
      </header>

      <main className="content-wrapper">
        <section className="simulation-container">
          
          {/* МОКАП GMAIL */}
          <div className="gmail-wrapper">
            <div className="gmail-mockup">
              <aside className="gmail-sidebar">
                <button className="compose-btn" onClick={() => navigate('/map')}>
                  <ArrowLeft size={16} />
                  К КАРТЕ
                </button>
                <ul className="folders">
                  <li className="active"><Mail size={16} /> Inbox</li>
                  <li><Info size={16} /> Starred</li>
                  <li><MousePointer2 size={16} /> Sent</li>
                  <li><ShieldAlert size={16} /> Trash</li>
                </ul>
              </aside>
              
              <div className="gmail-content">
                <div className="email-header-info">
                  <h2 
                    className={`target ${activeHint === 'security_tag' ? 'active' : ''}`} 
                    onMouseEnter={() => setActiveHint('security_tag')}
                  >
                    [SECURITY ALERT] Unusual sign-in activity
                  </h2>
                  <div className="sender-line">
                    <div className="avatar">M</div>
                    <div className="sender-details">
                      <span 
                        className={`target ${activeHint === 'sender' ? 'active' : ''}`} 
                        onMouseEnter={() => setActiveHint('sender')}
                      >
                        <strong>Microsoft Security Team</strong> 
                        <span className="sender-email">&lt;account-security@rnicrosoft.com&gt;</span>
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
                  
                  <button 
                    className={`gmail-action-btn target ${activeHint === 'button' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveHint('button')}
                    onClick={() => setShowWarning(true)}
                  >
                    SECURE ACCOUNT
                  </button>
                </div>

                {/* ПРЕДУПРЕЖДЕНИЕ ПРИ КЛИКЕ */}
                {showWarning && (
                  <div className="warning-overlay-email">
                    <div className="warning-content">
                      <AlertTriangle size={48} color="#f43f5e" />
                      <h3>SESSION COMPROMISED</h3>
                      <p>Вы перешли по фишинговой ссылке. Теперь у злоумышленников есть доступ к вашему токену авторизации.</p>
                      <button className="btn_back" onClick={() => setShowWarning(false)}>
                        Вернуться к анализу
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ПАНЕЛЬ АНАЛИЗА */}
          <aside className="analysis-board">
            <h2>Протокол анализа</h2>
            <div className="hint-display">
              {activeHint ? (
                <div className="animate-fade">
                  <h4 className="hint-title">{hints.find(h => h.id === activeHint).title}</h4>
                  <p className="hint-text">{hints.find(h => h.id === activeHint).text}</p>
                </div>
              ) : (
                <div className="hint-placeholder">
                  <MousePointer2 size={32} />
                  <p>Наведите на элементы интерфейса слева для расшифровки угроз...</p>
                </div>
              )}
            </div>
            
            <div className="quick-facts">
               <div className="fact">
                  <Fingerprint size={18} />
                  <span><strong>92%</strong> атак социальной инженерии используют визуальное сходство доменов.</span>
               </div>
            </div>
          </aside>
        </section>

        {/* БЛОКИ ОБУЧЕНИЯ */}
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

        {/* ФИНАЛЬНОЕ ДЕЙСТВИЕ */}
        <section className="final-action">
            <NavLink className="start-btn-premium" to="/scenario/email/lottery_scam">
              НАЧАТЬ МИССИЮ
            </NavLink>
        </section>
      </main>
    </div>
  );
};

export default ScenarioEmail;
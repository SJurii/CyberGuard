import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { 
  Database, ShieldAlert, Fingerprint, MousePointer2, 
  LayoutGrid, User, Home, ArrowLeft, HelpCircle, AlertTriangle, Terminal, KeyRound
} from "lucide-react";
import "../scenarioSQL/infoSQL.css"; 

const ScenarioSql = () => {
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
      id: 'sql_input', 
      title: 'ВРЕДОНОСНЫЙ КОД Вместо Логина',
      text: 'Вместо обычного имени хакер ввёл спецсимволы: admin\' OR \'1\'=\'1. Одинарная кавычка ломает внутренний запрос к базе данных, заставляя её путать текст с командами.' 
    },
    { 
      id: 'sql_logic', 
      title: 'ОБХОД АВТОРИЗАЦИИ (OR 1=1)',
      text: 'Команда "OR 1=1" в математической логике всегда верна (ИСТИНА). База данных думает: "Пароль неверный, НО 1 ведь равно 1? Значит, пускаю!". Хакер заходит в систему без пароля.' 
    },
    { 
      id: 'user_risk', 
      title: 'РИСК ДЛЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ',
      text: 'Если сайт уязвим к SQL-инъекциям, злоумышленники могут скачать ВСЮ базу данных пользователей. Ваши логины, хэши паролей и телефоны окажутся в даркнете.' 
    }
  ];

  return (
    <div className="email_page">
      {/* ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <header className="header">
        <div className="header_left">
           <h1 className="header_text">CASE_03: ПОДМЕНА КОМАНД (SQLi)</h1>
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
          
          {/* МОКАП УЯЗВИМОГО САЙТА (ВМЕСТО GMAIL) */}
          <div className="gmail-wrapper">
            <div className="gmail-mockup" style={{ borderColor: '#3b82f6' }}>
              <aside className="gmail-sidebar" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                <button className="compose-btn" onClick={() => navigate('/map')}>
                  <ArrowLeft size={16} />
                  К КАРТЕ
                </button>
                <ul className="folders">
                  <li className="active"><Terminal size={16} /> Вход в систему</li>
                  <li><Database size={16} /> База данных</li>
                  <li><KeyRound size={16} /> Утечки данных</li>
                </ul>
              </aside>
              
              <div className="gmail-content" style={{ padding: '30px' }}>
                <div className="email-header-info">
                  <h2 
                    className={`target ${activeHint === 'user_risk' ? 'active' : ''}`} 
                    onMouseEnter={() => setActiveHint('user_risk')}
                  >
                    Вход в Личный Кабинет «Городской Онлайн-Магазин»
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>
                    Демонстрация атаки методом внедрения SQL-кода.
                  </p>
                </div>

                {/* ФОРМА АВТОРИЗАЦИИ, КОТОРУЮ «ВЗЛАМЫВАЮТ» */}
                <div className="email-body" style={{ maxWidth: '400px', margin: '20px 0' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#94a3b8' }}>Логин (Телефон или Email):</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="admin' OR '1'='1" 
                      className={`target ${activeHint === 'sql_input' ? 'active' : ''}`}
                      onMouseEnter={() => setActiveHint('sql_input')}
                      style={{ 
                        width: '100%', padding: '10px', borderRadius: '6px', 
                        background: '#0f172a', border: '1px solid #334155', color: '#f43f5e',
                        fontFamily: 'monospace', fontSize: '15px', fontWeight: 'bold'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#94a3b8' }}>Пароль:</label>
                    <input 
                      type="password" 
                      readOnly 
                      value="ЗАПОЛНЯТЬ НЕ ОБЯЗАТЕЛЬНО" 
                      className={`target ${activeHint === 'sql_logic' ? 'active' : ''}`}
                      onMouseEnter={() => setActiveHint('sql_logic')}
                      style={{ 
                        width: '100%', padding: '10px', borderRadius: '6px', 
                        background: '#0f172a', border: '1px solid #334155', color: '#64748b',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                  
                  <button 
                    className="gmail-action-btn"
                    style={{ background: '#3b82f6', width: '100%', textAlign: 'center', justifyContent: 'center' }}
                    onClick={() => setShowWarning(true)}
                  >
                    ВЫПОЛНИТЬ ВХОД ХАКЕРА
                  </button>
                </div>

                {/* ПРЕДУПРЕЖДЕНИЕ ПРИ КЛИКЕ */}
                {showWarning && (
                  <div className="warning-overlay-email">
                    <div className="warning-content">
                      <AlertTriangle size={48} color="#f43f5e" />
                      <h3>БАЗА ДАННЫХ ВЗЛОМАНА</h3>
                      <p>Из-за отсутствия проверки данных на сервере, хакер обошел авторизацию под учётной записью Администратора (admin) и скачал данные всех пользователей сайта.</p>
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
            <h2>Протокол анализа SQLi</h2>
            <div className="hint-display">
              {activeHint ? (
                <div className="animate-fade">
                  <h4 className="hint-title">{hints.find(h => h.id === activeHint).title}</h4>
                  <p className="hint-text">{hints.find(h => h.id === activeHint).text}</p>
                </div>
              ) : (
                <div className="hint-placeholder">
                  <MousePointer2 size={32} />
                  <p>Наведите на элементы формы авторизации слева, чтобы понять, как работает SQL-инъекция...</p>
                </div>
              )}
            </div>
            
            <div className="quick-facts">
               <div className="fact">
                  <Fingerprint size={18} />
                  <span><strong>До 30%</strong> всех утечек паролей и личных данных из интернет-магазинов происходят из-за уязвимости SQL-инъекции.</span>
               </div>
            </div>
          </aside>
        </section>

        {/* БЛОКИ ОБУЧЕНИЯ ДЛЯ ОБЫЧНЫХ ЛЮДЕЙ */}
        <section className="learning-blocks">
          <div className="learn-card">
            <h3>Объяснение «На Пальцах»</h3>
            <p>Представьте, что вы дали кассиру записку: <em>«Выдайте паспорт Иванова... <strong>А ТАКЖЕ покажите мне данные всех остальных клиентов</strong>»</em>. Если кассир (робот-база данных) слепо выполняет приказ, не проверяя подвоха — это и есть SQL-инъекция. Хакер просто «дописывает» свои команды в форму на сайте.</p>
          </div>
          <div className="learn-card danger">
            <h3>Как защитить себя (если вы не программист):</h3>
            <ul>
              <li><strong>Уникальные пароли:</strong> Если базу сайта взломают через SQLi, ваш пароль сольют. Главное — чтобы он не совпадал с паролем от вашей основной почты или банка.</li>
              <li><strong>Проверяйте утечки:</strong> Периодически проверяйте свой email на специализированных сервисах мониторинга утечек.</li>
              <li><strong>Игнорируйте шантаж:</strong> Если мошенники прислали вам ваш старый пароль и требуют выкуп, это результат подобного слива базы. Просто смените пароль на сайтах.</li>
            </ul>
          </div>
        </section>

        {/* ФИНАЛЬНОЕ ДЕЙСТВИЕ */}
        <section className="final-action">
            <NavLink className="start-btn-premium" to="/scenarioSQL/playerSQL/sql_test">
              НАЧАТЬ ТЕСТИРОВАНИЕ
            </NavLink>
        </section>
      </main>
    </div>
  );
};

export default ScenarioSql;
import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { 
  ShieldAlert, MousePointer2, LayoutGrid, User, Home, ArrowLeft, 
  AlertTriangle, Users, MessageSquare, Clock, Zap, Building2, BellRing
} from "lucide-react";
import "../scenarioSocial/infoSocial.css"; 

const ScenarioSocial = () => {
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
      id: 'soc_authority', 
      title: 'МАНИПУЛЯЦИЯ: Давление Авторитетом',
      text: 'Мошенник представляется Генеральным директором (CEO) или главным сисадмином. В состоянии стресса перед начальством человек теряет бдительность и готов выполнить любое требование без проверки.' 
    },
    { 
      id: 'soc_urgency', 
      title: 'КРИТИЧЕСКАЯ СРОЧНОСТЬ (Фактор Времени)',
      text: 'Фразы "СРОЧНО", "до конца часа", "иначе уволят/заблокируют" отключают критическое мышление. Жертве не дают времени подумать или перепроверить информацию через другие каналы связи.' 
    },
    { 
      id: 'soc_payload', 
      title: 'ФИШИНГОВАЯ ССЫЛКА / ДЕЙСТВИЕ',
      text: 'Цель любой социальной инженерии — заставить вас кликнуть. Ссылка маскируется под внутренний корпоративный портал (например, вместо corp-portal.ru подсовывают corp-portall.ru).' 
    }
  ];

  return (
    <div className="se-page-container">
      {/* ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <header className="se-main-header">
        <div className="se-header-left">
           <h1 className="se-header-title">ПСИХОЛОГИЧЕСКИЕ ЛОВУШКИ (Social Engineering)</h1>
        </div>
        
        <nav className="se-header-nav">
          <button className="se-nav-btn" onClick={() => navigate('/dashboard')}>
            <Home size={18} />
            <span>Главная</span>
          </button>
          <button className="se-nav-btn" onClick={() => navigate('/map')}>
            <LayoutGrid size={18} />
            <span>Карта</span>
          </button>
          <button className="se-nav-btn" onClick={() => navigate('/profile')}>
            <User size={18} />
            <span>Профиль</span>
          </button>
        </nav>
      </header>

      <main className="se-content-layout">
        <section className="se-simulation-grid">
          
          {/* МОКАП КОРПОРАТИВНОГО МЕССЕНДЖЕРА */}
          <div className="se-messenger-box">
            <div className="se-messenger-frame">
              <aside className="se-messenger-sidebar">
                <button className="se-sidebar-back-btn" onClick={() => navigate('/map')}>
                  <ArrowLeft size={16} />
                  К КАРТЕ
                </button>
                <div className="se-sidebar-section-title">Рабочие чаты</div>
                <ul className="se-chat-channels-list">
                  <li className="se-channel-item active"><MessageSquare size={16} /> # Срочно-Важно</li>
                  <li className="se-channel-item"><Users size={16} /> # Общий_чат</li>
                  <li className="se-channel-item"><Building2 size={16} /> # Бухгалтерия</li>
                </ul>
              </aside>
              
              <div className="se-messenger-main">
                <div className="se-chat-top-bar">
                  <div className="se-chat-meta-wrapper">
                    <BellRing size={16} color="#ef4444" className="se-pulse-animation" />
                    <h2>Внутреннее уведомление: Внеплановый аудит</h2>
                  </div>
                  <p>Разбор векторов атак, основанных на человеческом факторе.</p>
                </div>

                {/* ТЕЛО ДИАЛОГА (ИМИТАЦИЯ ДАВЛЕНИЯ) */}
                <div className="se-chat-history-viewport">
                  
                  {/* Сообщение 1: Авторитет */}
                  <div 
                    className={`se-chat-message-row target ${activeHint === 'soc_authority' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveHint('soc_authority')}
                  >
                    <div className="se-avatar se-avatar-ceo">CEO</div>
                    <div className="se-message-details">
                      <span className="se-author-name">Николай (Генеральный директор)</span>
                      <span className="se-message-time">14:22</span>
                      <p className="se-message-body se-highlight-authority">
                        «Привет! У нас сейчас внезапная проверка ИБ. Мне в личку пишет главный аудитор, говорит, что твой отдел не обновил сертификаты безопасности. Ситуация критическая, на кону контракт!»
                      </p>
                    </div>
                  </div>

                  {/* Сообщение 2: Срочность */}
                  <div 
                    className={`se-chat-message-row target ${activeHint === 'soc_urgency' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveHint('soc_urgency')}
                  >
                    <div className="se-avatar se-avatar-alert"><Clock size={16} /></div>
                    <div className="se-message-details">
                      <span className="se-author-name">Николай (Генеральный директор)</span>
                      <span className="se-message-time">14:23</span>
                      <p className="se-message-body se-highlight-urgency">
                        «Нужно пройти верификацию в течение <strong>10 минут</strong>, иначе безопасники заблокируют твою рабочую учетку до выяснения обстоятельства! Не подводи команду, делай быстро.»
                      </p>
                    </div>
                  </div>

                  {/* Сообщение 3: Ловушка */}
                  <div 
                    className={`se-chat-message-row target ${activeHint === 'soc_payload' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveHint('soc_payload')}
                  >
                    <div className="se-avatar se-avatar-link"><Zap size={16} /></div>
                    <div className="se-message-details">
                      <span className="se-author-name">Николай (Генеральный директор)</span>
                      <span className="se-message-time">14:23</span>
                      <div className="se-message-body">
                        Вот быстрая ссылка на форму подтверждения, введи туда свои доменные данные от ЛК: 
                        <span className="se-fake-phishing-link" onClick={() => setShowWarning(true)}>
                          https://corp-security-login.ru/verify
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* МОДАЛКА ПРИ КЛИКЕ */}
                {showWarning && (
                  <div className="se-warning-modal-overlay">
                    <div className="se-warning-modal-content">
                      <AlertTriangle size={48} color="#ef4444" />
                      <h3>ВЫ ПОДДАЛИСЬ МАНИПУЛЯЦИИ</h3>
                      <p>Вы кликнули по фишинговой ссылке. В реальной жизни это привело бы к краже ваших корпоративных доступов, компрометации всей внутренней сети компании и вымогательству денег.</p>
                      <button className="se-modal-close-btn" onClick={() => setShowWarning(false)}>
                        Вернуться к анализу
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ПАНЕЛЬ АНАЛИЗА СПРАВА */}
          <aside className="se-analysis-sidebar">
            <h2>Протокол Психоанализа</h2>
            <div className="se-hint-display-zone">
              {activeHint ? (
                <div className="se-fade-in-animation">
                  <h4 className="se-hint-card-title">{hints.find(h => h.id === activeHint).title}</h4>
                  <p className="se-hint-card-text">{hints.find(h => h.id === activeHint).text}</p>
                </div>
              ) : (
                <div className="se-hint-placeholder-wrapper">
                  <MousePointer2 size={32} />
                  <p>Наведите на элементы переписки в мессенджере, чтобы вскрыть уловки манипулятора...</p>
                </div>
              )}
            </div>
            
            <div className="se-quick-facts-container">
               <div className="se-fact-row">
                  <ShieldAlert size={18} />
                  <span><strong>Более 85%</strong> успешных кибератак на крупные компании начинаются не со взлома кода, а с простого разговора или фишингового письма.</span>
               </div>
            </div>
          </aside>
        </section>

        {/* ТЕМАТИЧЕСКАЯ СПРАВКА */}
        <section className="se-learning-grid-blocks">
          <div className="se-theory-card">
            <h3>Что такое Социальная Инженерия?</h3>
            <p>Это метод взлома систем защиты, использующий слабости человеческой психологии. Злоумышленнику не нужно искать баги в коде вашего компьютера, если он может обманом заставить вас самостоятельно отдать ключи, пароли или перевести деньги.</p>
          </div>
          <div className="se-theory-card danger">
            <h3>Маркеры атаки (На что обращать внимание):</h3>
            <ul>
              <li><strong>Смена канала связи:</strong> Если "директор" или "родственник" внезапно пишет вам в неизвестный мессенджер с нового аккаунта.</li>
              <li><strong>Запрет на проверку:</strong> Вас просят никому не говорить ("это конфиденциально", "некогда объяснять").</li>
              <li><strong>Категоричность требований:</strong> Давление на эмоции страха, жалости или жадности.</li>
            </ul>
          </div>
        </section>

        {/* НАЧАЛО ТЕСТА */}
        <section className="se-bottom-action-zone">
            <NavLink className="se-start-simulation-btn" to="/scenario/social/social_test">
              ВСТУПИТЬ В ИГРУ С ХАКЕРОМ
            </NavLink>
        </section>
      </main>
    </div>
  );
};

export default ScenarioSocial;
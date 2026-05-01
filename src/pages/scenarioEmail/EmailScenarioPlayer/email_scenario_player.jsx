import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Trash2, ShieldAlert, Archive, MoreVertical, 
  RefreshCcw, Home, ChevronRight, Send, Star, FileText, 
  Inbox, AlertTriangle, CheckCircle2, Menu, Search, Info, ShieldCheck
} from "lucide-react";
import { scenarios, scenarioOrder } from "./scenarios"; 
import "../EmailScenarioPlayer/email_player.css";

const EmailScenarioPlayer = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const scenario = scenarios[id];
  
  const [currentStepId, setCurrentStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [risk, setRisk] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  useEffect(() => {
    if (scenario) {
      setCurrentStepId(scenario.start);
      setHistory([]); 
      setRisk(0);
      setIsEnded(false);
    }
  }, [id, scenario]);

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
    if (isEnded) return;
    setRisk((prev) => prev + (answer.risk || 0));
    setCurrentStepId(answer.next);
    setActiveHint(null);
  };

  if (!scenario) return <div className="error">Загрузка...</div>;

  return (
    <div className="gmail-layout">
      {/* HEADER */}
      <header className="gmail-nav">
        <div className="nav-left">
          <button className="icon-btn"><Menu size={20} /></button>
          <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" alt="Gmail" className="gmail-logo" />
        </div>
        <div className="nav-search">
          <div className="search-container">
            <Search size={18} />
            <input type="text" placeholder="Поиск в Cyber Mail" disabled />
          </div>
        </div>
      </header>

      <div className="gmail-main">
        {/* 1. LEFT SIDEBAR */}
        <aside className="gmail-sidebar">
          <button className="compose-btn">＋ Написать</button>
          <ul className="sidebar-list">
            <li className="active"><Inbox size={18} /> Входящие</li>
            <li><Star size={18} /> Помеченные</li>
            <li><Send size={18} /> Отправленные</li>
            <li><Trash2 size={18} /> Корзина</li>
          </ul>
        </aside>

        {/* 2. CENTRAL EMAIL VIEW */}
        <section className="email-view">
          <div className="email-toolbar">
            <button onClick={() => navigate("/scenario/email")}><ArrowLeft size={18}/></button>
            <button><Archive size={18}/></button>
            <button><ShieldAlert size={18}/></button>
            <button><Trash2 size={18}/></button>
          </div>

          <div className="email-container-scroll">
            <h1 className="email-subject">{scenario.subject}</h1>
            
            <div className="email-thread">
              {history.map((step, index) => (
                <div key={index} className="email-message-wrapper">
                  <div className="email-meta">
                    <div className="sender-avatar">{step.from[0]}</div>
                    <div className="sender-info">
                      <div className="sender-row">
                        {/* ЗОНА АНАЛИЗА: ОТПРАВИТЕЛЬ */}
                        <span 
                          className={`detect-zone ${activeHint?.id === 'sender' ? 'scanned' : ''}`}
                          onMouseEnter={() => setActiveHint({id: 'sender', title: 'АНАЛИЗ ОТПРАВИТЕЛЯ', text: step.hints?.sender})}
                        >
                          <strong>{step.from}</strong>
                        </span>
                        <span className="email-time">10:45</span>
                      </div>
                      <div className="recipient-row">кому: мне ▾</div>
                    </div>
                  </div>

                  <div className="email-body-text">
                    {step.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    
                    {step.trapButton && (
                      <div 
                        className={`detect-zone button-zone ${activeHint?.id === 'button' ? 'scanned' : ''}`}
                        onMouseEnter={() => setActiveHint({id: 'button', title: 'ПРОВЕРКА ССЫЛКИ', text: step.hints?.button})}
                      >
                        <button className="gmail-mock-action">{step.trapButton.text}</button>
                      </div>
                    )}
                  </div>

                  {!isEnded && index === history.length - 1 && step.answers && (
                    <div className="email-interactive-actions">
                      {step.answers.map((ans, i) => (
                        <button key={i} className="gmail-standard-btn" onClick={() => handleAction(ans)}>
                          {ans.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEnded && (
              <div className="final-report-card">
                <div className="status-pill">{risk > 40 ? 'Угроза обнаружена' : 'Чисто'}</div>
                <h2>Симуляция завершена</h2>
                <button className="next-btn" onClick={() => navigate("/scenario/email")}>В МЕНЮ</button>
              </div>
            )}
          </div>
        </section>

        {/* 3. RIGHT ANALYSIS PANEL (Та самая панель справа) */}
        <aside className="analysis-panel">
          <div className="panel-header">
            <ShieldCheck size={20} />
            <span>АНАЛИЗАТОР УГРОЗ</span>
          </div>
          
          <div className="panel-content">
            {activeHint ? (
              <div className="hint-active animate-fade">
                <h4>{activeHint.title}</h4>
                <div className="hint-body">
                  <AlertTriangle size={16} className="warn-icon" />
                  <p>{activeHint.text}</p>
                </div>
              </div>
            ) : (
              <div className="hint-placeholder">
                <Info size={32} />
                <p>Наведите на подсвеченные области в письме для запуска сканирования...</p>
              </div>
            )}
          </div>

          <div className="panel-footer">
            <div className="risk-header">УРОВЕНЬ РИСКА: {risk}%</div>
            <div className="risk-bar-container">
              <div className="risk-bar-fill" style={{ width: `${risk}%`, background: risk > 50 ? '#f43f5e' : '#10b981' }}></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EmailScenarioPlayer;
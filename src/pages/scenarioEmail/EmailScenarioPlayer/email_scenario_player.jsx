import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Trash2, ShieldAlert, Archive, 
  Menu, Search, Info, ShieldCheck, Send, Star, Inbox
} from "lucide-react";
import toast from 'react-hot-toast';
import "../EmailScenarioPlayer/email_player.css";
import { useAuth } from "../../../context/AuthContext";

const EmailScenarioPlayer = () => {
  const { user, updateProfile } = useAuth();
  const { scenarioId } = useParams(); 
  const navigate = useNavigate();
  
  const [scenarioData, setScenarioData] = useState(null); 
  const [steps, setSteps] = useState({}); 
  const [relatedScenarios, setRelatedScenarios] = useState([]); 
  const [nextPath, setNextPath] = useState(null); 
  
  const [currentStepId, setCurrentStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [risk, setRisk] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchScenario = async () => {
    setLoading(true);
    setHistory([]); 
    setIsEnded(false);
    setRisk(0);

    try {
      const token = localStorage.getItem("userToken");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      };

      const res = await fetch(`http://localhost:8080/api/scenarios/${scenarioId}`, { headers });
      
      if (res.status === 403) {
        throw new Error("Доступ запрещен (403). Проверьте настройки SecurityConfig.");
      }
      
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const result = await res.json();
      console.log("Данные из БД:", result);

      let parsedContent = result.content;
      if (typeof result.content === 'string') {
        try {
          parsedContent = JSON.parse(result.content);
        } catch (e) {
          console.error("Ошибка парсинга content", e);
        }
      }

      setScenarioData(result);
      
      if (parsedContent && parsedContent.steps) {
        setSteps(parsedContent.steps);
        const startId = parsedContent.start || Object.keys(parsedContent.steps)[0];
        setCurrentStepId(startId);
      } else {
        toast.error("Ошибка структуры сценария");
      }

      fetchRelatedScenarios(result.type, token);

    } catch (err) {
      console.error("Ошибка в плеере:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedScenarios = async (type, token) => {
    try {
      const listRes = await fetch(`http://localhost:8080/api/scenarios/type/${type}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const currentIndex = listData.findIndex(s => String(s.name) === String(scenarioId));
        if (listData[currentIndex + 1]) {
          setNextPath(`/scenario/email/${listData[currentIndex + 1].name}`);
        }
      }
    } catch (e) { console.warn("Список уровней недоступен"); }
  };

  useEffect(() => {
    if (scenarioId) fetchScenario();
  }, [scenarioId]);

  useEffect(() => {
    if (currentStepId && steps && steps[currentStepId]) {
      const step = steps[currentStepId];
      
      setHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].id === currentStepId) {
          return prev;
        }
        return [...prev, { ...step, id: currentStepId }];
      });

      if (step.end) setIsEnded(true);
    }
  }, [currentStepId, steps]);

  const handleAction = (answer) => {
    if (isEnded) return;
    if (answer.risk) setRisk((prev) => prev + answer.risk);
    
    // Поддержка и 'next', и 'nextStep'
    const nextTarget = answer.next || answer.nextStep;
    if (nextTarget) {
      setCurrentStepId(nextTarget);
    }
    setActiveHint(null);
  };

  const finishGame = async () => {
    const rawUserData = localStorage.getItem("userData");
    const userData = rawUserData ? JSON.parse(rawUserData) : null;
    const userId = userData?.id; 
    const token = localStorage.getItem("userToken");
    const pointsAwarded = risk < 30 ? 50 : 10;

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          points: pointsAwarded, 
          reason: `Завершена симуляция: ${scenarioData?.title}` 
        })
      });

      if (!response.ok) throw new Error("Ошибка сохранения");

      updateProfile({ points: user.points + pointsAwarded });
      toast.success(`+${pointsAwarded} XP получено`);
      
      navigate(nextPath || "/map");
    } catch (err) {
      toast.error("Результат не сохранен");
      navigate("/map");
    }
  };

  if (loading) return <div className="loading-screen">Загрузка защищенного канала связи...</div>;

  return (
    <div className="gmail-layout">
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
        <aside className="gmail-sidebar">
          <button className="compose-btn" onClick={() => navigate('/map')}>＋ К карте</button>
          <ul className="sidebar-list">
            <li className="active"><Inbox size={18} /> Входящие</li>
            <li><Star size={18} /> Помеченные</li>
            <li><Send size={18} /> Отправленные</li>
            <li><Trash2 size={18} /> Корзина</li>
          </ul>
        </aside>

        <section className="email-view">
          <div className="email-toolbar">
            <button onClick={() => navigate('/map')}><ArrowLeft size={18}/></button>
            <button><Archive size={18}/></button>
            <button><ShieldAlert size={18}/></button>
            <button><Trash2 size={18}/></button>
          </div>

          <div className="email-container-scroll">
            <h1 className="email-subject">{scenarioData?.title || "Загрузка..."}</h1>
            
            <div className="email-thread">
              {history.map((step, index) => (
                <div key={index} className="email-message-wrapper">
                  <div className="email-meta">
                    <div className="sender-avatar">{step.from ? step.from[0] : "?"}</div>
                    <div className="sender-info">
                      <div className="sender-row">
                        <strong>{step.from}</strong>
                        <span className="email-time">10:45</span>
                      </div>
                      <div className="recipient-row">кому: мне ▾</div>
                    </div>
                  </div>

                  <div className="email-body-text">
                    {step.text?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>

                  {/* Исправлено: поддержка и options, и answers */}
                  {!isEnded && index === history.length - 1 && (step.options || step.answers) && (
                    <div className="email-interactive-actions">
                      {(step.options || step.answers).map((opt, i) => (
                        <button key={i} className="gmail-standard-btn" onClick={() => handleAction(opt)}>
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEnded && (
              <div className="final-report-card">
                <div className={`status-pill ${risk > 40 ? 'danger' : 'safe'}`}>
                  {risk > 40 ? 'Угроза: Критическая' : 'Угроза: Низкая'}
                </div>
                <h2>Симуляция завершена</h2>
                <p>Ваш показатель риска: {risk}%</p>
                <button className="next-btn" onClick={finishGame}>
                  {nextPath ? "СЛЕДУЮЩИЙ УРОВЕНЬ" : "ЗАВЕРШИТЬ МИССИЮ"}
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="analysis-panel">
          <div className="panel-header">
            <ShieldCheck size={20} />
            <span>АНАЛИЗАТОР CyberGuard</span>
          </div>
          <div className="panel-content">
            {activeHint ? (
              <div className="hint-active animate-fade">
                <h4>{activeHint.title}</h4>
                <p>{activeHint.text}</p>
              </div>
            ) : (
              <div className="hint-placeholder">
                <Info size={32} />
                <p>Система готова к сканированию угроз...</p>
              </div>
            )}
          </div>
          <div className="panel-footer">
            <div className="risk-header">УРОВЕНЬ РИСКА: {risk}%</div>
            <div className="risk-bar-container">
              <div 
                className="risk-bar-fill" 
                style={{ width: `${risk}%`, background: risk > 50 ? '#f43f5e' : '#10b981' }}
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EmailScenarioPlayer;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Trash2, ShieldAlert, Archive, 
  Menu, Search, Info, ShieldCheck, AlertTriangle, Send, Star, Inbox, LayoutGrid, User
} from "lucide-react";
import toast from 'react-hot-toast';
import "../EmailScenarioPlayer/email_player.css";
import { useAuth } from "../../../context/AuthContext";



const EmailScenarioPlayer = () => {
  const { user, updateProfile } = useAuth();
  const { scenarioId } = useParams(); // ID берется из роута /scenario/:type/player/:scenarioId
  const navigate = useNavigate();
  
  const [scenarioData, setScenarioData] = useState(null); // Весь объект из БД
  const [steps, setSteps] = useState({}); // Объект со всеми шагами (content.steps)
  const [relatedScenarios, setRelatedScenarios] = useState([]); // Список всех email сценариев
  const [nextPath, setNextPath] = useState(null); // Путь к следующему сценарию
  
  const [currentStepId, setCurrentStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [risk, setRisk] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Загрузка данных из БД по ID
  useEffect(() => {
  const fetchScenario = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

      // 1. Загружаем текущий сценарий
      const res = await fetch(`http://localhost:8080/api/scenarios/${scenarioId}`, { headers });
      if (!res.ok) throw new Error("Сценарий не найден");
      const result = await res.json();

      // 2. Загружаем список всех сценариев этого типа (EMAIL)
      const listRes = await fetch(`http://localhost:8080/api/scenarios/type/${result.type}`, { headers });
      // Внутри useEffect, где вычисляется nextPath
      if (listRes.ok) {
        const listData = await listRes.json();
        setRelatedScenarios(listData);
        
        // Приводим всё к строке для надежного сравнения
        const currentIndex = listData.findIndex(s => String(s.id) === String(result.id));
        const next = listData[currentIndex + 1];
        
        console.log("Текущий индекс:", currentIndex);
        console.log("Следующий сценарий:", next);

        if (next) {
          // Используем id, так как это более надежный идентификатор для БД
          const nextUrl = `/scenario/email/${next.name}`;
          setNextPath(nextUrl);
          console.log("Сгенерированный путь:", nextUrl);
        } else {
          setNextPath(null);
        }
      }

      // Парсинг контента
      let content = typeof result.content === 'string' ? JSON.parse(result.content) : result.content;
      
      setScenarioData(result);
      setSteps(content.steps);
      setCurrentStepId(content.start);
      setHistory([]); 
      setRisk(0);
      setIsEnded(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (scenarioId) fetchScenario();
}, [scenarioId]);

  useEffect(() => {

    if (currentStepId && Object.keys(steps).length > 0) {
      const step = steps[currentStepId];
      if (step) {
        setHistory((prev) => [...prev, { ...step, id: currentStepId }]);
        if (step.end) setIsEnded(true);
      } else {
        console.error("Шаг не найден в объекте steps:", currentStepId);
      }
    }
  }, [currentStepId, steps]);

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
        reason: `Пройден email-сценарий: ${scenarioData?.title}` 
      })
    });

    if (!response.ok) throw new Error("Ошибка начисления");

    updateProfile({ points: user.points + pointsAwarded });

    toast.success(`Получено +${pointsAwarded} XP`);
    
    // Если есть следующий путь — идем туда, иначе в список
    if (nextPath) {
      navigate(nextPath);
    } else {
      navigate("/scenario/email");
    }
  } catch (err) {
    toast.error("Ошибка сохранения результата");
    navigate("/scenario/email");
  }
};

  const handleAction = (answer) => {
    if (isEnded) return;
    setRisk((prev) => prev + (answer.risk || 0)); 
    setCurrentStepId(answer.next);
    setActiveHint(null);
  };

  if (loading) return <div className="loading-screen">Инициализация системы Cyber Mail...</div>;

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
        <aside className="gmail-sidebar">
          <button className="compose-btn" onClick={() => navigate('/')}>
            ＋ На главную
          </button>
          
          <ul className="sidebar-list">
            <li className="active"><Inbox size={18} /> Входящие</li>
            <li><Star size={18} /> Помеченные</li>
            <li><Send size={18} /> Отправленные</li>
            <li><Trash2 size={18} /> Корзина</li>
          </ul>

          {/* НОВЫЙ БЛОК НАВИГАЦИИ */}
          <div className="sidebar-divider"></div>
          <div className="sidebar-nav-extra">
            <button className="side-nav-btn map-link" onClick={() => navigate('/map')}>
              <LayoutGrid size={18} />
              <span>Карта миссий</span>
            </button>
            <button className="side-nav-btn profile-link" onClick={() => navigate('/profile')}>
              <User size={18} />
              <span>Мой профиль</span>
            </button>
          </div>
        </aside>

        <section className="email-view">
          <div className="email-toolbar">
            <button onClick={() => navigate(-1)}><ArrowLeft size={18}/></button>
            <button><Archive size={18}/></button>
            <button><ShieldAlert size={18}/></button>
            <button><Trash2 size={18}/></button>
          </div>

          <div className="email-container-scroll">
            {/* Тема письма из БД */}
            <h1 className="email-subject">{scenarioData?.title || "Без темы"}</h1>
            
            <div className="email-thread">
              {history.map((step, index) => (
                <div key={index} className="email-message-wrapper">
                  <div className="email-meta">
                    <div className="sender-avatar">{step.from ? step.from[0] : "?"}</div>
                    <div className="sender-info">
                      <div className="sender-row">
                        <span 
                          className={`detect-zone ${activeHint?.id === 'sender-' + index ? 'scanned' : ''}`}
                          onMouseEnter={() => setActiveHint({
                            id: 'sender-' + index, 
                            title: 'АНАЛИЗ ОТПРАВИТЕЛЯ', 
                            text: step.hints?.sender || "Подозрительных данных не обнаружено"
                          })}
                        >
                          <strong>{step.from}</strong>
                        </span>
                        <span className="email-time">10:45</span>
                      </div>
                      <div className="recipient-row">кому: мне ▾</div>
                    </div>
                  </div>

                  <div className="email-body-text">
                    {step.text?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    
                    {step.trapButton && (
                      <div 
                        className={`detect-zone button-zone ${activeHint?.id === 'btn-' + index ? 'scanned' : ''}`}
                        onMouseEnter={() => setActiveHint({
                          id: 'btn-' + index, 
                          title: 'ПРОВЕРКА ССЫЛКИ', 
                          text: step.hints?.button || "Анализатор проверяет URL..."
                        })}
                      >
                        <button className="gmail-mock-action">{step.trapButton.text}</button>
                      </div>
                    )}
                  </div>

                  {/* Кнопки ответов только для последнего сообщения */}
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
                <div className={`status-pill ${risk > 40 ? 'danger' : 'safe'}`}>
                  {risk > 40 ? 'Угроза обнаружена' : 'Чисто'}
                </div>
                <h2>Симуляция завершена</h2>
                <p>Уровень накопленного риска: {risk}%</p>
                
                {/* Кнопка теперь меняет текст в зависимости от наличия следующего уровня */}
                <button className="next-btn" onClick={finishGame}>
                  {nextPath ? "СЛЕДУЮЩИЙ УРОВЕНЬ" : "ЗАВЕРШИТЬ И СОХРАНИТЬ"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ПАНЕЛЬ АНАЛИЗА */}
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
                <p>Наведите на элементы письма для запуска сканирования...</p>
              </div>
            )}
          </div>

          <div className="panel-footer">
            <div className="risk-header">РИСК: {risk}%</div>
            <div className="risk-bar-container">
              <div 
                className="risk-bar-fill" 
                style={{ 
                  width: `${risk}%`, 
                  background: risk > 50 ? '#f43f5e' : '#10b981' 
                }}
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EmailScenarioPlayer;
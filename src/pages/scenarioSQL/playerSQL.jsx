import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Terminal, Database, Search, Info, ShieldCheck, Server
} from "lucide-react";
import toast from 'react-hot-toast';
import "../scenarioSQL/playerSQL.css"; // Ваши стили для SQL плеера
import { useAuth } from "../../context/AuthContext";

const SqlScenarioPlayer = () => {
  const { user, updateProfile } = useAuth();
  const { scenarioId } = useParams(); // Сюда должен прилетать ID сценария из URL
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

  // Основная функция загрузки сценария
  const fetchScenario = async () => {
    setLoading(true);
    setHistory([]); 
    setIsEnded(false);
    setRisk(0);
    setActiveHint(null);

    try {
      const token = localStorage.getItem("userToken");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      };

      // Запрос конкретного сценария по ID (например, /api/scenarios/12)
      const res = await fetch(`http://localhost:8080/api/scenarios/${scenarioId}`, { headers });
      
      if (res.status === 403) {
        throw new Error("Доступ запрещен (403). Проверьте настройки SecurityConfig.");
      }
      
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const result = await res.json();
      console.log("Данные сценария из БД:", result);

      // Парсинг JSON-строки из колонки content
      let parsedContent = result.content;
      if (typeof result.content === 'string') {
        try {
          parsedContent = JSON.parse(result.content);
        } catch (e) {
          console.error("Ошибка парсинга поля content", e);
        }
      }

      setScenarioData(result);
      
      if (parsedContent && parsedContent.steps) {
        setSteps(parsedContent.steps);
        // Задаем стартовый шаг (из поля start или берем первый ключ объекта steps)
        const startId = parsedContent.start || Object.keys(parsedContent.steps)[0];
        setCurrentStepId(startId);
      } else {
        toast.error("Ошибка: В сценарии отсутствует структура шагов (steps)");
      }

      // Передаем динамический тип (SQL) и ID сценария для поиска следующего уровня
      if (result.type) {
        fetchRelatedScenarios(result.type, result.id, token);
      }

    } catch (err) {
      console.error("Ошибка в плеере:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Поиск следующего сценария ТОГО ЖЕ ТИПА (например, SQL)
  const fetchRelatedScenarios = async (type, currentScenarioId, token) => {
    try {
      const listRes = await fetch(`http://localhost:8080/api/scenarios/type/${type}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (listRes.ok) {
        const listData = await listRes.json();
        console.log(`Список сценариев с типом ${type}:`, listData);

        // ИСПРАВЛЕНО: Сравниваем по полю id, так как поля name в таблице нет
        const currentIndex = listData.findIndex(s => String(s.id) === String(currentScenarioId));
        
        // Если нашли текущий сценарий и после него есть еще один в массиве
        if (currentIndex !== -1 && listData[currentIndex + 1]) {
          // Записываем путь к следующему сценарию по его ID
          setNextPath(`/scenario/sql/${listData[currentIndex + 1].id}`);
        } else {
          setNextPath(null); // Это последний или единственный уровень данного типа
        }
      }
    } catch (e) { 
      console.warn("Список сопутствующих уровней недоступен", e); 
    }
  };

  useEffect(() => {
    if (scenarioId) fetchScenario();
  }, [scenarioId]);

  // Следим за изменением текущего шага и обновляем историю прохождения
  useEffect(() => {
    if (currentStepId && steps && steps[currentStepId]) {
      const step = steps[currentStepId];
      
      setHistory((prev) => {
        // Избегаем дублирования шагов в истории при повторных рендерах
        if (prev.length > 0 && prev[prev.length - 1].id === currentStepId) {
          return prev;
        }
        return [...prev, { ...step, id: currentStepId }];
      });

      if (step.end) setIsEnded(true);
      
      // Если в шаге заложена базовая подсказка, выводим её в анализатор
      if (step.analysisHint) {
        setActiveHint(step.analysisHint);
      }
    }
  }, [currentStepId, steps]);

  // Обработка клика по кнопкам вариантов ответов
  const handleAction = (answer) => {
    if (isEnded) return;
    if (answer.risk) setRisk((prev) => prev + answer.risk);
    
    // Поддержка двух видов нейминга перехода: next или nextStep
    const nextTarget = answer.next || answer.nextStep;
    if (nextTarget) {
      setCurrentStepId(nextTarget);
    }
    
    // Вывод подсказки из выбранного ответа, либо зачистка панели
    if (answer.hint) {
      setActiveHint(answer.hint);
    } else {
      setActiveHint(null);
    }
  };

  // Начисление очков и выход/переход на новый уровень
  const finishGame = async () => {
    const rawUserData = localStorage.getItem("userData");
    const userData = rawUserData ? JSON.parse(rawUserData) : null;
    const userId = userData?.id; 
    const token = localStorage.getItem("userToken");
    const pointsAwarded = risk < 30 ? 50 : 10;

    if (!userId) {
      toast.error("Идентификатор пользователя не найден");
      navigate("/map");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          points: pointsAwarded, 
          reason: `Завершена симуляция: ${scenarioData?.title || "Без названия"}` 
        })
      });

      if (!response.ok) throw new Error("Ошибка сохранения прогресса");

      updateProfile({ points: user.points + pointsAwarded });
      toast.success(`+${pointsAwarded} XP получено`);
      
      // Перенаправляем на следующий уровень (если есть) или на карту
      navigate(nextPath || "/map");
    } catch (err) {
      console.error(err);
      toast.error("Результат не сохранен на сервере");
      navigate("/map");
    }
  };

  if (loading) {
    return <div className="loading-screen">Инициализация песочницы баз данных (SQLi Sandbox)...</div>;
  }

  // Получаем данные самого актуального (последнего) шага в истории
  const currentStepData = history[history.length - 1] || {};

  return (
    <div className="gmail-layout sql-theme">
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <header className="gmail-nav" style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="nav-left">
          <button className="icon-btn" onClick={() => navigate('/map')}><ArrowLeft size={20} color="#94a3b8" /></button>
          <span style={{ fontWeight: '700', letterSpacing: '1px', color: '#f1f5f9', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#3b82f6"/> SQLi_LAB // {scenarioData?.title || "Загрузка..."}
          </span>
        </div>
      </header>

      <div className="gmail-main">
        {/* ЛЕВАЯ ПАНЕЛЬ */}
        <aside className="gmail-sidebar" style={{ background: '#0b0f19', borderRight: '1px solid #1e293b' }}>
          <button className="compose-btn" onClick={() => navigate('/map')}>＋ К карте</button>
          <ul className="sidebar-list">
            <li className="active"><Database size={18} color="#3b82f6" /> Web Application</li>
            <li><Server size={18} color="#64748b" /> Настройки БД</li>
          </ul>
        </aside>

        {/* ЦЕНТРАЛЬНАЯ ЗОНА СЮЖЕТА */}
        <section className="email-view" style={{ background: '#0f172a' }}>
          <div className="email-container-scroll" style={{ padding: '30px' }}>
            
            {/* ИНТЕРАКТИВНЫЙ ДИСПЛЕЙ ОТОБРАЖЕНИЯ SQL-ЗАПРОСОВ */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155', marginBottom: '25px' }}>
              <div style={{ maxWidth: '450px', margin: '0 auto', padding: '10px 0' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>Поле ввода на сайте:</label>
                <input 
                  type="text" 
                  value={currentStepData.payloadForInput || "Ожидание выбора действия..."} 
                  readOnly
                  style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f43f5e', fontFamily: 'monospace', fontSize: '15px', fontWeight: 'bold' }} 
                />
              </div>

              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #eab308', marginTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#eab308', fontWeight: 'bold', marginBottom: '6px' }}>
                  <Database size={14} /> ВНУТРЕННИЙ SQL-ЗАПРОС НА СЕРВЕРЕ:
                </div>
                <code style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '13px', display: 'block', wordBreak: 'break-all' }}>
                  {currentStepData.rawSqlQuery || "SELECT * FROM users WHERE id = '...';"}
                </code>
              </div>
            </div>

            {/* ИСТОРИЯ ДИАЛОГОВ / ШАГОВ */}
            <div className="email-thread">
              {history.map((step, index) => (
                <div key={index} className="email-message-wrapper" style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '20px' }}>
                  <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>От: {step.from || "Система безопасности"}</span>
                  
                  <div className="email-body-text" style={{ color: '#cbd5e1', fontSize: '15px', marginTop: '10px' }}>
                    {step.text?.split('\n').map((line, i) => <p key={i} style={{ marginBottom: '8px' }}>{line}</p>)}
                  </div>

                  {/* Рендеринг вариантов выбора (только для самого последнего активного шага) */}
                  {!isEnded && index === history.length - 1 && (step.options || step.answers) && (
                    <div className="email-interactive-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(step.options || step.answers).map((opt, i) => (
                        <button 
                          key={i} 
                          className="gmail-standard-btn" 
                          style={{ textAlign: 'left', background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '14px', borderRadius: '10px', width: '100%', cursor: 'pointer' }}
                          onClick={() => handleAction(opt)}
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ИТОГОВЫЙ РЕПОРТ ПОСЛЕ ИГРЫ */}
            {isEnded && (
              <div className="final-report-card" style={{ background: '#1e293b', border: '1px solid #334155', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
                <div className={`status-pill ${risk > 40 ? 'danger' : 'safe'}`} style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', marginBottom: '15px' }}>
                  {risk > 40 ? 'Угроза: Критическая' : 'Угроза: Низкая'}
                </div>
                <h2 style={{ color: '#fff', marginBottom: '10px' }}>Симуляция завершена</h2>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Ваш показатель риска: {risk}%</p>
                <button className="next-btn" onClick={finishGame} style={{ background: '#10b981', color: '#fff', fontWeight: 'bold', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  {nextPath ? "СЛЕДУЮЩИЙ УРОВЕНЬ" : "ЗАВЕРШИТЬ МИССИЮ"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ПРАВАЯ ПАНЕЛЬ АНАЛИЗАТОРА */}
        <aside className="analysis-panel" style={{ background: '#0b0f19', borderLeft: '1px solid #1e293b', width: '300px', padding: '20px' }}>
          <div className="panel-header" style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <ShieldCheck size={20} />
            <span>АНАЛИЗАТОР CyberGuard</span>
          </div>
          <div className="panel-content">
            {activeHint ? (
              <div className="hint-active animate-fade">
                <h4 style={{ color: '#f43f5e', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{activeHint.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>{activeHint.text}</p>
              </div>
            ) : (
              <div className="hint-placeholder" style={{ textAlign: 'center', paddingTop: '40px', color: '#475569' }}>
                <Info size={32} />
                <p style={{ fontSize: '13px', marginTop: '10px' }}>Система готова к сканированию угроз...</p>
              </div>
            )}
          </div>
          <div className="panel-footer" style={{ marginTop: '30px' }}>
            <div className="risk-header" style={{ color: '#fff', fontSize: '12px', marginBottom: '6px' }}>УРОВЕНЬ РИСКА: {risk}%</div>
            <div className="risk-bar-container" style={{ background: '#1e293b', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                className="risk-bar-fill" 
                style={{ width: `${risk}%`, height: '100%', background: risk > 50 ? '#f43f5e' : '#10b981', transition: 'width 0.3s ease' }}
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SqlScenarioPlayer;
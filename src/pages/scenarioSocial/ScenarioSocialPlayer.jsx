import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ShieldCheck, AlertTriangle, ArrowLeft, Send, RefreshCw, ArrowRight, Map
} from "lucide-react";
import toast from 'react-hot-toast';
import "../scenarioSocial/playerSocial.css"; 

const ScenarioSocialPlayer = () => {
  const { scenarioId } = useParams(); // Получаем ID/Имя текущего сценария из URL
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Состояния для данных из бэкенда
  const [scenario, setScenario] = useState(null);
  const [stepsData, setStepsData] = useState(null);
  const [relatedScenarios, setRelatedScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Игровые состояния диалога
  const [currentStep, setCurrentStep] = useState("");
  const [riskLevel, setRiskLevel] = useState(20); 
  const [chatHistory, setChatHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalNode, setFinalNode] = useState(null);

  // Скролл к нижнему сообщению при обновлении чата
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Загрузка сценария и связанных квестов из БД
  useEffect(() => {
    const fetchScenarioFromDb = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

        // 1. Получаем текущий сценарий
        const res = await fetch(`http://localhost:8080/api/scenarios/${scenarioId}`, { headers });
        if (!res.ok) throw new Error("Сценарий не найден в базе данных");
        const data = await res.json();
        
        setScenario(data);
        setStepsData(data.content); // Здесь лежит наш JSON с деревом графа
        setIsFinished(false);
        setFinalNode(null);
        setRiskLevel(20);

        // Инициализируем первое сообщение
        if (data.content && data.content.start) {
          const firstStepKey = data.content.start;
          const firstStepNode = data.content.steps[firstStepKey];
          setCurrentStep(firstStepKey);
          setChatHistory([
            {
              sender: "ceo",
              name: firstStepNode.from,
              text: firstStepNode.text,
              time: "14:40"
            }
          ]);
        }

        // 2. Получаем список всех сценариев этого типа для вычисления кнопки "Далее"
        const listRes = await fetch(`http://localhost:8080/api/scenarios/type/${data.type}`, { headers });
        if (listRes.ok) {
          const listData = await listRes.json();
          setRelatedScenarios(listData);
        }
      } catch (err) {
        toast.error("Ошибка загрузки: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarioFromDb();
  }, [scenarioId]);

  // Функция вычисления пути к следующему квесту в массиве
  const getNextScenarioPath = () => {
    if (!scenario || relatedScenarios.length === 0) return null;
    // Ищем индекс текущего сценария в полученном из БД массиве по совпадению имен/id
    const currentIndex = relatedScenarios.findIndex(s => s.name === scenario.name);
    const nextScenario = relatedScenarios[currentIndex + 1];
    
    // Если есть следующий — генерируем на него ссылку, если нет — возвращаем null
    return nextScenario ? `/scenario/social/${nextScenario.name}` : null;
  };

  const nextPath = getNextScenarioPath();

  const handleAnswerClick = (answer) => {
    // Отображаем выбор игрока в интерфейсе чата
    setChatHistory(prev => [...prev, {
      sender: "user",
      name: "Вы (Сотрудник)",
      text: answer.text,
      time: "14:42"
    }]);

    // Динамически меняем локальную шкалу риска
    setRiskLevel(prev => Math.max(0, Math.min(100, prev + (answer.risk > 40 ? 25 : answer.risk < 0 ? -15 : 10))));

    const nextKey = answer.next;

    // Проверяем, существует ли следующий шаг в ветке steps
    if (stepsData?.steps && stepsData.steps[nextKey]) {
      setTimeout(() => {
        const nextNode = stepsData.steps[nextKey];
        setChatHistory(prev => [...prev, {
          sender: "ceo",
          name: nextNode.from,
          text: nextNode.text,
          time: "14:43"
        }]);
        setCurrentStep(nextKey);
      }, 700);

    // Если шага в steps нет, ищем финальный узел (фишинг, победа и т.д.) в корне объекта content
    } else if (stepsData && stepsData[nextKey]) {
      setTimeout(() => {
        const endNode = stepsData[nextKey];
        setRiskLevel(endNode.risk); // Фиксируем итоговый риск сценария
        setFinalNode(endNode);
        setIsFinished(true);

        setChatHistory(prev => [...prev, {
          sender: "system",
          name: endNode.from,
          text: endNode.text,
          time: "Итог"
        }]);
      }, 700);
    }
  };

  // Метод отправки результатов на бэкенд и перенаправления
  const handleFinishOrNext = async (path) => {
    const rawUserData = localStorage.getItem("userData");
    const userData = rawUserData ? JSON.parse(rawUserData) : null;
    const userId = userData?.id; 
    const token = localStorage.getItem("userToken");

    if (!userId) {
      toast.error("Не удалось определить ID пользователя");
      return;
    }

    // Начисление поинтов в зависимости от успешности прохождения (риск ниже 50% = победа)
    const pointsToAward = riskLevel > 50 ? 10 : 50;

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          points: pointsToAward, 
          reason: `Завершил симуляцию: ${scenario?.title || "Без названия"}` 
        })
      });

      if (!response.ok) throw new Error("Ошибка при сохранении прогресса");
      
      toast.success(`Симуляция пройдена! +${pointsToAward} XP`);

      if (path) {
        navigate(path); // Переход к следующему сценарию из массива бэка
      } else {
        navigate("/map"); // Если массив кончился — выходим на общую карту квестов
      }
    } catch (err) {
      toast.error("Ошибка сохранения: " + err.message);
    }
  };

  const restartGame = () => {
    if (stepsData && stepsData.start) {
      setCurrentStep(stepsData.start);
      setRiskLevel(20);
      setIsFinished(false);
      setFinalNode(null);
      const firstStepNode = stepsData.steps[stepsData.start];
      setChatHistory([
        {
          sender: "ceo",
          name: firstStepNode.from,
          text: firstStepNode.text,
          time: "14:40"
        }
      ]);
    }
  };

  if (loading) return <div className="loading-screen">Загрузка симуляции чата...</div>;
  if (!scenario || !stepsData) return <div className="error-screen">Сценарий не найден</div>;

  const currentStepData = stepsData.steps[currentStep];

  return (
    <div className="player-page">
      {/* КНОПКА НАЗАД */}
      <div className="player-nav">
        <button className="back-btn" onClick={() => navigate('/scenario/social/info')}>
          <ArrowLeft size={16} /> Назад
        </button>
        <div className="game-title">{stepsData.subject || scenario.title}</div>
      </div>

      <div className="player-grid">
        {/* ЛЕВАЯ ЧАСТЬ: ИГРОВОЙ ЧАТ */}
        <div className="chat-area">
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="status-indicator online"></div>
              <div>
                <div className="chat-window-name">Внутренний корпоративный чат</div>
                <div className="chat-window-status">{isFinished ? "Сессия завершена" : "Собеседник в сети"}</div>
              </div>
            </div>

            <div className="chat-messages-list">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`player-msg ${msg.sender}-msg`}>
                  <div className="msg-bubble">
                    <div className="msg-author">{msg.name} <span className="msg-time">{msg.time}</span></div>
                    <p className="msg-text-content">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ВВОД / ВЫБОР ОТВЕТОВ */}
            <div className="chat-input-zone">
              {!isFinished && currentStepData ? (
                <div className="options-container">
                  <div className="options-title">Выберите ваш ответ:</div>
                  {currentStepData.answers?.map((answer, idx) => (
                    <button 
                      key={idx} 
                      className="option-button"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      <Send size={14} />
                      <span>{answer.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="game-over-zone-horizontal">
                  <button className="restart-btn secondary" onClick={restartGame}>
                    <RefreshCw size={16} /> Пройти заново
                  </button>

                  {/* Кнопка динамически меняет текст и роут на основе индекса в массиве БД */}
                  <button className="next-action-btn" onClick={() => handleFinishOrNext(nextPath)}>
                    {nextPath ? (
                      <><span>К следующему сценарию</span><ArrowRight size={16} /></>
                    ) : (
                      <><span>Выйти на карту</span><Map size={16} /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ШКАЛА РИСКА И ИТОГ */}
        <aside className="status-sidebar">
          <div className="status-card">
            <h3>Состояние вашей защиты</h3>
            <p className="status-desc">Уровень критичности ваших решений.</p>
            
            {/* Шкала риска */}
            <div className="metric-box">
              <div className="metric-header">
                <span>Текущий уровень риска:</span>
                <span className={riskLevel > 50 ? "text-danger" : "text-success"}>{riskLevel}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${riskLevel}%`, 
                    background: riskLevel > 50 ? 'linear-gradient(90deg, #f43f5e, #e11d48)' : 'linear-gradient(90deg, #10b981, #34d399)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* ИТОГОВЫЙ ВИДЖЕТ */}
          {isFinished && finalNode && (
            <div className={`result-card ${finalNode.risk < 50 ? "win" : "lose"}`}>
              {finalNode.risk < 50 ? (
                <>
                  <ShieldCheck size={40} color="#10b981" />
                  <h4>Успешная защита!</h4>
                </>
              ) : (
                <>
                  <AlertTriangle size={40} color="#ef4444" />
                  <h4>Вы взломаны</h4>
                </>
              )}
              <p>{finalNode.text}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ScenarioSocialPlayer;
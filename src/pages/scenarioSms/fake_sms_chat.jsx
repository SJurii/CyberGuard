import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./fake_sms_chat.css";
import toast from 'react-hot-toast';

export default function FakeSmsChat() {
  const { scenarioId } = useParams(); 
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  const [scenario, setScenario] = useState(null);
  const [stepsData, setStepsData] = useState(null);
  const [relatedScenarios, setRelatedScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [ended, setEnded] = useState(false);
  
  const [totalRisk, setTotalRisk] = useState(() => Number(localStorage.getItem("totalRisk")) || 0);
  const [currentRisk, setCurrentRisk] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

        const res = await fetch(`http://localhost:8080/api/scenarios/${scenarioId}`, { headers });
        if (!res.ok) throw new Error("Сценарий не найден");
        const data = await res.json();
        
        setScenario(data);
        setStepsData(data.content);
        setMessages([]);
        setAnswers([]);
        setEnded(false);
        setCurrentRisk(0);

        const listRes = await fetch(`http://localhost:8080/api/scenarios/type/${data.type}`, { headers });
        if (listRes.ok) {
          const listData = await listRes.json();
          setRelatedScenarios(listData);
        }

        if (data.content && data.content.start) {
          const firstStep = data.content.steps[data.content.start];
          processStep(firstStep, data.content.steps);
        }
      } catch (err) {
        toast.error("Ошибка загрузки: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [scenarioId]);

  const processStep = (step, allSteps) => {
    if (!step) return;
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: step.from, text: step.text }]);
      
      if (step.end) {
        setTimeout(() => setEnded(true), 1000); 
      } else if (step.answers) {
        setAnswers(step.answers);
      }
    }, step.delay || 1000);
  };

  const sendAnswer = (answer) => {
    const points = answer.risk || 0;
    setMessages(prev => [...prev, { from: "You", text: answer.text }]);
    setAnswers([]); 
    
    setCurrentRisk(prev => prev + points);
    setTotalRisk(prev => {
      const newVal = Math.min(Math.max(prev + points, 0), 100);
      localStorage.setItem("totalRisk", newVal);
      return newVal;
    });

    if (stepsData && stepsData.steps) {
      const nextStep = stepsData.steps[answer.next];
      if (nextStep) {
        processStep(nextStep, stepsData.steps);
      } else {
        console.error("Шаг не найден:", answer.next);
        setTimeout(() => setEnded(true), 1000);
      }
    }
  };

  const getNextScenarioPath = () => {
    if (!scenario || relatedScenarios.length === 0) return null;
    const currentIndex = relatedScenarios.findIndex(s => s.name === scenario.name);
    const next = relatedScenarios[currentIndex + 1];
    return next ? `/scenario/${next.type.toLowerCase()}/${next.name}` : null;
  };

  const nextPath = getNextScenarioPath();

  const handleFinishOrNext = async (path) => {
    await finishSession(path);
  };

  const finishSession = async (path = null) => {
    const rawUserData = localStorage.getItem("userData");
    const userData = rawUserData ? JSON.parse(rawUserData) : null;
    
    const userId = userData?.id; 
    const token = localStorage.getItem("userToken");

    if (!userId) {
      console.error("Ошибка: ID пользователя не найден в объекте userData");
      toast.error("Не удалось определить ID пользователя");
      return;
    }

    const pointsToAward = Number(totalRisk) > 30 ? 10 : 50;

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          points: pointsToAward, 
          reason: `Завершил курс: ${scenario?.title || "Без названия"}` 
        })
      });

      if (!response.ok) throw new Error("Ошибка при начислении баллов");
      
      toast.success(`Курс пройден! +${pointsToAward} XP`);
      localStorage.removeItem("totalRisk");

      if (path) {
        navigate(path);
      } else {
        navigate("/scenario_sms"); 
      }
    } catch (err) {
      console.error("Ошибка сохранения прогресса:", err);
      toast.error("Ошибка сохранения прогресса");
    }
  };

  if (loading) return <div className="loading-screen">Загрузка симуляции...</div>;
  if (!scenario) return <div className="error-screen">Сценарий не найден</div>;

  return (
    <div className={`sms-chat-container ${totalRisk >= 70 ? "critical-alert" : ""}`}>
      <div className="scenario-top-bar" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "15px 20px" }}>
        
        {/* Кнопка НАЗАД стилизована под круглый кибер-элемент */}
        <button 
          onClick={() => navigate("/scenario_sms")} 
          className="back-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(255, 255, 255, 0.06)",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(8px)",
            padding: "0",
            lineHeight: "1"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ←
        </button>

        <div className="scenario-info" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span className="type-tag">{scenario.type}</span>
          <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "700" }}>{scenario.title}</h2>
        </div>
      </div>

      <div className="risk-bar-container">
        <div className="risk-label">УРОВЕНЬ РИСКА: {totalRisk}%</div>
        <div className="risk-bar-bg">
          <div className="risk-bar-fill" style={{ width: `${totalRisk}%` }} />
        </div>
      </div>

      <div className="sms-chat">
        <div className="chat-messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.from === "You" ? "me" : "system"}`}>
              <div className="bubble">
                <span className="sender-name">{msg.from === "You" ? "Вы" : msg.from}</span>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          
          {ended && !isTyping && (
            <div className="message-row system info-summary-row">
              <div className="bubble summary-bubble" style={{ border: '1px dashed #6366f1', background: 'rgba(99, 102, 241, 0.05)' }}>
                <span className="sender-name">Система</span>
                <p><strong>Сценарий успешно завершен!</strong></p>
                <p>Ваш итоговый показатель риска в этой сессии составил: {currentRisk}%</p>
              </div>
            </div>
          )}

          {isTyping && <div className="typing-indicator"><span>.</span><span>.</span><span>.</span></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-controls-footer">
          {!ended && !isTyping && (
            <div className="choices">
              {answers.map((a, i) => (
                <button key={i} onClick={() => sendAnswer(a)}>{a.text}</button>
              ))}
            </div>
          )}

          {ended && !isTyping && (
            <div className="finish-action-area" style={{ padding: '15px', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button 
                className="start-btn" 
                onClick={() => handleFinishOrNext(nextPath)}
                style={{ width: '100%', maxWidth: '400px', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}
              >
                {nextPath ? "Далее ➔" : "Завершить и сохранить"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
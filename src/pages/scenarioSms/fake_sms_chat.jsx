import { useEffect, useState, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { scenarios, scenarioOrder } from "./scenarios";
import "./fake_sms_chat.css";
import toast from 'react-hot-toast';

export default function FakeSmsChat() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  const scenario = scenarios[scenarioId];
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [ended, setEnded] = useState(false);
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  // Глобальный риск (сумма всех уровней), берем из стораджа
  const [totalRisk, setTotalRisk] = useState(() => {
    return Number(localStorage.getItem("totalRisk")) || 0;
  });
  // Локальный риск конкретно этого уровня (всегда с 0)
  const [currentRisk, setCurrentRisk] = useState(0);
  
  const handleDeleteScenario = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот сценарий?")) {
      toast.success("Сценарий удален (заглушка)");
      navigate("/scenario_sms");
    }
  };

  // Автопрокрутка
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Синхронизация глобального риска с localStorage
  useEffect(() => {
    localStorage.setItem("totalRisk", totalRisk);
  }, [totalRisk]);

  // Сброс состояния ПРИ СМЕНЕ сценария
  useEffect(() => {
    if (!scenario) return;
    setMessages([]);
    setEnded(false);
    setCurrentRisk(0); // Обнуляем локальный риск для нового уровня
    receiveMessage(scenario.start);
  }, [scenarioId]);

  const receiveMessage = (stepKey) => {
    const step = scenario.steps[stepKey];
    setAnswers([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: step.from, text: step.text }]);
      if (step.answers) setAnswers(step.answers);
      if (step.end) setEnded(true);
    }, step.delay || 1000);
  };

  const sendAnswer = (answer) => {
    const points = answer.risk || 0;

    setMessages(prev => [...prev, { from: "You", text: answer.text }]);
    
    // Обновляем локальный риск
    setCurrentRisk(prev => prev + points);

    // Обновляем глобальный риск с ограничением 0-100
    setTotalRisk(prev => {
      const newVal = prev + points;
      return Math.min(Math.max(newVal, 0), 100); 
    });

    receiveMessage(answer.next);
  };

const addPoints = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");
    if (!userId) return;

    const points = totalRisk > 50 ? 10 : 50;

    try {
      const res = await fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ points, reason: `Завершил сессию. Риск: ${totalRisk}%` })
      });

      if (res.ok) {
        const data = await res.json();

        // Если бэк вернул новые ачивки
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach(ach => {
            // Создаем кастомный тост
            toast.custom((t) => (
              <div className={`custom-toast ${t.visible ? 'animate-in' : 'animate-out'}`}>
                <div className="toast-icon">🏆</div>
                <div className="toast-body">
                  <p className="toast-label">Новое достижение</p>
                  <p className="toast-name">{ach.title}</p>
                </div>
              </div>
            ), { duration: 4000 });
          });
        } else {
          // Если ачивок нет, просто уведомление об очках
          toast.success(`+${points} XP начислено!`, {
            style: { background: '#1a1a2e', color: '#4facfe', border: '1px solid #4facfe' }
          });
        }

        localStorage.removeItem("totalRisk");
        
        // Даем время посмотреть на тост перед уходом
        setTimeout(() => navigate("/scenario_sms"), 2000);
      }
    } catch (err) { 
      toast.error("Ошибка связи с сервером");
      console.error(err); 
    }
};

  const getRiskColor = () => {
    if (totalRisk < 30) return "#10b981";
    if (totalRisk < 70) return "#f59e0b";
    return "#ef4444";
  };

  const nextScenarioId = scenarioOrder[scenarioOrder.indexOf(scenarioId) + 1];

  // Внутри return компонента:
return (
  <div className={`sms-chat-container ${totalRisk >= 70 ? "critical-alert" : ""}`}>
    {/* Верхняя панель */}
    <div className="scenario-top-bar">
      {/* ... кнопки назад и админские ... */}
    </div>

    {/* Прогресс-бар угрозы */}
    <div className="risk-bar-container">
      <div className="risk-label">
        <span>УРОВЕНЬ ЦИФРОВОЙ УГРОЗЫ</span>
        <span>{totalRisk}%</span>
      </div>
      <div className="risk-bar-bg">
        <div 
          className="risk-bar-fill" 
          style={{ width: `${totalRisk}%`, backgroundColor: getRiskColor(), color: getRiskColor() }}
        />
      </div>
    </div>

    {/* ТЕЛЕФОН */}
    <div className="sms-chat">
      <div className="chat-messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.from === "You" ? "me" : "system"}`}>
            <div className="bubble">
              <span className="sender-title">{msg.from === "You" ? "Защищенный канал" : msg.from}</span>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-row system">
            <div className="bubble typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Выбор вариантов всегда внизу внутри "телефона" */}
      {!ended && !isTyping && answers.length > 0 && (
        <div className="choices">
          {answers.map((a, i) => (
            <button key={i} onClick={() => sendAnswer(a)}>
              {a.text}
            </button>
          ))}
        </div>
      )}

      {/* Оверлей финиша */}
      {ended && (
        <div className="result-overlay">
          <div className="result-card">
            <div className="finish-icon" style={{fontSize: '50px', marginBottom: '10px'}}>✔️</div>
            <h3>Миссия завершена</h3>
            <div className="result-stats">
              <p>Уязвимость: <b>{currentRisk}%</b></p>
            </div>
            <div className="result-actions">
              {nextScenarioId ? (
                <NavLink className="start-btn" style={{display:'block', textDecoration:'none'}} to={`/scenario/sms/${nextScenarioId}`}>
                   Следующий этап
                </NavLink>
              ) : (
                <button className="start-btn" onClick={addPoints}>Зафиксировать XP</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
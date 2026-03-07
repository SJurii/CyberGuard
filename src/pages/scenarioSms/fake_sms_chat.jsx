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

  // Глобальный риск (сумма всех уровней), берем из стораджа
  const [totalRisk, setTotalRisk] = useState(() => {
    return Number(localStorage.getItem("totalRisk")) || 0;
  });

  // Локальный риск конкретно этого уровня (всегда с 0)
  const [currentRisk, setCurrentRisk] = useState(0);

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

  return (
    <div className={`sms-chat-container ${totalRisk >= 70 ? "critical-alert" : ""}`}>
      {/* Прогресс-бар показывает ГЛОБАЛЬНЫЙ риск */}
      <div className="risk-bar-container">
        <div className="risk-label">Общая угроза: {totalRisk}%</div>
        <div className="risk-bar-bg">
          <div 
            className="risk-bar-fill" 
            style={{ width: `${totalRisk}%`, backgroundColor: getRiskColor() }}
          />
        </div>
      </div>

      <div className="sms-chat">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.from === "You" ? "me" : "system"}`}>
            <div className="bubble">
              <b className="sender-title">{msg.from}</b>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="message-row system"><div className="bubble typing">...</div></div>}
        <div ref={chatEndRef} />

        {!ended && !isTyping && (
          <div className="choices">
            {answers.map((a, i) => (
              <button key={i} onClick={() => sendAnswer(a)}>{a.text}</button>
            ))}
          </div>
        )}
      </div>

      {ended && (
        <div className="result-overlay">
          <div className="result-card">
            <h3>Этап пройден!</h3>
            <div className="result-stats">
              <p>Риск за этот уровень: <b>{currentRisk}%</b></p>
              <p>Общий накопленный риск: <b>{totalRisk}%</b></p>
            </div>
            <div className="result-actions">
              {nextScenarioId ? (
                <NavLink className="next-btn" to={`/scenario/sms/${nextScenarioId}`}>Далее</NavLink>
              ) : (
                <button className="back-btn" onClick={addPoints}>Сохранить итог</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
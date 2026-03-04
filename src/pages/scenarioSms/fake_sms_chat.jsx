import { useEffect, useState, useRef } from "react";
import "./fake_sms_chat.css";
import MessageBubble from "./message_bubble";
import ChoicePanel from "./choice_panel";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { scenarios } from "./scenarios";
import { scenarioOrder } from "./scenarios";
import { useNavigate } from "react-router-dom";



// ... остальные импорты те же

export default function FakeSmsChat() {
  const { scenarioId } = useParams();
  const scenario = scenarios[scenarioId];
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Состояние "Печатает..."
  const [currentStep, setCurrentStep] = useState(scenario?.start);
  const [answers, setAnswers] = useState([]);
  const [risk, setRisk] = useState(0);
  const [trust, setTrust] = useState(0);
  const [ended, setEnded] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null); // Для автопрокрутки вниз

  // Автопрокрутка при новом сообщении
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const receiveMessage = (stepKey) => {
    const step = scenario.steps[stepKey];
    setAnswers([]); // Убираем кнопки, пока "банк" печатает
    setIsTyping(true);

    // Имитируем задержку ответа (минимум 1.5 сек для реализма)
    const delay = step.delay || 1500;

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: step.from, text: step.text }]);

      if (step.answers) setAnswers(step.answers);
      if (step.end) setEnded(true);
    }, delay);
  };

  useEffect(() => {
    if (!scenario) return;
    setMessages([]);
    setRisk(0);
    setTrust(0);
    setEnded(false);
    receiveMessage(scenario.start);
  }, [scenarioId]);

  const sendAnswer = (answer) => {
    setMessages(prev => [...prev, { from: "You", text: answer.text }]);
    setRisk(prev => prev + (answer.risk || 0));
    setTrust(prev => prev + (answer.trust || 0));
    
    if (answer.next === "fail_end" || answer.next === "safe_end" || scenario.steps[answer.next]?.end) {
        // Если следующий шаг финальный, сразу переходим
        receiveMessage(answer.next);
    } else {
        receiveMessage(answer.next);
    }
  };

  function addPoints() {
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");

if (!userId) return;

const points = risk > 5 ? 10 : 50;

fetch(`http://localhost:8080/api/profile/${userId}/addPoints`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ points: points, reason: `Завершение сценария ${scenarioId} с риском ${risk}` })
  })
  .then(res => {
    if (res.ok) {
      console.log("Очки успешно начислены");
      // Можно перенаправить программно, если нужно:
      navigate("/scenario_sms");
  }
  else{
    console.error("Ошибка при начислении очков");
    alert("Ошибка при начислении очков");
  }
  })
    .catch(err => console.error("Ошибка:", err));
  }

  // Определяем цвет полоски риска
  const getRiskColor = () => {
    if (risk < 20) return "#10b981"; 
    if (risk < 50) return "#f59e0b"; 
    return "#ef4444"; 
  };

  const currentIndex = scenarioOrder.indexOf(scenarioId);
  const nextScenarioId = currentIndex !== -1 && currentIndex < scenarioOrder.length - 1 ? scenarioOrder[currentIndex + 1] : null;

  return (
    <div className={`sms-chat-container ${risk >= 50 ? "critical-alert" : ""}`}>
      {/* Индикатор риска (Progress Bar) */}
      <div className="risk-bar-container">
        <div className="risk-label">Уровень угрозы: {risk}%</div>
        <div className="risk-bar-bg">
          <div 
            className="risk-bar-fill" 
            style={{ width: `${Math.min(risk, 100)}%`, backgroundColor: getRiskColor() }}
          ></div>
        </div>
      </div>

      <div className="sms-chat">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.from === "You" ? "me" : "system"}`}>
            <div className="bubble">
              <b className="sender-title">{msg.from}</b>
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

        <div ref={chatEndRef} /> {/* Якорь для прокрутки */}

        {!ended && !isTyping && answers.length > 0 && (
          <div className="choices">
            {answers.map((a, i) => (
              <button key={i} onClick={() => sendAnswer(a)}>
                {a.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {ended && (
  <div className="result-overlay">
    <div className="result-card shadow-lg animate-fade-in">
      <span className="result-icon text-5xl mb-4">
        {risk > 20 ? "⚠️" : "🎯"}
      </span>
      <h3 className="text-xl font-bold mb-2">Сценарий завершён</h3>
      
      <div className="result-stats my-4 p-4 bg-gray-50 rounded-lg">
        <p className="flex justify-between">
          Уровень риска: 
          <span className={risk > 20 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
            {risk}%
          </span>
        </p>
        <p className="flex justify-between">
          Доверие системы: <span className="font-semibold text-blue-600">{trust}</span>
        </p>
      </div>
      
      <div className="result-actions flex flex-col gap-3 w-full">
        {/* Если есть следующий сценарий, показываем кнопку перехода */}
        {nextScenarioId && (
          <NavLink 
            className="next-btn bg-indigo-600 text-white py-3 px-6 rounded-xl text-center font-bold hover:bg-indigo-700 transition" 
            to={`/scenario/sms/${nextScenarioId}`}
          >
            Следующий этап →
          </NavLink>
        )}
      
        {/* Кнопка начисления очков и выхода */}
        <button 
          className="back-btn border-2 border-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition" 
          onClick={addPoints}
        >
          Завершить и сохранить
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
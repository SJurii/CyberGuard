import { useEffect, useState } from "react";
import "./fake_sms_chat.css";
import MessageBubble from "./message_bubble";
import ChoicePanel from "./choice_panel";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { scenarios } from "./scenarios";
import { scenarioOrder } from "./scenarios";


export default function FakeSmsChat() {
  
  const { scenarioId } = useParams();
  const scenario = scenarios[scenarioId];
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(scenario.start);
  const [answers, setAnswers] = useState([]);
  const [risk, setRisk] = useState(0);
  const [trust, setTrust] = useState(0); //My add new 
  const [ended, setEnded] = useState(false);

  console.log("index:", scenarioOrder.indexOf(scenarioId));


  const receiveMessage = (stepKey) => {
    const step = scenario.steps[stepKey];

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: step.from, text: step.text }
      ]);

      if (step.answers) setAnswers(step.answers);
      if (step.end) setEnded(true);
    }, step.delay || 500);
  };

  useEffect(() => {
    if (!scenario) return;
    window.scrollTo(0, 0);

    setMessages([]);
    setAnswers([]);
    setRisk(0);
    setTrust(0); //My add new
    setEnded(false);

    setCurrentStep(scenario.start);
    receiveMessage(scenario.start);
  }, [scenarioId]);

  const sendAnswer = (answer) => {
    setMessages(prev => [
      ...prev,
      { from: "You", text: answer.text }
    ]);

    setRisk(prev => prev + answer.risk);
    setAnswers([]);

    if (answer.next === "fail" || answer.next === "success") {
      setEnded(true);
      return;
    }
    

    setCurrentStep(answer.next);
    receiveMessage(answer.next);
  };

  if (!scenario) {
    return <div>Сценарий не найден</div>;
  }

  const currentIndex = scenarioOrder.indexOf(scenarioId);
  const nextScenarioId = currentIndex !== -1 && currentIndex < scenarioOrder.length - 1 ? scenarioOrder[currentIndex + 1] : null;


  return (
    <div className="sms-chat">
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          from={msg.from}
          text={msg.text}
        />
      ))}

      {!ended && answers.length > 0 && (
        <ChoicePanel
          answers={answers}
          onSelect={sendAnswer}
        />
      )}

      {ended && (
        <div className="result-overlay">
          <div className="result-card">
            <span className="result-icon">{risk > 5 ? "⚠️" : "🎯"}</span>
            <h3>Сценарий завершён</h3>
            <div className="result-stats">
              <p>Риск: <span className={risk > 5 ? "bad" : "good"}>{risk}</span></p>
              <p>Доверие: <span>{trust}</span></p>
            </div>
            
            <div className="result-actions">
              {nextScenarioId && (
                <NavLink className="next-btn" to={`/scenario/sms/${nextScenarioId}`}>
                  Следующий этап →
                </NavLink>
              )}
              <NavLink className="back-link" to="/scenario_sms">Вернуться к списку</NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

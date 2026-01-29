import { useState } from "react";
import { smsScenario } from "./scenario_data";
import "./fake_sms_chat.css";
import MessageBubble from "./message_bubble";
import ChoicePanel from "./choice_panel";

export default function FakeSmsChat() {
  const [currentId, setCurrentId] = useState(1);
  const [messages, setMessages] = useState([smsScenario[0]]);
  const [ended, setEnded] = useState(false);

  const currentStep = smsScenario.find(s => s.id === currentId);

  const handleChoice = (choice) => {
    if (choice.next === "fail") {
      setMessages(prev => [
        ...prev,
        { from: "System", text: "❌ Вы передали данные мошенникам. Атака успешна." }
      ]);
      setEnded(true);
      return;
    }

    const nextStep = smsScenario.find(s => s.id === choice.next);
    setMessages(prev => [...prev, nextStep]);
    setCurrentId(choice.next);

    if (nextStep.end) setEnded(true);
  };

  return (
    <div className="sms-chat">
      {messages.map((msg, index) => (
        <MessageBubble key={index} from={msg.from} text={msg.text} />
      ))}

      {!ended && currentStep?.choices && (
        <ChoicePanel choices={currentStep.choices} onSelect={handleChoice} />
      )}
    </div>
  );
}

export default function MessageBubble({ from, text }) {
  const isSystem = from === "System";

  return (
    <div className={`sms-bubble ${isSystem ? "system" : "sender"}`}>
      {!isSystem && <div className="sender-name">{from}</div>}
      <div className="sms-text">{text}</div>
    </div>
  );
}

export default function MessageBubble({ from, text }) {
  return (
    <div className={`bubble ${from === "You" ? "me" : "bot"}`}>
      <b>{from}</b>
      <p>{text}</p>
    </div>
  );
}
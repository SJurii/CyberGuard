export default function ChoicePanel({ choices, onSelect }) {
  return (
    <div className="choice-panel">
      {choices.map((choice, index) => (
        <button
          key={index}
          className={`choice-btn ${choice.risk ? "danger" : ""}`}
          onClick={() => onSelect(choice)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}

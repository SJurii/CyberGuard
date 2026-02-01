export default function ChoicePanel({ answers, onSelect }) {
  return (
    <div className="choices">
      {answers.map((a, i) => (
        <button key={i} onClick={() => onSelect(a)}>
          {a.text}
        </button>
      ))}
    </div>
  );
}

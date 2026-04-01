export default function ClockTreeCard({ label, value, note, accent = "default" }) {
  return (
    <article className={`clock-tree-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

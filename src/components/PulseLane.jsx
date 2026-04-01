export default function PulseLane({ label, pulses, accent = "accent" }) {
  return (
    <div className="clock-pulse-lane">
      <div className="clock-pulse-lane-head">
        <strong>{label}</strong>
        <span>{pulses.filter((pulse) => pulse.active).map((pulse) => `Beat ${pulse.index + 1}`)[0] ?? "idle"}</span>
      </div>

      <div className="clock-pulse-grid" aria-hidden="true">
        {pulses.map((pulse) => (
          <div
            key={`${label}-${pulse.index}`}
            className={`clock-pulse-node ${accent} ${pulse.active ? "active" : ""} ${pulse.trailing ? "trailing" : ""}`}
          >
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GpioBoard({ pins, title, subtitle, onInputToggle }) {
  return (
    <div className="panel gpio-board-panel">
      <p className="eyebrow">RO uController board</p>
      <h3>{title}</h3>
      <p className="panel-copy">{subtitle}</p>

      <div className="gpio-board">
        {pins.map((pin) => (
          <button
            key={pin.id}
            type="button"
            className={`gpio-pin ${pin.mode} ${pin.highlighted ? "highlighted" : ""} ${pin.level ? "high" : "low"}`}
            onClick={() => {
              if (pin.mode === "input" && pin.role === "sensor" && onInputToggle) {
                onInputToggle(pin.id);
              }
            }}
            disabled={!(pin.mode === "input" && pin.role === "sensor" && onInputToggle)}
          >
            <span>{pin.label}</span>
            <strong>{pin.mode.toUpperCase()}</strong>
            <small>{pin.role === "sensor" ? "click to change input" : pin.role}</small>
            <div className="gpio-level">
              <span>{pin.level ? "HIGH" : "LOW"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

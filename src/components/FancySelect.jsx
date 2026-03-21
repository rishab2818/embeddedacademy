import { useEffect, useMemo, useRef, useState } from "react";

export default function FancySelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
  inline = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = useMemo(
    () => options.find((option) => String(option.value) === String(value)) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    function handlePointer(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`fancy-select ${inline ? "inline" : ""} ${open ? "open" : ""} ${className}`.trim()}
    >
      <button
        type="button"
        className="fancy-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label ?? String(value)}</span>
        <span className="fancy-select-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className="fancy-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => {
            const active = String(option.value) === String(value);

            return (
              <button
                key={`${option.value}`}
                type="button"
                className={`fancy-select-option ${active ? "active" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

import { useMemo } from "react";
import SectionHeading from "../components/SectionHeading";
import { charLabelForByte, rangeForBits, toBinary, toHex, toSignedByte } from "../utils/bitMath";

const widthOptions = [
  {
    bits: 8,
    label: "8-bit",
    description: "1 byte wide. Very common in old MCUs, registers and raw byte work.",
  },
  {
    bits: 16,
    label: "16-bit",
    description: "2 bytes wide. Good for timers, counters and medium-sized values.",
  },
  {
    bits: 32,
    label: "32-bit",
    description: "4 bytes wide. This is the normal width for many modern microcontrollers.",
  },
  {
    bits: 64,
    label: "64-bit",
    description: "8 bytes wide. Common in desktop and server-class CPUs.",
  },
];

function WidthSelector({ selectedWidth, onWidthChange }) {
  const selected = widthOptions.find((option) => option.bits === selectedWidth) ?? widthOptions[0];
  const unsignedRange = rangeForBits(selected.bits, false);
  const signedRange = rangeForBits(selected.bits, true);
  const laneCount = selected.bits <= 16 ? selected.bits : 16;

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {widthOptions.map((option) => (
            <button
              key={option.bits}
              type="button"
              className={`chip-button ${selectedWidth === option.bits ? "active" : ""}`}
              onClick={() => onWidthChange(option.bits)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <h3>{selected.label} means {selected.bits} separate bit positions</h3>
        <p className="panel-copy">{selected.description}</p>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Combinations</span>
            <strong>2^{selected.bits}</strong>
          </div>
          <div className="stat-box">
            <span>Unsigned range</span>
            <strong>
              {unsignedRange.min} to {unsignedRange.max.toLocaleString()}
            </strong>
          </div>
          <div className="stat-box">
            <span>Signed range</span>
            <strong>
              {signedRange.min.toLocaleString()} to {signedRange.max.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Compressed lane view</p>
        <div className="lane-grid" aria-hidden="true">
          {Array.from({ length: laneCount }).map((_, index) => (
            <div
              key={`${selected.bits}-${index}`}
              className="lane-cell active"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              1
            </div>
          ))}
        </div>
        <p className="panel-copy">
          Each glowing lane represents one bit line. For 32-bit and 64-bit systems the
          drawing is compressed so it stays readable.
        </p>
      </div>
    </div>
  );
}

function MosfetPanel({ isOn, onToggle }) {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">MOSFET as switch</p>
            <h3>{isOn ? "Gate high: current can flow" : "Gate low: path is blocked"}</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${isOn ? "on" : ""}`}
            onClick={onToggle}
          >
            {isOn ? "Gate is HIGH" : "Gate is LOW"}
          </button>
        </div>

        <div className="mosfet-scene" aria-hidden="true">
          <div className="terminal source">Source</div>
          <div className="terminal drain">Drain</div>
          <div className={`channel ${isOn ? "on" : ""}`} />
          <div className={`gate-line ${isOn ? "on" : ""}`}>
            <span>Gate</span>
          </div>
          <div className="current-track">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className={`charge ${isOn ? "on" : ""}`}
                style={{ animationDelay: `${index * 180}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="explanation-strip">
          <div>
            <strong>Hardware view</strong>
            <span>
              {isOn
                ? "Voltage at the gate builds a conductive channel."
                : "Without enough gate voltage, the channel does not form."}
            </span>
          </div>
          <div>
            <strong>Binary view</strong>
            <span>{isOn ? "A conducting path becomes a logical 1." : "A blocked path becomes a logical 0."}</span>
          </div>
        </div>
      </div>

      <div className="panel panel-note">
        <strong>Easy explanation for learners</strong>
        <p className="panel-copy">
          A processor is built from an enormous number of tiny switches. A MOSFET is one
          such switch. When the switch is on, that electrical state can represent a 1. When
          it is off, it can represent a 0.
        </p>
      </div>
    </div>
  );
}

function RepresentationLab({ byteValue, onByteChange }) {
  const binary = useMemo(() => toBinary(byteValue, 8), [byteValue]);
  const rawBinary = useMemo(() => toBinary(byteValue, 8, 1).replaceAll(" ", ""), [byteValue]);
  const hex = useMemo(() => toHex(byteValue), [byteValue]);
  const signed = useMemo(() => toSignedByte(byteValue), [byteValue]);
  const charLabel = useMemo(() => charLabelForByte(byteValue), [byteValue]);

  return (
    <div className="panel">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Same bits, different representations</p>
          <h3>Move the slider and watch one byte change everywhere together</h3>
        </div>
      </div>

      <div className="control-row">
        <label htmlFor="byteValue">8-bit value</label>
        <div className="slider-row">
          <input
            id="byteValue"
            type="range"
            min="0"
            max="255"
            value={byteValue}
            onChange={(event) => onByteChange(Number(event.target.value))}
          />
          <input
            className="number-input"
            type="number"
            min="0"
            max="255"
            value={byteValue}
            onChange={(event) => onByteChange(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="bit-row" aria-label="Binary bit view">
        {rawBinary.split("").map((bit, index) => (
          <div key={`${bit}-${index}`} className={`bit-pill ${bit === "1" ? "on" : ""}`}>
            {bit}
          </div>
        ))}
      </div>

      <div className="repr-grid">
        <div className="repr-box">
          <span>Decimal</span>
          <strong>{byteValue}</strong>
          <p>Base 10. This is for humans.</p>
        </div>
        <div className="repr-box">
          <span>Binary</span>
          <strong>{binary}</strong>
          <p>Base 2. This matches on and off hardware states.</p>
        </div>
        <div className="repr-box">
          <span>Hex</span>
          <strong>{hex}</strong>
          <p>Base 16. Shorter notation for the exact same byte.</p>
        </div>
      </div>

      <div className="callout">
        <strong>Key idea</strong>
        <span>
          {byteValue} in decimal, {binary} in binary, and {hex} in hex all describe the same
          stored byte. The computer only stores bits.
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <span>Unsigned byte</span>
          <strong>{byteValue}</strong>
        </div>
        <div className="stat-box">
          <span>Signed byte</span>
          <strong>{signed}</strong>
        </div>
        <div className="stat-box">
          <span>`char` meaning</span>
          <strong>{charLabel}</strong>
        </div>
      </div>
    </div>
  );
}

function SignednessPanel({ byteValue }) {
  const binary = toBinary(byteValue, 8);
  const signed = toSignedByte(byteValue);
  const explanation =
    byteValue > 127
      ? `${byteValue} becomes ${signed} in signed 8-bit form because the top bit is 1 and two's complement is used.`
      : `${byteValue} stays ${signed} in signed 8-bit form because the top bit is 0.`;

  return (
    <div className="chapter-grid">
      <div className="panel">
        <p className="eyebrow">Unsigned view</p>
        <h3>All 8 bits are used for magnitude</h3>
        <div className="value-display">{byteValue}</div>
        <p className="panel-copy">
          In unsigned form, the byte {binary} means {byteValue}. Nothing is reserved for a
          negative sign.
        </p>
      </div>

      <div className="panel">
        <p className="eyebrow">Signed view</p>
        <h3>The same bits can also mean a negative value</h3>
        <div className="value-display alt">{signed}</div>
        <p className="panel-copy">{explanation}</p>
      </div>
    </div>
  );
}

export default function ChapterOne({
  byteValue,
  mosfetOn,
  onByteChange,
  onMosfetToggle,
  selectedWidth,
  onWidthChange,
}) {
  return (
    <section className="chapter" id="chapter-1">
      <div className="chapter-header">
        <p className="chapter-kicker">Chapter 1</p>
        <h2>Bits, bytes and meaning</h2>
        <p>
          This chapter explains what bit width means, how MOSFET switches create binary
          logic, why decimal and hex are only representations, and why a `char` is not just
          a character but also a small numeric storage type.
        </p>
      </div>

      <section className="chapter-section" id="chapter-1-widths">
        <SectionHeading
          eyebrow="Part A"
          title="What do 8-bit, 16-bit, 32-bit and 64-bit mean?"
          description="Choose a width and see how many bit positions, ranges and combinations it gives to the CPU."
        />
        <WidthSelector selectedWidth={selectedWidth} onWidthChange={onWidthChange} />
      </section>

      <section className="chapter-section" id="chapter-1-switch">
        <SectionHeading
          eyebrow="Hardware truth"
          title="A MOSFET turns voltage into a 1 or 0"
          description="The CPU does not start with numbers or letters. It starts with electrical states created by switches."
        />
        <MosfetPanel isOn={mosfetOn} onToggle={onMosfetToggle} />
      </section>

      <section className="chapter-section" id="chapter-1-representation">
        <SectionHeading
          eyebrow="Representation lab"
          title="221, 1101 1101 and DD are the same value"
          description="Slide the value and notice that every notation changes together because the stored byte is the real thing."
        />
        <RepresentationLab byteValue={byteValue} onByteChange={onByteChange} />
      </section>

      <section className="chapter-section" id="chapter-1-signedness">
        <SectionHeading
          eyebrow="Part B"
          title="Signed and unsigned numbers use the same bits differently"
          description="The bits stay the same. The interpretation changes depending on whether the type is signed or unsigned."
        />
        <SignednessPanel byteValue={byteValue} />
      </section>
    </section>
  );
}

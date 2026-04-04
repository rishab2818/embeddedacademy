import { useMemo } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import { formatSectionLabel } from "../utils/courseLabels";
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
        <p className="panel-copy">
          {selected.description} In real hardware this width affects how wide the CPU registers are,
          how much data the ALU can handle naturally, and how large a number can be represented
          without splitting it across several operations.
        </p>

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
          drawing is compressed so it stays readable, but the real idea is the same: more bit
          positions means more possible states and bigger natural chunks of information.
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
          it is off, it can represent a 0. Real processors combine huge numbers of these switches
          into logic gates, registers, memory cells, and data paths.
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
          stored byte. The computer never stores "decimal" or "hex" internally. Those are human
          ways of looking at the same physical bit pattern.
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
          In unsigned form, the byte {binary} means {byteValue}. Every bit contributes to
          magnitude, so the full pattern is interpreted as a non-negative quantity.
        </p>
      </div>

      <div className="panel">
        <p className="eyebrow">Signed view</p>
        <h3>The same bits can also mean a negative value</h3>
        <div className="value-display alt">{signed}</div>
        <p className="panel-copy">
          {explanation} This is one of the most important low-level lessons in computing: the bits
          do not explain themselves. The type and interpretation rules tell you what the bits mean.
        </p>
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
  chapterLabel = "Chapter 1",
  chapterNumber = "1",
}) {
  return (
    <section className="chapter" id="chapter-1">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Bits, bytes, and how meaning is built from raw hardware states</h2>
        <p>
          This chapter is the foundation for everything that follows. It starts at the physical
          level with on and off electrical states, then shows how those states become bits, bytes,
          numeric ranges, and signed or unsigned meaning. If this chapter is clear, later chapters
          about memory, pointers, buses, and processors become much easier to understand.
        </p>
      </div>

      <ChapterPrimer
        title="Before you learn programming, learn what the machine can physically store"
        items={[
          {
            title: "Bits come from hardware states",
            body: "A computer starts with physical states such as HIGH and LOW voltage. A bit is our abstract name for one of those two-state decisions.",
          },
          {
            title: "A byte is just eight bits grouped together",
            body: "Once you have eight bit positions, you can represent 256 different patterns. Everything later in software is built on top of these patterns.",
          },
          {
            title: "Representation is not storage",
            body: "Decimal, binary, and hexadecimal are human viewing systems. The stored reality is still just the bit pattern in hardware.",
          },
          {
            title: "Meaning depends on interpretation",
            body: "The same byte can mean an unsigned number, a signed number, a character code, or part of a larger value depending on how the CPU and program interpret it.",
          },
        ]}
        callout={{
          title: "Expert mental model",
          body: "When you see any value in software, ask two questions: what is the exact bit pattern, and what interpretation rule is being applied to that pattern?",
        }}
      />

      <section className="chapter-section" id="chapter-1-widths">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="What do 8-bit, 16-bit, 32-bit and 64-bit mean?"
          description="Choose a width and connect it to real CPU behavior: register size, natural arithmetic width, and the number of distinct states the hardware can represent."
        />
        <WidthSelector selectedWidth={selectedWidth} onWidthChange={onWidthChange} />
        <RecapCheckpoint
          title="Checkpoint: width is capability, not just a label"
          items={[
            "Bit width tells you how many bit positions the CPU can naturally handle in one core operation.",
            "More width means more possible states and usually a wider natural arithmetic range.",
            "Register width, ALU width, and bus width are related ideas, but not always identical in every real product.",
          ]}
          question="Can you explain why a 32-bit CPU feels different from an 8-bit CPU without saying only 'it is faster'?"
        />
        <DeepDiveBlock
          title="Why bit width matters beyond simple number range"
          summary="Open this when you want the more engineering-flavored version."
          points={[
            {
              title: "Datapath effect",
              body: "Wider registers let the CPU move and combine larger values more directly, which can reduce the number of instructions needed for one calculation.",
            },
            {
              title: "Compiler effect",
              body: "Compilers choose instructions and temporary storage based partly on the machine's natural width, so architecture influences generated code shape.",
            },
            {
              title: "Embedded tradeoff",
              body: "A wider CPU is not automatically better. Power, cost, determinism, and peripheral mix still decide whether it is the right device for a product.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-1-switch">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="A MOSFET turns voltage into a 1 or 0"
          description="The CPU does not start with numbers, text, or variables. It starts with transistor-level switching that creates stable binary states."
        />
        <MosfetPanel isOn={mosfetOn} onToggle={onMosfetToggle} />
        <RecapCheckpoint
          title="Checkpoint: hardware comes before software meaning"
          items={[
            "The transistor gives the machine a stable physical yes-or-no state.",
            "Binary logic works because these states can be detected more reliably than many tiny analog levels.",
            "All later ideas like bytes, registers, and variables are built on top of huge numbers of these switches.",
          ]}
          question="If someone asked where a logical 1 comes from physically, could you answer without mentioning decimal numbers at all?"
        />
        <DeepDiveBlock
          title="Why switching hardware scales better than analog interpretation"
          summary="This connects the transistor view to later logic design."
          points={[
            {
              title: "Noise tolerance",
              body: "Digital circuits create broad safe zones for LOW and HIGH so tiny voltage wiggles do not immediately destroy meaning.",
            },
            {
              title: "Composition",
              body: "Once one switch is reliable, many switches can be composed into gates, registers, counters, and memory cells.",
            },
            {
              title: "Engineering consequence",
              body: "This is one reason computers are fundamentally binary even when humans prefer decimal descriptions.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-1-representation">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="221, 1101 1101 and DD are the same value"
          description="Slide the value and notice that every notation changes together. The stored byte is the reality; notation is only how humans choose to describe it."
        />
        <RepresentationLab byteValue={byteValue} onByteChange={onByteChange} />
        <RecapCheckpoint
          title="Checkpoint: notation is a viewing system"
          items={[
            "Decimal, binary, and hexadecimal are different descriptions of the same stored pattern.",
            "Binary is closest to the machine's switching story, and hex is a compact way for humans to read binary-heavy values.",
            "Changing notation does not change the byte in memory.",
          ]}
          question="Could you prove that 221, 11011101, and 0xDD are the same byte without changing the stored bits?"
        />
        <DeepDiveBlock
          title="Why embedded engineers love hexadecimal"
          summary="Hex becomes more important as values get wider."
          points={[
            {
              title: "Readable grouping",
              body: "Each hex digit maps neatly to four binary bits, so long machine values stay compact without losing exactness.",
            },
            {
              title: "Debugging habit",
              body: "Addresses, registers, masks, and memory dumps are often shown in hex because it is the best balance between brevity and bit-level honesty.",
            },
            {
              title: "Mental bridge",
              body: "Strong embedded engineers can move comfortably between decimal meaning, hex notation, and binary structure.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-1-signedness">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Signed and unsigned numbers use the same bits differently"
          description="The bits stay the same, but the interpretation rule changes. This is the first step toward understanding types, overflows, and low-level debugging."
        />
        <SignednessPanel byteValue={byteValue} />
        <RecapCheckpoint
          title="Checkpoint: bits do not explain themselves"
          items={[
            "The same 8-bit pattern can mean different numbers depending on the interpretation rule.",
            "Unsigned uses all bits for magnitude, while signed interpretation usually uses two's complement rules.",
            "Type information is what tells the compiler and CPU how to read the same stored pattern.",
          ]}
          question="When a byte prints as a strange negative number, do you know whether the stored bits are wrong or only the interpretation changed?"
        />
        <DeepDiveBlock
          title="Why signedness matters so much in debugging"
          summary="This is where many subtle bugs begin."
          points={[
            {
              title: "Overflow behavior",
              body: "The same bit pattern can look fine in hex while being logically wrong in the chosen signed or unsigned interpretation.",
            },
            {
              title: "Interface bugs",
              body: "Communication packets, sensor registers, and file formats often depend on exact signedness rules. A mismatch changes meaning even when the raw byte arrived correctly.",
            },
            {
              title: "Professional habit",
              body: "When debugging low-level code, always ask for both the raw bits and the interpretation rule being applied to them.",
            },
          ]}
        />
      </section>
    </section>
  );
}

import { useMemo, useState } from "react";
import ByteMemoryStrip from "../components/ByteMemoryStrip";
import SectionHeading from "../components/SectionHeading";
import { bridgeSteps, busModes, busTradeoffs, sampleTypeOptions } from "../data/chapterEight";
import { formatAddress, toBinary, toHex } from "../utils/bitMath";
import { encodeTypedValue } from "../utils/busFlow";

const baseAddress = 0x3000;

function bitLabel(index) {
  return `b${7 - index}`;
}

function BusModeExplorer({ busMode, onBusModeChange, sample, activeByteIndex }) {
  const activeMode = busModes.find((item) => item.id === busMode) ?? busModes[0];
  const activeByte = sample.bytes[activeByteIndex] ?? sample.bytes[0];
  const visibleStream = sample.bitStream.slice(0, 24);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {busModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`chip-button ${mode.id === busMode ? "active" : ""}`}
              onClick={() => onBusModeChange(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="bus-mode-grid">
          {busModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`bus-mode-card ${mode.id === busMode ? "active" : ""}`}
              onClick={() => onBusModeChange(mode.id)}
            >
              <span>{mode.label}</span>
              <strong>{mode.headline}</strong>
              <p>{mode.detail}</p>
              <small>{mode.analogy}</small>
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>Plain-English takeaway</strong>
          <span>
            {activeMode.detail} {activeMode.practical}
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Live transfer sketch</p>
        <h3>
          {activeMode.label}: {activeMode.flowLabel}
        </h3>
        <p className="panel-copy">
          Active byte {activeByte.index + 1} carries {toHex(activeByte.value)} and the bit pattern{" "}
          {toBinary(activeByte.value, 8)}.
        </p>

        {busMode === "serial" ? (
          <div className="serial-bus-board" aria-hidden="true">
            <div className="serial-label-stack">
              <span>Clock</span>
              <span>Data</span>
            </div>

            <div className="serial-wire-stack">
              <div className="serial-clock-lane">
                {visibleStream.map((_, index) => (
                  <span
                    key={`clock-${index}`}
                    className="clock-pulse"
                    style={{ animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>

              <div className="serial-data-lane">
                {visibleStream.map((bit, index) => (
                  <div
                    key={`bit-${index}`}
                    className={`serial-bit-chip ${bit ? "on" : ""}`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="parallel-bus-board" aria-hidden="true">
            {activeByte.bits.map((bit, index) => (
              <div key={`lane-${index}`} className="parallel-lane-row">
                <span>{bitLabel(index)}</span>
                <div className={`parallel-lane-track ${bit ? "on" : ""}`}>
                  <div className={`parallel-lane-signal ${bit ? "on" : ""}`} />
                </div>
                <strong>{bit}</strong>
              </div>
            ))}
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-box">
            <span>Wiring picture</span>
            <strong>{activeMode.lanes}</strong>
          </div>
          <div className="stat-box">
            <span>Footprint</span>
            <strong>{sample.bytes.length} byte(s)</strong>
          </div>
          <div className="stat-box">
            <span>Beginner analogy</span>
            <strong>{activeMode.analogy}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeEncodingLab({ typeId, onTypeChange, rawInput, onInputChange, sample }) {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <div className="button-row">
          {sampleTypeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`chip-button ${option.id === typeId ? "active" : ""}`}
              onClick={() => onTypeChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="bus-lab-grid">
          <div className="bus-lab-card">
            <span>Choose a type</span>
            <strong>{sample.typeLabel}</strong>
            <p>{sampleTypeOptions.find((item) => item.id === typeId)?.description}</p>
          </div>

          <div className="bus-lab-card">
            <span>Enter a value</span>
            <input
              className="bus-text-input"
              type="text"
              value={rawInput}
              placeholder={sampleTypeOptions.find((item) => item.id === typeId)?.placeholder}
              onChange={(event) => onInputChange(event.target.value)}
            />
            <p>
              For <code>char</code>, you can type a letter like <code>A</code> or a number like{" "}
              <code>65</code>.
            </p>
          </div>
        </div>

        <div className="callout">
          <strong>What software thinks</strong>
          <span>{sample.humanText}</span>
        </div>

        <div className="source-card bus-source-card">
          <div className="source-line">{sample.sourceLine}</div>
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Human-facing value</span>
            <strong>{sample.valueLabel}</strong>
          </div>
          <div className="stat-box">
            <span>Memory footprint</span>
            <strong>{sample.typeSummary}</strong>
          </div>
          <div className="stat-box">
            <span>Total bits</span>
            <strong>{sample.bitCount}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Memory result</p>
        <h3>What finally sits in memory are bytes</h3>
        <p className="panel-copy">{sample.storageNote}</p>

        <ByteMemoryStrip
          bytes={sample.bytes.map((byte) => byte.value)}
          baseAddress={baseAddress}
          label="The demo writes bytes into memory starting at 0x3000"
        />

        <div className="type-byte-grid">
          {sample.bytes.map((byte) => (
            <div key={`typed-byte-${byte.index}`} className="type-byte-card">
              <span>
                {formatAddress(baseAddress + byte.index)} / byte {byte.index + 1}
              </span>
              <strong>{toHex(byte.value)}</strong>
              <small>{toBinary(byte.value, 8)}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JourneyStory({ busMode, sample, activeByteIndex, selectedBitIndex }) {
  const activeByte = sample.bytes[activeByteIndex] ?? sample.bytes[0];
  const activeBit = activeByte.bits[selectedBitIndex];
  const laneText =
    busMode === "serial"
      ? `One data line sends ${bitLabel(selectedBitIndex)} in sequence with the other bits.`
      : `Eight lines move together, and line ${bitLabel(selectedBitIndex)} is currently ${activeBit ? "HIGH" : "LOW"}.`;

  const detailMap = {
    software: sample.sourceLine,
    register: `The CPU sees raw bits. Active byte ${activeByte.index + 1} is ${toHex(activeByte.value)} = ${toBinary(activeByte.value, 8)}.`,
    bus: laneText,
    memory: `${toHex(activeByte.value)} lands at ${formatAddress(baseAddress + activeByte.index)} and keeps its bit pattern there.`,
    mosfet: `Inside the chip, MOSFET networks open and close tiny paths so the chosen bit can be stored or forwarded as ${activeBit ? "1" : "0"}.`,
    voltage: activeBit
      ? `Because ${bitLabel(selectedBitIndex)} is 1, a GPIO output could raise a MOSFET gate HIGH and switch a lamp or motor ON.`
      : `Because ${bitLabel(selectedBitIndex)} is 0, a GPIO output could keep a MOSFET gate LOW and leave the external load OFF.`,
  };

  return (
    <div className="panel">
      <div className="chapter-flow-grid">
        {bridgeSteps.map((step, index) => (
          <article key={step.id} className="chapter-flow-card">
            <span>{step.label}</span>
            <strong>{index + 1}</strong>
            <p>{step.detail}</p>
            <small>{detailMap[step.id]}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function PracticalMosfetBridge({
  busMode,
  sample,
  activeByteIndex,
  onActiveByteIndexChange,
  selectedBitIndex,
  onSelectedBitIndexChange,
}) {
  const activeByte = sample.bytes[activeByteIndex] ?? sample.bytes[0];
  const activeBit = activeByte.bits[selectedBitIndex];

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="panel-header stacked">
          <div>
            <p className="eyebrow">Follow one byte</p>
            <h3>Pick the byte and bit you want to track</h3>
          </div>
        </div>

        <div className="byte-selector-row">
          {sample.bytes.map((byte) => (
            <button
              key={`select-byte-${byte.index}`}
              type="button"
              className={`byte-select-button ${byte.index === activeByteIndex ? "active" : ""}`}
              onClick={() => onActiveByteIndexChange(byte.index)}
            >
              <span>Byte {byte.index + 1}</span>
              <strong>{toHex(byte.value)}</strong>
              <small>{formatAddress(baseAddress + byte.index)}</small>
            </button>
          ))}
        </div>

        <div className="bit-selector-grid">
          {activeByte.bits.map((bit, index) => (
            <button
              key={`select-bit-${index}`}
              type="button"
              className={`bit-select-button ${index === selectedBitIndex ? "active" : ""} ${bit ? "on" : ""}`}
              onClick={() => onSelectedBitIndexChange(index)}
            >
              <span>{bitLabel(index)}</span>
              <strong>{bit}</strong>
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>Newbie analogy</strong>
          <span>
            The CPU is writing a row of tiny yes/no switches. Memory keeps that row safe, and later a GPIO
            register can reuse one of those yes/no choices to control a real transistor.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Practical bridge</p>
        <h3>From stored bit to a real MOSFET-controlled load</h3>
        <p className="panel-copy">
          This demo uses a {busMode} bus to deliver the byte, then imagines the selected bit being copied into a
          GPIO output register.
        </p>

        <div className="practical-circuit" aria-hidden="true">
          <div className="circuit-node memory">
            <span>Memory</span>
            <strong>{toHex(activeByte.value)}</strong>
            <small>{formatAddress(baseAddress + activeByte.index)}</small>
          </div>

          <div className="circuit-arrow">
            <div className="circuit-line active">
              <div className="circuit-dot" />
            </div>
            <span>copy to GPIO</span>
          </div>

          <div className={`circuit-node gpio ${activeBit ? "on" : ""}`}>
            <span>GPIO Pin</span>
            <strong>{activeBit ? "HIGH" : "LOW"}</strong>
            <small>{bitLabel(selectedBitIndex)} = {activeBit}</small>
          </div>

          <div className="circuit-arrow">
            <div className="circuit-line active">
              <div className="circuit-dot" />
            </div>
            <span>gate voltage</span>
          </div>

          <div className={`circuit-node mosfet ${activeBit ? "on" : ""}`}>
            <span>MOSFET</span>
            <strong>{activeBit ? "Conducting" : "Blocking"}</strong>
            <small>{activeBit ? "Channel formed" : "Channel closed"}</small>
          </div>

          <div className="circuit-arrow">
            <div className="circuit-line active">
              <div className="circuit-dot" />
            </div>
            <span>load current</span>
          </div>

          <div className={`circuit-node load ${activeBit ? "on" : ""}`}>
            <span>LED / Motor</span>
            <strong>{activeBit ? "ON" : "OFF"}</strong>
            <small>{activeBit ? "Voltage reaches the load" : "No drive voltage yet"}</small>
          </div>
        </div>

        <div className="explanation-strip">
          <div>
            <strong>Software view</strong>
            <span>
              One bit in a register changes from 0 to 1 or 1 to 0.
            </span>
          </div>
          <div>
            <strong>Electrical view</strong>
            <span>
              That logic state becomes a LOW or HIGH voltage on a real pin and can switch power with a MOSFET.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeoffPanel() {
  return (
    <div className="panel">
      <div className="tradeoff-grid">
        {busTradeoffs.map((tradeoff) => (
          <article key={tradeoff.title} className="tradeoff-card">
            <span>{tradeoff.title}</span>
            <div className="tradeoff-columns">
              <div>
                <strong>Serial</strong>
                <p>{tradeoff.serial}</p>
              </div>
              <div>
                <strong>Parallel</strong>
                <p>{tradeoff.parallel}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ChapterEight({ chapterLabel = "Chapter 1.1" }) {
  const [busMode, setBusMode] = useState("serial");
  const [typeId, setTypeId] = useState("char");
  const [rawInput, setRawInput] = useState("A");
  const [activeByteIndex, setActiveByteIndex] = useState(0);
  const [selectedBitIndex, setSelectedBitIndex] = useState(0);

  const sample = useMemo(() => encodeTypedValue(typeId, rawInput), [typeId, rawInput]);
  const selectedType = sampleTypeOptions.find((item) => item.id === typeId) ?? sampleTypeOptions[0];

  function handleTypeChange(nextTypeId) {
    const nextType = sampleTypeOptions.find((item) => item.id === nextTypeId) ?? sampleTypeOptions[0];
    setTypeId(nextType.id);
    setRawInput(nextType.defaultValue);
    setActiveByteIndex(0);
    setSelectedBitIndex(0);
  }

  function handleInputChange(nextValue) {
    setRawInput(nextValue);
    setActiveByteIndex(0);
    setSelectedBitIndex(0);
  }

  function handleByteChange(nextIndex) {
    setActiveByteIndex(nextIndex);
    setSelectedBitIndex(0);
  }

  return (
    <section className="chapter" id="chapter-8">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Serial and parallel buses, from software values to real voltage</h2>
        <p>
          This chapter explains how a value like <code>{selectedType.codeLabel}</code>{" "}
          <code>{sample.valueLabel}</code> becomes bytes, travels through registers and buses,
          lands in memory, and can finally help control a MOSFET that switches a real load. The
          goal is to make the journey feel visual, playful, and friendly even if you are new to
          both coding and electronics.
        </p>
      </div>

      <section className="chapter-section" id="chapter-8-buses">
        <SectionHeading
          eyebrow="Part A"
          title="Serial bus vs parallel bus"
          description="Both buses move the same bits. The big difference is whether they travel one after another on fewer wires or many together on more wires."
        />
        <BusModeExplorer
          busMode={busMode}
          onBusModeChange={setBusMode}
          sample={sample}
          activeByteIndex={Math.min(activeByteIndex, sample.bytes.length - 1)}
        />
      </section>

      <section className="chapter-section" id="chapter-8-types">
        <SectionHeading
          eyebrow="Part B"
          title="What happens when you write char, int, or float?"
          description="Choose a type, enter a value, and watch the software meaning collapse into raw bytes that hardware can actually move."
        />
        <TypeEncodingLab
          typeId={typeId}
          onTypeChange={handleTypeChange}
          rawInput={rawInput}
          onInputChange={handleInputChange}
          sample={sample}
        />
      </section>

      <section className="chapter-section" id="chapter-8-journey">
        <SectionHeading
          eyebrow="Part C"
          title="Follow the whole journey: value -> register -> bus -> memory -> MOSFET -> voltage"
          description="This is the bridge between software and electronics. Numbers do not magically fly into chips; they move as HIGH and LOW electrical states."
        />
        <JourneyStory
          busMode={busMode}
          sample={sample}
          activeByteIndex={Math.min(activeByteIndex, sample.bytes.length - 1)}
          selectedBitIndex={selectedBitIndex}
        />
        <PracticalMosfetBridge
          busMode={busMode}
          sample={sample}
          activeByteIndex={Math.min(activeByteIndex, sample.bytes.length - 1)}
          onActiveByteIndexChange={handleByteChange}
          selectedBitIndex={selectedBitIndex}
          onSelectedBitIndexChange={setSelectedBitIndex}
        />
      </section>

      <section className="chapter-section" id="chapter-8-tradeoffs">
        <SectionHeading
          eyebrow="Part D"
          title="Advantages and disadvantages"
          description="Neither bus is automatically better. Designers choose based on wires, timing, distance, speed, simplicity, and cost."
        />
        <TradeoffPanel />
      </section>
    </section>
  );
}

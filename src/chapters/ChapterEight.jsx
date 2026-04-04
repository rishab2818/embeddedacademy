import { useMemo, useState } from "react";
import ByteMemoryStrip from "../components/ByteMemoryStrip";
import ChapterPrimer from "../components/ChapterPrimer";
import SectionHeading from "../components/SectionHeading";
import { bridgeSteps, busModes, busTradeoffs, sampleTypeOptions } from "../data/chapterEight";
import { formatAddress, toBinary, toHex } from "../utils/bitMath";
import { encodeTypedValue } from "../utils/busFlow";
import { formatSectionLabel } from "../utils/courseLabels";

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
            The deeper lesson is that buses are not abstract arrows in diagrams. They are timed
            electrical pathways that physically move bit patterns between blocks.
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
          <span>
            {sample.humanText} The bus, memory, and registers do not know "int" or "float" in the
            human sense. They only move and store the encoded bytes.
          </span>
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
            register can reuse one of those yes/no choices to control a real transistor. This is the
            bridge between software symbols and physical voltage behavior.
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

export default function ChapterEight({ chapterLabel = "Chapter 7", chapterNumber = "7" }) {
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
    <section className="chapter" id="chapter-7">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Serial and parallel buses, from software meaning to physical signal movement</h2>
        <p>
          This chapter explains how a value like <code>{selectedType.codeLabel}</code>{" "}
          <code>{sample.valueLabel}</code> becomes bytes, travels through registers and buses,
          lands in memory, and can finally help control a MOSFET that switches a real load. The
          goal is to make the whole trip visible enough that software and electronics stop feeling
          like separate worlds.
        </p>
      </div>

      <ChapterPrimer
        title="Why this chapter matters so much"
        items={[
          {
            title: "Software values do not teleport",
            body: "A value written in source code becomes bytes in registers and memory, then those bytes move as timed electrical signals.",
          },
          {
            title: "Buses are the roads of a computer",
            body: "CPU cores, memory blocks, peripherals, and GPIO logic all need pathways for information movement. A bus is that pathway.",
          },
          {
            title: "Encoding comes before transport",
            body: "The machine must first decide what byte pattern represents the value. Only then can a serial or parallel bus move it.",
          },
          {
            title: "Voltage is the final physical reality",
            body: "At the end of the chain, all of this computation can become a pin voltage that drives a transistor, LED, motor, sensor interface, or communication line.",
          },
        ]}
        callout={{
          title: "Expert habit",
          body: "Whenever you study a subsystem, ask: what is the value, how is it encoded, where is it stored, how is it transported, and what physical behavior can it eventually cause?",
        }}
      />

      <section className="chapter-section" id="chapter-7-buses">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Serial bus vs parallel bus"
          description="Both buses move the same information. The difference is whether the bits travel one after another on fewer wires or together on many wires in the same timing window."
        />
        <BusModeExplorer
          busMode={busMode}
          onBusModeChange={setBusMode}
          sample={sample}
          activeByteIndex={Math.min(activeByteIndex, sample.bytes.length - 1)}
        />
      </section>

      <section className="chapter-section" id="chapter-7-types">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="What happens when you write char, int, or float?"
          description="Choose a type, enter a value, and watch software meaning collapse into the raw encoded bytes that hardware can actually transport and store."
        />
        <TypeEncodingLab
          typeId={typeId}
          onTypeChange={handleTypeChange}
          rawInput={rawInput}
          onInputChange={handleInputChange}
          sample={sample}
        />
      </section>

      <section className="chapter-section" id="chapter-7-journey">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Follow the whole journey: value -> register -> bus -> memory -> MOSFET -> voltage"
          description="This is the bridge between software and electronics. Numbers do not magically fly into chips; they move as timed HIGH and LOW electrical states."
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

      <section className="chapter-section" id="chapter-7-tradeoffs">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Advantages and disadvantages"
          description="Neither bus is automatically better. Designers choose based on timing, distance, pin count, routing complexity, bandwidth, simplicity, and cost."
        />
        <TradeoffPanel />
      </section>
    </section>
  );
}

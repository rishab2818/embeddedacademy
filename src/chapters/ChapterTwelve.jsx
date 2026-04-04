import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import FancySelect from "../components/FancySelect";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import {
  binaryReasonCards,
  busOperations,
  compileTargets,
  controllerProfiles,
} from "../data/chapterTwelve";
import { formatSectionLabel } from "../utils/courseLabels";
import {
  buildBinaryReasonScene,
  buildBusScene,
  buildCompileStages,
  buildWidthScene,
} from "../utils/chapterTwelve";

function formatAddressLabel(address) {
  return `0x${address.toString(16).toUpperCase().padStart(4, "0")}`;
}
function ControllerSelector({ controllerId, onChange, title = "Choose a controller view" }) {
  return (
    <div className="button-row controller-chip-row" role="tablist" aria-label={title}>
      {controllerProfiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          className={`chip-button ${profile.id === controllerId ? "active" : ""}`}
          onClick={() => onChange(profile.id)}
        >
          {profile.label}
        </button>
      ))}
    </div>
  );
}

function WidthMeaningLab({ controllerId, onControllerChange }) {
  const [pulseIndex, setPulseIndex] = useState(0);
  const scene = useMemo(() => buildWidthScene(controllerId), [controllerId]);
  const { profile } = scene;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseIndex((current) => (current + 1) % scene.registerCells.length);
    }, 420);

    return () => window.clearInterval(timer);
  }, [scene.registerCells.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <p className="eyebrow">Width explorer</p>
        <h3>What 8-bit, 16-bit, and 32-bit really mean</h3>
        <ControllerSelector controllerId={controllerId} onChange={onControllerChange} />

        <div className="callout">
          <strong>{profile.family}</strong>
          <span>{profile.widthMeaning}</span>
        </div>

        <div className="width-register-card">
          <div className="width-register-head">
            <strong>Natural working width</strong>
            <span>
              {profile.bitWidth} bits = {scene.byteCount} byte{scene.byteCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="width-lane-grid">
            {scene.registerCells.map((cell, index) => (
              <div
                key={`${profile.id}-${cell.id}`}
                className={`width-lane-cell group-${cell.group} ${index === pulseIndex ? "focus" : ""}`}
              >
                <small>{cell.label}</small>
                <strong>{index === pulseIndex ? "1" : "0"}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="width-summary-grid">
          <div className="stat-box">
            <span>Core width</span>
            <strong>{profile.bitWidth}-bit</strong>
          </div>
          <div className="stat-box">
            <span>Data bus</span>
            <strong>{profile.dataBusBits} bits</strong>
          </div>
          <div className="stat-box">
            <span>Instruction path</span>
            <strong>{profile.instructionBusBits} bits</strong>
          </div>
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">Read it correctly</p>
        <h3>Bit width is about the CPU's natural chunk size, not the whole story</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>What it usually means</span>
            <p>
              It tells you the natural width of the ALU, registers, and the size of data the CPU can
              handle most comfortably in one main step.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>What it does not mean</span>
            <p>{profile.widthWarning}</p>
          </div>
          <div className="teaching-step-card">
            <span>Address bus relation</span>
            <p>
              The address bus says <em>where</em> to go. The data bus says <em>what value</em> is moving.
              A controller can be 8-bit and still use more than 8 address lines.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Practical feel</span>
            <p>
              Narrow controllers often take more steps for big numbers. Wider controllers can move and
              calculate bigger values more directly.
            </p>
          </div>
        </div>

        <div className="callout">
          <strong>Quick memory hook</strong>
          <span>
            Think of the bit width as the width of the CPU's hands. Bigger hands can carry bigger chunks
            naturally, but the whole building still also needs hallways, doors, and room numbers.
          </span>
        </div>
      </div>
    </div>
  );
}

function BusTransactionLab({ controllerId, onControllerChange }) {
  const [operationId, setOperationId] = useState(busOperations[0].id);
  const [addressIndex, setAddressIndex] = useState(0);
  const [writeValue, setWriteValue] = useState(85);
  const [autoPlay, setAutoPlay] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const scene = useMemo(
    () => buildBusScene({ controllerId, operationId, addressIndex, writeValue }),
    [addressIndex, controllerId, operationId, writeValue]
  );

  useEffect(() => {
    setAddressIndex(0);
  }, [controllerId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % scene.stepCards.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [autoPlay, scene.stepCards.length]);

  const selectedAddress = scene.profile.memoryCells[scene.selectedIndex];
  const maxWriteValue = Math.min(4095, 2 ** Math.min(scene.profile.dataBusBits, 16) - 1);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Bus transaction animator</p>
            <h3>Address bus chooses the location. Data bus moves the value.</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <ControllerSelector controllerId={controllerId} onChange={onControllerChange} />

        <div className="bus-control-grid">
          <div className="control-row">
            <label>Transaction type</label>
            <div className="button-row">
              {busOperations.map((operation) => (
                <button
                  key={operation.id}
                  type="button"
                  className={`chip-button ${operation.id === operationId ? "active" : ""}`}
                  onClick={() => setOperationId(operation.id)}
                >
                  {operation.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <label>Target location</label>
            <FancySelect
              ariaLabel="Choose bus target location"
              value={addressIndex}
              onChange={(value) => setAddressIndex(Number(value))}
              options={scene.profile.memoryCells.map((cell, index) => ({
                label: `${cell.label} (${formatAddressLabel(cell.address)})`,
                value: index,
              }))}
            />
          </div>
        </div>

        {operationId === "write" ? (
          <div className="control-row">
            <label htmlFor="write-value">
              Value to write: <strong>{scene.dataHex}</strong>
            </label>
            <div className="slider-row">
              <input
                id="write-value"
                type="range"
                min="0"
                max={maxWriteValue}
                step="1"
                value={writeValue}
                onChange={(event) => setWriteValue(Number(event.target.value))}
              />
              <div className="number-input bitwise-number">{writeValue}</div>
            </div>
          </div>
        ) : null}

        <div className="bus-wire-card">
          <div className="bus-wire-row address">
            <div className="bus-wire-label">
              <span>Address bus</span>
              <strong>{scene.addressBinary}</strong>
            </div>
            <div className="bus-wire-bits">
              {scene.addressBits.map((bit) => (
                <div
                  key={`addr-${bit.id}`}
                  className={`bus-bit-cell ${bit.value === "1" ? "on" : ""} ${stepIndex >= 1 ? "live" : ""}`}
                >
                  <small>{bit.label}</small>
                  <strong>{bit.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bus-wire-arrow">
            <span>{scene.directionLabel}</span>
            <p>{scene.transferSummary}</p>
          </div>

          <div className="bus-wire-row data">
            <div className="bus-wire-label">
              <span>Data bus</span>
              <strong>{scene.dataHex}</strong>
            </div>
            <div className="bus-wire-bits">
              {scene.dataBits.map((bit) => (
                <div
                  key={`data-${bit.id}`}
                  className={`bus-bit-cell ${bit.value === "1" ? "on" : ""} ${stepIndex >= 2 ? "live" : ""}`}
                >
                  <small>{bit.label}</small>
                  <strong>{bit.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">What is happening right now</p>
        <h3>{selectedAddress.label}</h3>
        <p className="panel-copy">{selectedAddress.note}</p>

        <div className="bus-step-grid">
          {scene.stepCards.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`bus-step-card ${index === stepIndex ? "active" : ""}`}
              onClick={() => setStepIndex(index)}
            >
              <span>{step.label}</span>
              <p>{step.detail}</p>
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>{scene.profile.chapterTitle}</strong>
          <span>{scene.profile.addressNote} {scene.profile.busLook}</span>
        </div>
      </div>
    </div>
  );
}

function PicVsStmLab({ controllerId, onControllerChange }) {
  const profile = useMemo(() => controllerProfiles.find((item) => item.id === controllerId) ?? controllerProfiles[0], [controllerId]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <p className="eyebrow">Architecture comparison</p>
        <h3>How the bus story looks in PIC and STM families</h3>
        <ControllerSelector controllerId={controllerId} onChange={onControllerChange} />

        <div className="architecture-flow-grid">
          <div className="architecture-flow-card program">
            <span>Instruction side</span>
            <strong>{profile.instructionBusBits}-bit path</strong>
            <p>{profile.instructionFetchNote}</p>
          </div>
          <div className="architecture-flow-card cpu">
            <span>CPU core</span>
            <strong>{profile.bitWidth}-bit core</strong>
            <p>{profile.registerLabel}</p>
          </div>
          <div className="architecture-flow-card data">
            <span>Data side</span>
            <strong>{profile.dataBusBits}-bit path</strong>
            <p>{profile.busLook}</p>
          </div>
        </div>

        <div className="callout">
          <strong>{profile.architecture}</strong>
          <span>
            {profile.label.startsWith("STM")
              ? "STM32 style parts strongly emphasize memory-mapped peripherals and explicit load/store instructions on a 32-bit core."
              : "PIC style parts make the split between instruction fetch and data movement easier to notice, especially in the smaller families."}
          </span>
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">Important facts</p>
        <h3>Different families solve the same problem in different shapes</h3>

        <div className="architecture-fact-grid">
          {profile.busFacts.map((fact) => (
            <div key={fact} className="architecture-fact-card">
              {fact}
            </div>
          ))}
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>PIC16 feel</span>
            <p>
              Small, efficient, and byte-oriented. Great for seeing very directly how registers and named
              peripheral bytes work.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>PIC24 feel</span>
            <p>
              Wider data path, more CPU-like register model, and still a very visible separation between
              instruction fetch and data work.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>STM32 feel</span>
            <p>
              Wider address space, 32-bit registers, load/store programming style, and peripherals that look
              like memory addresses in the system map.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Main takeaway</span>
            <p>
              The bus names stay the same across families, but the width, organization, and programming model
              change how the system feels to the engineer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompilationLab() {
  const [targetId, setTargetId] = useState(compileTargets[2].id);
  const [stageIndex, setStageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const stages = useMemo(() => buildCompileStages(targetId), [targetId]);
  const activeStage = stages[stageIndex] ?? stages[0];
  const activeTarget = compileTargets.find((item) => item.id === targetId) ?? compileTargets[0];

  useEffect(() => {
    setStageIndex(0);
  }, [targetId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % stages.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, [autoPlay, stages.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Compilation theater</p>
            <h3>From idea to source to object to final firmware</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto explain" : "Manual"}
          </button>
        </div>

        <div className="button-row controller-chip-row">
          {compileTargets.map((target) => (
            <button
              key={target.id}
              type="button"
              className={`chip-button ${target.id === targetId ? "active" : ""}`}
              onClick={() => setTargetId(target.id)}
            >
              {target.label}
            </button>
          ))}
        </div>

        <div className="compile-stage-grid">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className={`compile-stage-card ${index === stageIndex ? "active" : ""}`}
              onClick={() => setStageIndex(index)}
            >
              <span>{stage.label}</span>
              <strong>{stage.title}</strong>
            </button>
          ))}
        </div>

        <div className="source-card compile-output-card">
          {activeStage.lines.map((line) => (
            <div key={`${activeStage.id}-${line}`} className="source-line">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">Why this stage exists</p>
        <h3>{activeStage.title}</h3>
        <p className="panel-copy">{activeStage.why}</p>

        <div className="callout">
          <strong>{activeTarget.toolchain}</strong>
          <span>{activeStage.note}</span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Human reasoning</span>
            <p>
              Early stages protect humans from raw machine detail. That is why we start with requirements,
              names, functions, and readable control flow.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Compiler reasoning</span>
            <p>
              The compiler must preserve meaning while changing form. It is not just translating words; it is
              also checking correctness and choosing efficient machine strategies.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Assembler and linker logic</span>
            <p>
              The assembler turns symbolic instructions into numbers, and the linker decides where every piece
              finally lives in memory.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>End state</span>
            <p>
              The final output is a binary image for the chosen target. The CPU never reads the original source;
              it only fetches the stored instruction bits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BinaryReasonLab() {
  const [voltage, setVoltage] = useState(0.8);
  const [noise, setNoise] = useState(0.2);
  const scene = useMemo(() => buildBinaryReasonScene(voltage, noise), [voltage, noise]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <p className="eyebrow">Why 1 and 0</p>
        <h3>Binary works because real wires are noisy and switches like broad safe zones</h3>

        <div className="control-row">
          <label htmlFor="voltage-slider">Measured wire voltage: {scene.voltage.toFixed(2)} V</label>
          <div className="slider-row">
            <input
              id="voltage-slider"
              type="range"
              min="0"
              max="5"
              step="0.05"
              value={voltage}
              onChange={(event) => setVoltage(Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{scene.voltage.toFixed(2)}V</div>
          </div>
        </div>

        <div className="control-row">
          <label htmlFor="noise-slider">Possible noise / wiggle: ±{scene.noise.toFixed(2)} V</label>
          <div className="slider-row">
            <input
              id="noise-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={noise}
              onChange={(event) => setNoise(Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{scene.noise.toFixed(2)}V</div>
          </div>
        </div>

        <div className="voltage-meter-shell">
          <div className="voltage-meter-scale">
            <span>0V</span>
            <span>5V</span>
          </div>
          <div className="voltage-meter binary">
            <div className="voltage-zone low">LOW safe zone</div>
            <div className="voltage-zone uncertain">middle uncertainty</div>
            <div className="voltage-zone high">HIGH safe zone</div>
            <div
              className="voltage-range-indicator"
              style={{ left: `${(scene.minSeen / 5) * 100}%`, width: `${((scene.maxSeen - scene.minSeen) / 5) * 100}%` }}
            />
            <div className="voltage-pointer" style={{ left: `${(scene.voltage / 5) * 100}%` }} />
          </div>
        </div>

        <div className="binary-compare-grid">
          <div className={`binary-compare-card ${scene.binarySafe ? "good" : "warn"}`}>
            <span>Binary readout</span>
            <strong>{scene.binaryState}</strong>
            <p>{scene.binaryNarrative}</p>
          </div>
          <div className={`binary-compare-card ${scene.decimalSafe ? "good" : "warn"}`}>
            <span>Hypothetical 10-level readout</span>
            <strong>{scene.decimalState}</strong>
            <p>{scene.decimalNarrative}</p>
          </div>
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">Why not many symbols?</p>
        <h3>Two symbols are enough when the hardware is built from switches</h3>

        <div className="teaching-step-grid compact">
          {binaryReasonCards.map((card) => (
            <div key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>Short honest answer</strong>
          <span>
            Computers use 1s and 0s because transistor circuits can distinguish two broad states much more
            reliably than many tiny analog levels. Binary is not magical; it is practical, stable, and scalable.
          </span>
        </div>
      </div>
    </div>
  );
}

function BusMindsetPanel() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel bus-panel-stack">
        <p className="eyebrow">How to think about this chapter</p>
        <h3>The system is a city of locations, payloads, widths, and translations</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Locations are not values</span>
            <p>
              An address identifies a destination in the memory map. The destination might be flash,
              RAM, or a peripheral register, but the address itself is not the payload being moved.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Widths shape efficiency</span>
            <p>
              Controller width affects how naturally the CPU handles values, instruction fetches, and
              bus movement. It changes feel and efficiency, not the existence of the basic concepts.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Families have accents</span>
            <p>
              PIC and STM32 parts solve similar problems with different architectural flavors. Learn
              the shared ideas first, then notice each family's accent.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Toolchains finish the picture</span>
            <p>
              The buses and widths matter because the compiler, assembler, and linker are preparing a
              binary image that must fit the chosen architecture correctly.
            </p>
          </div>
        </div>
      </div>

      <div className="panel bus-panel-stack">
        <p className="eyebrow">Common beginner traps</p>
        <h3>These four confusions create most bus-level misunderstanding</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Trap 1</span>
            <p>
              Thinking that because an address bus has many lines, it must also carry the sensor value
              itself. It does not. It points to the source or destination.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Trap 2</span>
            <p>
              Assuming 32-bit automatically means "better in every way." Width is only one part of
              overall design; real-time demands, power, cost, and peripherals still matter.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Trap 3</span>
            <p>
              Treating compilation as word replacement. The toolchain is deciding legality, layout,
              relocation, and target-specific instruction form.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Trap 4</span>
            <p>
              Treating binary as a classroom trick. Binary wins because electrical hardware can detect
              two broad stable states far more reliably than many finely spaced analog levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterTwelve({ chapterLabel = "Chapter 11", chapterNumber = "11" }) {
  const [controllerId, setControllerId] = useState(controllerProfiles[2].id);

  return (
    <section className="chapter" id="chapter-11">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Address buses, data buses, bit width, and compilation</h2>
        <p>
          This chapter explains how a CPU chooses locations with the address bus, moves values with the
          data bus, why 8-bit, 16-bit, and 32-bit controllers feel different, how PIC and STM families
          organize those ideas, and how source code is finally compiled down into stored binary. These
          topics are the bridge between software structure and the physical machine pathways that carry
          instructions and data at runtime.
        </p>
      </div>

      <ChapterPrimer
        title="Three anchor ideas before the details"
        items={[
          {
            title: "Address bus",
            body: "The address bus answers: where should the transfer happen?",
          },
          {
            title: "Data bus",
            body: "The data bus answers: what value is moving during that transfer?",
          },
          {
            title: "Bit width",
            body: "8-bit, 16-bit, or 32-bit mainly describe the CPU's natural working size, not the whole story of the entire chip.",
          },
          {
            title: "Compilation",
            body: "Compilation is the process of turning human-friendly source into executable binary for a specific target device.",
          },
        ]}
        callout={{
          title: "Simple memory hook",
          body: "Address is the destination. Data is the payload. Bit width affects the size of the road. Compilation is how the payload-producing instructions are created in the first place.",
        }}
      />

      <BusMindsetPanel />

      <section className="chapter-section" id="chapter-11-widths">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="What 8-bit, 16-bit, and 32-bit mean"
          description="Start with the CPU's natural working width so the bus discussion has a clear foundation and the later architecture comparisons make intuitive sense."
        />
        <WidthMeaningLab controllerId={controllerId} onControllerChange={setControllerId} />
        <RecapCheckpoint
          title="Checkpoint: width shapes the CPU's natural chunk"
          items={[
            "Bit width mainly describes the CPU's natural working size, not every path in the whole chip.",
            "Wider controllers handle larger chunks more directly, but they still live inside broader system tradeoffs.",
            "Instruction width, data width, and address reach can relate to core width without being identical.",
          ]}
          question="Could you explain why a 32-bit controller still does not tell you everything about its bus organization?"
        />
      </section>

      <section className="chapter-section" id="chapter-11-buses">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Address bus and data bus"
          description="The address bus says where the transfer should happen. The data bus carries the actual value that is being read or written, and the two must never be mentally swapped."
        />
        <InteractionGuide
          title="How to read the bus transaction animator"
          items={[
            {
              title: "Start with the address path",
              body: "The address bus chooses the location first, because the machine needs a destination before it can move a payload.",
            },
            {
              title: "Then watch the data path",
              body: "The data bus shows the actual value being moved during the transaction.",
            },
            {
              title: "Use the step cards",
              body: "They break one bus transfer into an ordered sequence instead of a flat hardware picture.",
            },
          ]}
        />
        <BusTransactionLab controllerId={controllerId} onControllerChange={setControllerId} />
        <RecapCheckpoint
          title="Checkpoint: address means where, data means what"
          items={[
            "Address and data are different roles even when they appear in the same transfer.",
            "The address bus names the source or destination location.",
            "The data bus carries the payload value being read or written.",
          ]}
          question="If a transfer fails, do you know how to tell whether the wrong part was the chosen location or the payload itself?"
        />
        <DeepDiveBlock
          title="Why bus literacy matters beyond vocabulary"
          summary="This is where software meets the hardware transport layer."
          points={[
            {
              title: "Memory-mapped peripherals",
              body: "Many device drivers are really bus transactions targeting special addresses rather than ordinary RAM.",
            },
            {
              title: "Throughput and timing",
              body: "Bus width and organization affect how naturally values move and therefore influence runtime behavior.",
            },
            {
              title: "Debugging clarity",
              body: "A lot of low-level confusion disappears once engineers describe transfers accurately as location selection plus payload movement.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-11-pic-stm">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="How it looks in PIC and STM"
          description="Compare the narrow PIC16 style, the wider PIC24 style, and the STM32 Cortex-M style so the same bus words become family-specific mental pictures without losing the shared fundamentals."
        />
        <PicVsStmLab controllerId={controllerId} onControllerChange={setControllerId} />
        <RecapCheckpoint
          title="Checkpoint: device families speak with different accents"
          items={[
            "PIC and STM families still share the same broad concepts of instruction flow, data movement, and memory-mapped behavior.",
            "What changes is the width, organization, and programming feel of those same ideas.",
            "Learning the common foundation first makes vendor-specific details far easier to absorb.",
          ]}
          question="Could you compare two controller families without losing the shared bus ideas underneath them?"
        />
      </section>

      <section className="chapter-section" id="chapter-11-compilation">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Compilation and conversion to binary"
          description="Follow the full path from requirement to source to compiler decisions to object code, linked firmware image, and stored 1s and 0s for one concrete target."
        />
        <InteractionGuide
          title="How to read the compilation theater"
          items={[
            {
              title: "Treat each stage as a transformation",
              body: "Each stage changes the form of the program while trying to preserve its intended behavior.",
            },
            {
              title: "Ask why the stage exists",
              body: "The toolchain is not only translating words. It is also checking legality, arranging layout, and targeting a specific architecture.",
            },
            {
              title: "Keep the target machine in mind",
              body: "The final binary only makes sense for the chosen CPU, memory model, and linker layout.",
            },
          ]}
        />
        <CompilationLab />
        <RecapCheckpoint
          title="Checkpoint: compilation is a real pipeline"
          items={[
            "Source code is transformed through several stages before it becomes a final firmware image.",
            "Assembler and linker are essential parts of the story, not side notes.",
            "The CPU finally executes stored instruction bits rather than the source text humans wrote.",
          ]}
          question="Could you explain what the linker does without reducing it to only 'combining files'?"
        />
        <DeepDiveBlock
          title="Why toolchain literacy matters in embedded projects"
          summary="This is where code structure meets memory layout and target architecture."
          points={[
            {
              title: "Layout control",
              body: "Sections, symbols, and addresses matter because the final image must fit the target's flash, RAM, and startup expectations correctly.",
            },
            {
              title: "Architecture dependence",
              body: "The same source can produce very different binaries on different processors because the target instruction set and memory rules changed.",
            },
            {
              title: "Debugging payoff",
              body: "When builds behave strangely, boot code fails, or optimized binaries surprise you, toolchain understanding becomes a real advantage.",
            },
          ]}
        />
        <DeepDiveBlock
          title="What linker scripts and memory maps are really deciding"
          summary="This is one of the most practical expert bridges in the chapter."
          points={[
            {
              title: "What lives in flash",
              body: "Executable code, constants, vector tables, and read-only data are usually assigned to specific flash regions so the CPU can fetch them correctly at reset and during runtime.",
            },
            {
              title: "What must live in RAM",
              body: "Mutable data, stack space, heap space, buffers, and sometimes DMA-visible regions must be placed where the processor and peripherals can read and write them safely.",
            },
            {
              title: "Why startup code exists",
              body: "The linker and startup code cooperate: one decides where sections belong, and the other copies or zero-initializes the right data so the runtime memory state matches the program's expectations.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-11-binary">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="Why the machine finally uses only 1 and 0"
          description="Use a live voltage-and-noise demo to see why binary logic is more reliable than trying to distinguish many tiny signal levels on real physical wires."
        />
        <BinaryReasonLab />
        <RecapCheckpoint
          title="Checkpoint: binary wins because hardware needs safe margins"
          items={[
            "Real wires are noisy, so broad HIGH and LOW zones are more reliable than many small analog levels.",
            "Binary is a practical engineering decision rooted in switching hardware.",
            "That physical reality is why later buses, memories, and instructions all reduce back to 1s and 0s.",
          ]}
          question="Could you defend binary from a circuit-behavior point of view rather than only from history or tradition?"
        />
        <DeepDiveBlock
          title="Why binary thinking still matters in advanced systems"
          summary="Even very powerful processors are still built on this electrical bargain."
          points={[
            {
              title: "Abstraction keeps stacking",
              body: "Operating systems, compilers, packet formats, image files, and AI models all look high level, but underneath they still reduce to stored and transported binary states.",
            },
            {
              title: "Signal integrity never disappears",
              body: "As systems get faster, engineers worry even more about margins, skew, interference, and timing because the hardware still has to distinguish valid logic levels reliably.",
            },
            {
              title: "Debuggers eventually hit physics",
              body: "A beautiful software design still fails if the board, clocking, or signaling conditions stop the machine from recognizing those final binary states correctly.",
            },
          ]}
        />
      </section>
    </section>
  );
}




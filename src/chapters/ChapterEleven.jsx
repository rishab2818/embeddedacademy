import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import FancySelect from "../components/FancySelect";
import SectionHeading from "../components/SectionHeading";
import {
  bitwiseOperators,
  bitwiseTypes,
  codeFocuses,
  cycleStages,
  machineFieldLabels,
  modeCodeOptions,
} from "../data/chapterEleven";
import { formatSectionLabel } from "../utils/courseLabels";
import {
  buildAssemblyInstructions,
  buildBitwiseScene,
  buildCycleCards,
  buildProgramState,
  describeCodeFocus,
  getCodeLines,
} from "../utils/chapterEleven";

function BitwiseLab() {
  const [typeId, setTypeId] = useState(bitwiseTypes[0].id);
  const [operatorId, setOperatorId] = useState(bitwiseOperators[0].id);
  const [leftValue, setLeftValue] = useState(bitwiseTypes[0].defaultLeft);
  const [rightValue, setRightValue] = useState(bitwiseTypes[0].defaultRight);
  const [pulseIndex, setPulseIndex] = useState(0);

  const selectedType = useMemo(
    () => bitwiseTypes.find((item) => item.id === typeId) ?? bitwiseTypes[0],
    [typeId]
  );
  const selectedOperator = useMemo(
    () => bitwiseOperators.find((item) => item.id === operatorId) ?? bitwiseOperators[0],
    [operatorId]
  );

  useEffect(() => {
    setLeftValue(selectedType.defaultLeft);
    setRightValue(selectedType.defaultRight);
  }, [selectedType]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseIndex((current) => (current + 1) % selectedType.width);
    }, 800);

    return () => window.clearInterval(timer);
  }, [selectedType.width]);

  const scene = useMemo(
    () =>
      buildBitwiseScene({
        typeId,
        operatorId,
        leftValue,
        rightValue,
      }),
    [leftValue, operatorId, rightValue, typeId]
  );

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel coding-panel-stack">
        <p className="eyebrow">Interactive bit lab</p>
        <h3>Touch the bits before touching full code</h3>

        <div className="coding-control-grid bitwise-controls">
          <div className="control-row">
            <label>Data type</label>
            <FancySelect
              ariaLabel="Choose a data type"
              value={typeId}
              onChange={setTypeId}
              options={bitwiseTypes.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>Bitwise operation</label>
            <FancySelect
              ariaLabel="Choose a bitwise operator"
              value={operatorId}
              onChange={setOperatorId}
              options={bitwiseOperators.map((item) => ({ label: `${item.label} (${item.symbol})`, value: item.id }))}
            />
          </div>
        </div>

        <div className="control-row">
          <label htmlFor="bitwise-left">
            Left value: <strong>{scene.leftLabel}</strong>
          </label>
          <div className="slider-row">
            <input
              id="bitwise-left"
              type="range"
              min={selectedType.min}
              max={selectedType.max}
              step="1"
              value={leftValue}
              onChange={(event) => setLeftValue(Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{leftValue}</div>
          </div>
        </div>

        {selectedOperator.needsRightOperand ? (
          <div className="control-row">
            <label htmlFor="bitwise-right">
              {selectedOperator.id === "lshift" || selectedOperator.id === "rshift"
                ? `Shift amount: ${scene.shiftAmount}`
                : `Right value: ${scene.rightLabel}`}
            </label>
            <div className="slider-row">
              <input
                id="bitwise-right"
                type="range"
                min={selectedOperator.id === "lshift" || selectedOperator.id === "rshift" ? 0 : selectedType.min}
                max={selectedOperator.id === "lshift" || selectedOperator.id === "rshift" ? 7 : selectedType.max}
                step="1"
                value={rightValue}
                onChange={(event) => setRightValue(Number(event.target.value))}
              />
              <div className="number-input bitwise-number">{selectedOperator.id === "lshift" || selectedOperator.id === "rshift" ? scene.shiftAmount : rightValue}</div>
            </div>
          </div>
        ) : null}

        <div className="bitwise-display-stack">
          <BitRow label="Left operand" bits={scene.leftBits} meta={`${scene.leftHex} • ${scene.leftLabel}`} pulseIndex={pulseIndex} />
          {selectedOperator.needsRightOperand ? (
            <BitRow label="Right operand" bits={scene.rightBits} meta={`${scene.rightHex} • ${scene.rightLabel}`} pulseIndex={pulseIndex} />
          ) : null}
          <BitRow
            label="Result"
            bits={scene.resultBits}
            meta={`${scene.resultHex} • ${scene.resultLabel}`}
            pulseIndex={pulseIndex}
            result
          />
        </div>

        <div className="callout">
          <strong>{selectedOperator.label}</strong>
          <span>{scene.explanation}</span>
        </div>
      </div>

      <div className="panel coding-panel-stack">
        <p className="eyebrow">Plain-English guide</p>
        <h3>How to read the bit animation</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Stored pattern first</span>
            <p>{selectedType.intro}</p>
          </div>
          <div className="teaching-step-card">
            <span>Operator meaning</span>
            <p>{selectedOperator.summary}</p>
          </div>
          <div className="teaching-step-card">
            <span>Human analogy</span>
            <p>{selectedOperator.analogy}</p>
          </div>
          <div className="teaching-step-card">
            <span>Type note</span>
            <p>{selectedType.note}</p>
          </div>
        </div>

        <div className="bitwise-summary-grid">
          <div className="stat-box">
            <span>Width</span>
            <strong>{selectedType.width} bits</strong>
          </div>
          <div className="stat-box">
            <span>Result value</span>
            <strong>{scene.resultLabel}</strong>
          </div>
          <div className="stat-box">
            <span>Why this matters</span>
            <strong>Flags, masks, packing</strong>
          </div>
        </div>

        <div className="callout">
          <strong>Bridge to coding</strong>
          <span>
            In real code, bitwise operations are how we test flags, isolate fields, shift packed data,
            and prepare the exact binary pattern that hardware expects.
          </span>
        </div>
      </div>
    </div>
  );
}

function BitRow({ label, bits, meta, pulseIndex, result = false }) {
  return (
    <div className={`bitwise-row-card ${result ? "result" : ""}`}>
      <div className="bitwise-row-head">
        <strong>{label}</strong>
        <span>{meta}</span>
      </div>
      <div className="bit-cluster-grid">
        {bits.map((bit) => (
          <div
            key={`${label}-${bit.index}`}
            className={`bit-cluster-cell ${bit.value === "1" ? "on" : ""} ${bit.changed ? "changed" : ""} ${bit.index === pulseIndex ? "focus" : ""}`}
          >
            <small>b{bit.bitIndex}</small>
            <strong>{bit.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExampleControlPanel({ model, onChange }) {
  return (
    <div className="shared-example-card">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Shared live example</p>
          <h3>These inputs drive the next three sections together</h3>
        </div>
      </div>

      <div className="coding-control-grid shared-example-grid">
        <div className="control-row">
          <label htmlFor="sensorA">Function input `sensorA`</label>
          <div className="slider-row">
            <input
              id="sensorA"
              type="range"
              min="-40"
              max="40"
              step="1"
              value={model.sensorA}
              onChange={(event) => onChange("sensorA", Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{model.sensorA}</div>
          </div>
        </div>

        <div className="control-row">
          <label htmlFor="sensorB">Function input `sensorB`</label>
          <div className="slider-row">
            <input
              id="sensorB"
              type="range"
              min="-16"
              max="16"
              step="1"
              value={model.sensorB}
              onChange={(event) => onChange("sensorB", Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{model.sensorB}</div>
          </div>
        </div>

        <div className="control-row">
          <label htmlFor="totalCycles">Global `g_totalCycles`</label>
          <div className="slider-row">
            <input
              id="totalCycles"
              type="range"
              min="40"
              max="240"
              step="1"
              value={model.totalCycles}
              onChange={(event) => onChange("totalCycles", Number(event.target.value))}
            />
            <div className="number-input bitwise-number">{model.totalCycles}</div>
          </div>
        </div>

        <div className="control-row">
          <label>Global `g_systemEnabled`</label>
          <div className="button-row">
            <button
              type="button"
              className={`chip-button ${model.systemEnabled ? "active" : ""}`}
              onClick={() => onChange("systemEnabled", true)}
            >
              true
            </button>
            <button
              type="button"
              className={`chip-button ${!model.systemEnabled ? "active" : ""}`}
              onClick={() => onChange("systemEnabled", false)}
            >
              false
            </button>
          </div>
        </div>

        <div className="control-row">
          <label>Global `g_modeCode`</label>
          <FancySelect
            ariaLabel="Choose a mode code"
            value={model.modeCode}
            onChange={(value) => onChange("modeCode", value)}
            options={modeCodeOptions.map((item) => ({ label: `${item} (ASCII ${item.charCodeAt(0)})`, value: item }))}
          />
        </div>
      </div>
    </div>
  );
}

function CodeMeaningLab({ model, onChange, programState, focusId, onFocusChange }) {
  const codeLines = useMemo(() => getCodeLines(), []);
  const focus = useMemo(() => describeCodeFocus(focusId, programState), [focusId, programState]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel coding-panel-stack">
        <ExampleControlPanel model={model} onChange={onChange} />

        <div className="source-card code-story-card">
          {codeLines.map((line, index) => {
            const lineNumber = index + 1;
            const active = focus.lines.includes(lineNumber);

            return (
              <div key={`${lineNumber}-${line}`} className={`code-story-line ${active ? "active" : ""}`}>
                <span className="code-story-number">{lineNumber.toString().padStart(2, "0")}</span>
                <span className="code-story-text">{line || " "}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel coding-panel-stack">
        <p className="eyebrow">Explain the code</p>
        <h3>One real function, many beginner concepts inside it</h3>

        <div className="concept-chip-grid">
          {codeFocuses.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`concept-chip ${item.id === focusId ? "active" : ""}`}
              onClick={() => onFocusChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="callout code-focus-callout">
          <strong>{focus.title}</strong>
          <span>{focus.detail}</span>
        </div>

        <div className="code-live-grid">
          <div className="variable-card">
            <span>{focus.metricLabel}</span>
            <strong>{focus.metric}</strong>
          </div>
          <div className="variable-card">
            <span>Global variable meaning</span>
            <strong>Shared values that exist outside the function</strong>
            <p className="panel-copy">
              In this example, globals keep configuration (`g_totalCycles`, `g_systemEnabled`,
              `g_modeCode`) and the latest saved answer (`g_lastResult`).
            </p>
          </div>
          <div className="variable-card">
            <span>Local variable meaning</span>
            <strong>Temporary values created during one function call</strong>
            <p className="panel-copy">
              `sum`, `difference`, `product`, `masked`, and `result` are local because they are just
              stepping stones used while `run_demo()` is executing.
            </p>
          </div>
          <div className="variable-card">
            <span>Current final output</span>
            <strong>{programState.result}</strong>
            <p className="panel-copy">
              The same live result will appear again in the assembly and machine-code sections so the
              whole pipeline stays connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssemblyBridgeLab({ instructions, activeInstructionId, onSelectInstruction, autoPlay, onToggleAutoPlay }) {
  const activeInstruction = instructions.find((item) => item.id === activeInstructionId) ?? instructions[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel coding-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Assembly viewer</p>
            <h3>The same function expressed as CPU-friendly steps</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={onToggleAutoPlay}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="assembly-list">
          {instructions.map((instruction, index) => (
            <button
              key={instruction.id}
              type="button"
              className={`assembly-line ${instruction.id === activeInstructionId ? "active" : ""} ${instruction.executed ? "executed" : "skipped"}`}
              onClick={() => onSelectInstruction(instruction.id)}
            >
              <span className="assembly-index">{(index + 1).toString().padStart(2, "0")}</span>
              <span className="assembly-text">{instruction.asm}</span>
              <small>{instruction.executed ? "executed in this run" : "present in code, skipped in this run"}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="panel coding-panel-stack">
        <p className="eyebrow">What this instruction means</p>
        <h3>{activeInstruction.asm}</h3>
        <p className="panel-copy">{activeInstruction.source}</p>

        <div className={`assembly-stage-grid ${activeInstruction.category}`}>
          <div className={`assembly-stage ${activeInstruction.category === "load" || activeInstruction.category === "store" ? "active" : ""}`}>
            <span>Memory</span>
            <p>Global variables and saved values live here.</p>
          </div>
          <div className={`assembly-stage ${activeInstruction.category === "load" || activeInstruction.category === "alu" || activeInstruction.category === "return" ? "active" : ""}`}>
            <span>Registers</span>
            <p>Registers are the CPU's tiny, fast working slots.</p>
          </div>
          <div className={`assembly-stage ${activeInstruction.category === "alu" ? "active" : ""}`}>
            <span>ALU</span>
            <p>Add, subtract, divide, shift, and bitwise work happens here.</p>
          </div>
          <div className={`assembly-stage ${activeInstruction.category === "branch" || activeInstruction.category === "return" ? "active" : ""}`}>
            <span>Control flow</span>
            <p>Comparisons and branches decide which instruction comes next.</p>
          </div>
        </div>

        <div className="callout">
          <strong>{activeInstruction.glossary.title}</strong>
          <span>{activeInstruction.glossary.body}</span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Current effect</span>
            <p>{activeInstruction.explain}</p>
          </div>
          <div className="teaching-step-card">
            <span>Live outcome</span>
            <p>{activeInstruction.result}</p>
          </div>
          <div className="teaching-step-card">
            <span>Why assembly feels different</span>
            <p>
              Assembly strips away friendly variable names and shows the exact register movement the
              CPU is expected to perform.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Load and store in one sentence</span>
            <p>
              Load means memory to register. Store means register to memory. That idea appears again
              and again in almost every real processor family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineCodeLab({ instructions, activeInstructionId, onSelectInstruction }) {
  const activeInstruction = instructions.find((item) => item.id === activeInstructionId) ?? instructions[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel coding-panel-stack">
        <p className="eyebrow">Machine-code list</p>
        <h3>Assembly is still text. Machine code is the raw binary word.</h3>

        <div className="machine-list">
          {instructions.map((instruction) => (
            <button
              key={instruction.id}
              type="button"
              className={`machine-line ${instruction.id === activeInstructionId ? "active" : ""} ${instruction.executed ? "executed" : "skipped"}`}
              onClick={() => onSelectInstruction(instruction.id)}
            >
              <strong>{instruction.machine.hex}</strong>
              <span>{instruction.asm}</span>
              <small>{instruction.machine.bytes}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="panel coding-panel-stack">
        <p className="eyebrow">Decode one instruction</p>
        <h3>{activeInstruction.machine.hex}</h3>
        <p className="panel-copy">
          Exact machine encodings differ from CPU to CPU, so this chapter uses a teaching-friendly
          fixed-width encoding to make the idea visible without drowning the learner in vendor
          details.
        </p>

        <div className="machine-word-card">
          <span>Binary word</span>
          <strong>{activeInstruction.machine.groupedBinary}</strong>
          <small>{activeInstruction.asm}</small>
        </div>

        <div className="machine-field-grid">
          {activeInstruction.machine.fields.map((field) => {
            const label = machineFieldLabels.find((item) => item.id === field.id)?.label ?? field.id;

            return (
              <div key={`${activeInstruction.id}-${field.id}`} className="machine-field-card">
                <span>{label}</span>
                <strong>{field.bits}</strong>
                <p>{field.meaning}</p>
              </div>
            );
          })}
        </div>

        <div className="callout">
          <strong>What changed from assembly to machine code?</strong>
          <span>
            The mnemonic names like `ADD` or `LOAD` disappear. The CPU does not read English words.
            It reads bit fields that mean opcode, destination register, source register, and extra
            data such as an immediate value or memory address.
          </span>
        </div>
      </div>
    </div>
  );
}

function FullCycleLab({ cards, stageIndex, onStageChange, autoPlay, onToggleAutoPlay, programState }) {
  const activeCard = cards[stageIndex] ?? cards[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel coding-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Full-cycle theater</p>
            <h3>One idea traveling from human language to silicon-friendly bits</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={onToggleAutoPlay}
          >
            {autoPlay ? "Auto tour" : "Manual tour"}
          </button>
        </div>

        <div className="cycle-stage-grid">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`cycle-stage-card ${index === stageIndex ? "active" : ""}`}
              onClick={() => onStageChange(index)}
            >
              <span>{card.label}</span>
              <strong>{card.summary}</strong>
            </button>
          ))}
        </div>

        <div className="source-card cycle-stage-output">
          {activeCard.lines.map((line) => (
            <div key={`${activeCard.id}-${line}`} className="source-line">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="panel coding-panel-stack">
        <p className="eyebrow">Why the cycle matters</p>
        <h3>{activeCard.label}</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Input story</span>
            <p>
              The live example currently uses `sensorA = {programState.sensorA}`, `sensorB = {programState.sensorB}`,
              `g_modeCode = '{programState.modeCode}'`, and `g_systemEnabled = {String(programState.systemEnabled)}`.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Human job</span>
            <p>
              A person thinks in requirements and meaning. That is why we start in English and write
              friendly variable names in C.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>CPU job</span>
            <p>
              The processor only understands instructions, addresses, registers, and bit fields. It
              never sees the source code the way you do.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Final takeaway</span>
            <p>
              The final answer for this run is <strong>{programState.result}</strong>, but the value is only
              useful because every earlier stage correctly described and translated the same intent.
            </p>
          </div>
        </div>

        <div className="callout">
          <strong>The whole chain in one sentence</strong>
          <span>
            English states the goal, C organizes the logic, assembly names the CPU steps, and machine
            code turns those steps into bits the hardware can fetch, decode, and execute.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterEleven({ chapterLabel = "Chapter 10", chapterNumber = "10" }) {
  const [model, setModel] = useState({
    sensorA: 18,
    sensorB: 6,
    totalCycles: 120,
    systemEnabled: true,
    modeCode: "A",
  });
  const [focusId, setFocusId] = useState(codeFocuses[0].id);
  const [assemblyAutoPlay, setAssemblyAutoPlay] = useState(true);
  const [activeInstructionId, setActiveInstructionId] = useState(null);
  const [cycleAutoPlay, setCycleAutoPlay] = useState(true);
  const [cycleStageIndex, setCycleStageIndex] = useState(0);

  const programState = useMemo(() => buildProgramState(model), [model]);
  const instructions = useMemo(() => buildAssemblyInstructions(programState), [programState]);
  const cycleCards = useMemo(() => buildCycleCards(programState, instructions), [programState, instructions]);

  useEffect(() => {
    if (!activeInstructionId || !instructions.some((item) => item.id === activeInstructionId)) {
      setActiveInstructionId(instructions[0]?.id ?? null);
    }
  }, [activeInstructionId, instructions]);

  useEffect(() => {
    if (!assemblyAutoPlay) {
      return undefined;
    }

    const executed = instructions.filter((item) => item.executed);

    if (!executed.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveInstructionId((current) => {
        const currentIndex = executed.findIndex((item) => item.id === current);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % executed.length;
        return executed[nextIndex].id;
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, [assemblyAutoPlay, instructions]);

  useEffect(() => {
    if (!cycleAutoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCycleStageIndex((current) => (current + 1) % cycleStages.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [cycleAutoPlay]);

  function handleModelChange(key, value) {
    setModel((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <section className="chapter" id="chapter-10">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>From English requirement to code, assembly, and machine code</h2>
        <p>
          This chapter is the bridge into real coding. We start with bitwise operations, then build
          one small C program, translate the same logic into assembly, convert it into machine-level
          instruction words, and keep every step interactive so even a non-technical learner can see
          how one idea travels through the whole computing stack.
        </p>
      </div>

      <ChapterPrimer
        title="What this chapter is really trying to demystify"
        items={[
          {
            title: "English requirement",
            body: "Humans begin with meaning: what should the machine do?",
          },
          {
            title: "C code",
            body: "C gives names, structure, and readable logic so humans can express that meaning clearly.",
          },
          {
            title: "Assembly",
            body: "Assembly removes most of the friendly syntax and shows the CPU-style steps more directly.",
          },
          {
            title: "Machine code",
            body: "The processor finally executes raw encoded bits, not the original C text.",
          },
        ]}
        callout={{
          title: "Why this feels hard at first",
          body: "You are learning the same idea in several languages at once. The goal is not memorizing each form separately, but recognizing that each form describes the same behavior at a different level.",
        }}
      />

      <section className="chapter-section" id="chapter-10-bitwise">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Bitwise operations on boolean, char, int16, and int32"
          description="Use live sliders and animated bit rows to see exactly how AND, OR, XOR, NOT, and shifts change the stored pattern."
        />
        <BitwiseLab />
      </section>

      <section className="chapter-section" id="chapter-10-code">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Write one small real program and understand every variable"
          description="The same example includes global variables, local variables, addition, subtraction, multiplication, division, and bitwise logic."
        />
        <CodeMeaningLab
          model={model}
          onChange={handleModelChange}
          programState={programState}
          focusId={focusId}
          onFocusChange={setFocusId}
        />
      </section>

      <section className="chapter-section" id="chapter-10-assembly">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Translate the same code into assembly and learn load, store, registers, and branches"
          description="Assembly removes friendly syntax and shows the exact CPU-style steps: move values into registers, run ALU operations, store results, and return."
        />
        <AssemblyBridgeLab
          instructions={instructions}
          activeInstructionId={activeInstructionId}
          onSelectInstruction={setActiveInstructionId}
          autoPlay={assemblyAutoPlay}
          onToggleAutoPlay={() => setAssemblyAutoPlay((current) => !current)}
        />
      </section>

      <section className="chapter-section" id="chapter-10-machine-code">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Convert assembly into machine-level instruction words"
          description="See how mnemonics turn into opcodes, register fields, immediate values, and raw binary that the processor can actually fetch and decode."
        />
        <MachineCodeLab
          instructions={instructions}
          activeInstructionId={activeInstructionId}
          onSelectInstruction={setActiveInstructionId}
        />
      </section>

      <section className="chapter-section" id="chapter-10-cycle">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="See the complete journey from requirement to machine action"
          description="Finish with one animated walkthrough that keeps the same live example but re-expresses it at each level of abstraction."
        />
        <FullCycleLab
          cards={cycleCards}
          stageIndex={cycleStageIndex}
          onStageChange={setCycleStageIndex}
          autoPlay={cycleAutoPlay}
          onToggleAutoPlay={() => setCycleAutoPlay((current) => !current)}
          programState={programState}
        />
      </section>
    </section>
  );
}



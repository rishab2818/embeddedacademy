import { useMemo, useState } from "react";
import CodePipelineViewer from "../components/CodePipelineViewer";
import FancySelect from "../components/FancySelect";
import GpioBoard from "../components/GpioBoard";
import MemoryMap from "../components/MemoryMap";
import SectionHeading from "../components/SectionHeading";
import { gpioDriverNotes, gpioPins, gpioScenarios, roControllers } from "../data/chapterSeven";
import { buildGpioLesson } from "../utils/gpioEngine";

function RegisterCards({ registers, controller }) {
  return (
    <div className="register-grid">
      {registers.map((register) => (
        <div key={register.id} className="stat-box register-card">
          <span>{register.name}</span>
          <strong>{register.formatted}</strong>
          <p className="panel-copy">
            {register.note}. Natural register width: {controller.wordBits} bits.
          </p>
        </div>
      ))}
    </div>
  );
}

function DriverReadingLab({ controllerId, onControllerChange, lesson }) {
  const controller = roControllers.find((item) => item.id === controllerId) ?? roControllers[0];

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="control-row">
          <label>RO uController type</label>
          <FancySelect
            ariaLabel="RO uController type"
            value={controllerId}
            onChange={onControllerChange}
            options={roControllers.map((item) => ({ label: item.label, value: item.id }))}
          />
        </div>

        <div className="embedded-loop-card">
          <span>{controller.label}</span>
          <h3>{controller.summary}</h3>
          <p className="panel-copy">{controller.analogy}</p>
        </div>

        <div className="bullet-stack">
          {gpioDriverNotes.map((note) => (
            <div key={note.title} className="bullet-card">
              <strong>{note.title}</strong>
              <p className="panel-copy">{note.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Fake GPIO device driver</p>
        <h3>Read the driver from top to bottom</h3>
        <div className="source-card pipeline-stage-card">
          {lesson.driverHeader.map((line) => (
            <div key={line} className="source-line">
              {line}
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>How to read this</strong>
          <span>
            First read the register type. Then read the GPIO register block. Then read the helper
            functions. That is the pattern many embedded drivers follow: map registers, then wrap
            them in readable functions.
          </span>
        </div>
      </div>
    </div>
  );
}

function ProgrammingLab({
  controllerId,
  scenarioId,
  onScenarioChange,
  config,
  onConfigChange,
  lesson,
}) {
  const controller = roControllers.find((item) => item.id === controllerId) ?? roControllers[0];

  const pipelineStages = [
    {
      id: "driver",
      label: "Driver calls",
      explain:
        "This is the readable application view. You call GPIO driver functions instead of touching registers directly.",
      lines: lesson.driverCode,
    },
    {
      id: "c",
      label: "C register code",
      explain:
        "This is the lower-level C that a driver would typically perform under the hood by changing GPIO registers.",
      lines: lesson.cCode,
    },
    {
      id: "asm",
      label: "Assembly",
      explain:
        "Assembly shows the CPU-friendly instruction steps needed to load registers, set bits, test inputs, and store results.",
      lines: lesson.assembly,
    },
    {
      id: "opcode",
      label: "Opcode words",
      explain:
        "Each assembly instruction can be represented as opcode words. These are still symbolic numbers, but much closer to raw machine form.",
      lines: lesson.opcodeText,
    },
    {
      id: "machine",
      label: "Machine bytes",
      explain:
        "This is the final byte-level form that the CPU fetches from memory. Real machine code is what the hardware executes.",
      lines: lesson.machineBytes,
    },
  ];

  return (
    <div className="chapter-grid lesson-gpio-grid">
      <div className="lesson-gpio-controls">
        <div className="panel">
          <div className="control-row">
            <label>GPIO example</label>
            <FancySelect
              ariaLabel="GPIO example"
              value={scenarioId}
              onChange={onScenarioChange}
              options={gpioScenarios.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <p className="panel-copy">
            {(gpioScenarios.find((item) => item.id === scenarioId) ?? gpioScenarios[0]).explain}
          </p>

          {scenarioId === "output" ? (
            <>
              <div className="control-row">
                <label>Output pin</label>
                <FancySelect
                  ariaLabel="Output pin"
                  value={config.pin}
                  onChange={(next) => onConfigChange({ pin: Number(next) })}
                  options={gpioPins.map((pin) => ({ label: pin.label, value: pin.id }))}
                />
              </div>

              <div className="control-row">
                <label>Drive level</label>
                <FancySelect
                  ariaLabel="Drive level"
                  value={config.outputValue}
                  onChange={(next) => onConfigChange({ outputValue: Number(next) })}
                  options={[
                    { label: "LOW", value: 0 },
                    { label: "HIGH", value: 1 },
                  ]}
                />
              </div>
            </>
          ) : (
            <>
              <div className="control-row">
                <label>Input pin</label>
                <FancySelect
                  ariaLabel="Input pin"
                  value={config.inputPin}
                  onChange={(next) => onConfigChange({ inputPin: Number(next) })}
                  options={gpioPins.map((pin) => ({ label: pin.label, value: pin.id }))}
                />
              </div>

              <div className="control-row">
                <label>LED output pin</label>
                <FancySelect
                  ariaLabel="LED output pin"
                  value={config.outputPin}
                  onChange={(next) => onConfigChange({ outputPin: Number(next) })}
                  options={gpioPins.map((pin) => ({ label: pin.label, value: pin.id }))}
                />
              </div>

              <div className="control-row">
                <label>External input level</label>
                <FancySelect
                  ariaLabel="External input level"
                  value={config.inputValue}
                  onChange={(next) => onConfigChange({ inputValue: Number(next) })}
                  options={[
                    { label: "LOW", value: 0 },
                    { label: "HIGH", value: 1 },
                  ]}
                />
              </div>
            </>
          )}

          <div className="callout">
            <strong>Current goal</strong>
            <span>{lesson.description}</span>
          </div>
        </div>

        <GpioBoard
          pins={lesson.pins}
          title={`${controller.label} with 8 GPIO pins`}
          subtitle="Inputs sample external signals. Outputs drive the device state."
          onInputToggle={
            scenarioId === "input"
              ? () => onConfigChange({ inputValue: config.inputValue ? 0 : 1 })
              : undefined
          }
        />
      </div>

      <div className="lesson-gpio-readouts">
        <div className="panel">
          <p className="eyebrow">Registers and memory</p>
          <h3>GPIO programming is mostly about setting and reading bits</h3>
          <RegisterCards registers={lesson.registers} controller={controller} />

          <MemoryMap
            title="GPIO register block in memory"
            subtitle="These addresses hold the direction, output, and input state."
            cells={lesson.memoryCells}
            columns={3}
          />
        </div>

        <CodePipelineViewer
          title="From fake driver to machine code"
          stages={pipelineStages}
        />
      </div>
    </div>
  );
}

export default function ChapterSeven({ chapterLabel = "Chapter 0.7" }) {
  const [controllerId, setControllerId] = useState("ro16");
  const [scenarioId, setScenarioId] = useState("output");
  const [config, setConfig] = useState({
    pin: 3,
    outputValue: 1,
    inputPin: 2,
    outputPin: 0,
    inputValue: 0,
  });

  const lesson = useMemo(
    () => buildGpioLesson(controllerId, scenarioId, config),
    [controllerId, scenarioId, config]
  );

  function patchConfig(patch) {
    setConfig((current) => ({ ...current, ...patch }));
  }

  return (
    <section className="chapter" id="chapter-7">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Programming GPIO on the RO uController</h2>
        <p>
          This chapter teaches GPIO step by step on two fake chips: RO uController 16 and RO
          uController 32. You will read a fake GPIO device driver, turn that into code, watch
          the pins react, and then trace the same action down to assembly, opcode words, memory,
          and final machine bytes.
        </p>
      </div>

      <section className="chapter-section" id="chapter-7-driver">
        <SectionHeading
          eyebrow="Driver first"
          title="Understand the fake GPIO device driver before writing code"
          description="Real embedded code often starts with a driver layer. Here we keep only the GPIO parts so the pattern stays easy to understand."
        />
        <DriverReadingLab controllerId={controllerId} onControllerChange={setControllerId} lesson={lesson} />
      </section>

      <section className="chapter-section" id="chapter-7-programming">
        <SectionHeading
          eyebrow="Interactive lab"
          title="Program GPIO outputs and inputs, then see the hardware react"
          description="Choose a controller, pick an output or input example, and watch the board, registers, memory, and generated code update together."
        />
        <ProgrammingLab
          controllerId={controllerId}
          scenarioId={scenarioId}
          onScenarioChange={setScenarioId}
          config={config}
          onConfigChange={patchConfig}
          lesson={lesson}
        />
      </section>
    </section>
  );
}

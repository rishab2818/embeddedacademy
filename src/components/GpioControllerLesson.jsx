import { useMemo, useState } from "react";
import CodePipelineViewer from "./CodePipelineViewer";
import FancySelect from "./FancySelect";
import GpioBoard from "./GpioBoard";
import MemoryMap from "./MemoryMap";
import { gpioScenarios } from "../data/chapterSeven";
import { buildGpioTeachingModel } from "../utils/gpioEngine";

function buildPinOptions(controller, skipPin) {
  return Array.from({ length: controller.pinCount }, (_, index) => ({
    label: `${controller.pinPrefix}${index}`,
    value: index,
  })).filter((option) => option.value !== skipPin);
}

function formatAddress(controller, value) {
  return `0x${value.toString(16).toUpperCase().padStart(controller.registerDigits, "0")}`;
}

function RegisterCards({ registers, activeGroup, onGroupChange }) {
  return (
    <div className="register-grid">
      {registers.map((register) => {
        const active = activeGroup === register.id;

        return (
          <button
            key={register.id}
            type="button"
            className={`stat-box register-card register-card-button ${active ? "active" : ""}`}
            onClick={() => onGroupChange(register.id)}
          >
            <span>{register.name}</span>
            <strong>{register.formatted}</strong>
            <p className="panel-copy">{register.note}</p>
          </button>
        );
      })}
    </div>
  );
}

function WordPreview({ controller }) {
  return (
    <div className="word-preview">
      <div className="word-preview-head">
        <strong>{controller.chapterLabel}</strong>
        <span>
          Natural register size: {controller.wordBits} bits ({controller.wordBits / 8} bytes)
        </span>
      </div>

      <div className="word-preview-grid">
        {Array.from({ length: controller.wordBits }, (_, index) => (
          <span
            key={`${controller.id}-bit-${index}`}
            className={`word-preview-bit ${index < controller.pinCount ? "used" : ""}`}
          >
            {index}
          </span>
        ))}
      </div>

      <p className="panel-copy">
        The first {controller.pinCount} bit positions are enough for the GPIO pins shown here. One
        bit can describe one pin.
      </p>
    </div>
  );
}

function AddressStory({ controller, activeGroup, onGroupChange }) {
  const cards = [
    {
      id: "dir",
      label: "DIR memory",
      address: controller.addresses.dir,
      explain: "Write 1 to a bit when you want that pin to behave like an OUTPUT.",
    },
    {
      id: "data",
      label: "DATA memory",
      address: controller.addresses.data,
      explain: "Write 1 or 0 here when you want an output pin to go HIGH or LOW.",
    },
    {
      id: "input",
      label: "INPUT memory",
      address: controller.addresses.input,
      explain: "Read 1 or 0 here to learn what an external switch or sensor is doing.",
    },
  ];

  return (
    <div className="address-story-grid">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          className={`address-story-card ${activeGroup === card.id ? "active" : ""}`}
          onClick={() => onGroupChange(card.id)}
        >
          <span>{card.label}</span>
          <strong>{formatAddress(controller, card.address)}</strong>
          <p>{card.explain}</p>
        </button>
      ))}
    </div>
  );
}

function EnglishSteps({ steps }) {
  return (
    <div className="teaching-step-grid">
      {steps.map((step, index) => (
        <div key={`${index + 1}-${step}`} className="teaching-step-card">
          <span>Step {index + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
}

function FlowStory({ scenarioId, controller, model }) {
  const cards =
    scenarioId === "output"
      ? [
          {
            title: "Your idea",
            body: `You decide that ${model.targetLabel} should become ${
              model.outputLevel ? "HIGH" : "LOW"
            }.`,
          },
          {
            title: "Write to memory",
            body: `The program changes the DATA register at ${formatAddress(
              controller,
              controller.addresses.data
            )}.`,
          },
          {
            title: "Pin changes",
            body: `${model.targetLabel} now drives a real voltage level outside the chip.`,
          },
          {
            title: "LED reacts",
            body: `The LED connected to ${model.targetLabel} ${
              model.outputLevel ? "turns on" : "turns off"
            }.`,
          },
        ]
      : [
          {
            title: "Real world changes",
            body: `A switch or sensor changes the level on ${model.inputLabel}.`,
          },
          {
            title: "Input enters memory",
            body: `The controller samples that level into INPUT memory at ${formatAddress(
              controller,
              controller.addresses.input
            )}.`,
          },
          {
            title: "Code makes sense of it",
            body: `The program checks the bit for ${model.inputLabel} and decides what ${model.ledLabel} should do.`,
          },
          {
            title: "Output acts",
            body: `${model.ledLabel} goes ${model.outputLevel ? "HIGH" : "LOW"} so the LED ${
              model.outputLevel ? "glows" : "stays off"
            }.`,
          },
        ];

  return (
    <div className="flow-story">
      {cards.map((card, index) => (
        <div key={card.title} className="flow-story-card">
          <span>{card.title}</span>
          <p>{card.body}</p>
          {index < cards.length - 1 ? <div className="flow-story-arrow" aria-hidden="true" /> : null}
        </div>
      ))}
    </div>
  );
}

function TranslationLegend() {
  const items = [
    {
      title: "English",
      body: "This is the human explanation of what you want the controller to do.",
    },
    {
      title: "C code",
      body: "This is a common programming language used to write embedded programs.",
    },
    {
      title: "Assembly",
      body: "This is a very close-to-the-CPU view of the same actions.",
    },
    {
      title: "Opcode",
      body: "An opcode is the numeric ID for an instruction such as LOAD, OR, or STORE.",
    },
    {
      title: "Machine code",
      body: "This is the final byte pattern stored in memory and executed by the CPU.",
    },
  ];

  return (
    <div className="translation-legend">
      {items.map((item) => (
        <div key={item.title} className="translation-legend-card">
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function GpioControllerLesson({ controller }) {
  const [scenarioId, setScenarioId] = useState("output");
  const [targetPin, setTargetPin] = useState(Math.min(3, controller.pinCount - 1));
  const [outputLevel, setOutputLevel] = useState(1);
  const [inputPin, setInputPin] = useState(0);
  const [ledPin, setLedPin] = useState(Math.min(1, controller.pinCount - 1));
  const [inputLevel, setInputLevel] = useState(0);
  const [activeGroup, setActiveGroup] = useState("dir");

  const model = useMemo(
    () =>
      buildGpioTeachingModel(controller, scenarioId, {
        targetPin,
        outputLevel,
        inputPin,
        ledPin,
        inputLevel,
      }),
    [controller, scenarioId, targetPin, outputLevel, inputPin, ledPin, inputLevel]
  );

  const stages = [
    {
      id: "english",
      label: "English first",
      explain:
        "Start here. If the goal is clear in simple language, the code becomes much easier to understand.",
      lines: model.english,
    },
    {
      id: "c",
      label: "Simple C",
      explain:
        "This version still talks directly to memory, but now in the C language most embedded code uses.",
      lines: model.cCode,
    },
    {
      id: "asm",
      label: "Assembly",
      explain:
        "Assembly breaks the same action into tiny CPU steps such as load, change a bit, and store it back.",
      lines: model.assembly,
    },
    {
      id: "opcode",
      label: "Opcodes",
      explain:
        "Every instruction has an operation code. It tells the CPU what kind of instruction it is looking at.",
      lines: model.opcodeText,
    },
    {
      id: "machine",
      label: "Machine code",
      explain:
        "Machine code is what finally sits in memory as bytes. The CPU fetches these bytes and executes them.",
      lines: model.machineBytes,
    },
  ];

  const pinOptions = Array.from({ length: controller.pinCount }, (_, index) => ({
    label: `${controller.pinPrefix}${index}`,
    value: index,
  }));
  const ledOptions = buildPinOptions(controller, inputPin);
  const inputOptions = buildPinOptions(controller, ledPin);

  return (
    <div className="chapter-grid lesson-gpio-grid">
      <div className="lesson-gpio-controls">
        <div className="panel gpio-teaching-panel">
          <div className="embedded-loop-card">
            <span>{controller.label}</span>
            <h3>{controller.summary}</h3>
            <p className="panel-copy">{controller.analogy}</p>
          </div>

          <WordPreview controller={controller} />

          <div className="callout">
            <strong>Beginner shortcut</strong>
            <span>
              Do not think about the whole controller at once. For GPIO, you only need three
              addresses: one to choose input or output, one to write output values, and one to
              read incoming levels.
            </span>
          </div>
        </div>

        <div className="panel gpio-teaching-panel">
          <p className="eyebrow">Choose one simple story</p>
          <h3>Practice one GPIO action at a time</h3>

          <div className="control-row">
            <label>Example type</label>
            <FancySelect
              ariaLabel={`${controller.label} example type`}
              value={scenarioId}
              onChange={(next) => {
                setScenarioId(next);
                setActiveGroup("dir");
              }}
              options={gpioScenarios.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          {scenarioId === "output" ? (
            <>
              <div className="control-row">
                <label>LED output pin</label>
                <FancySelect
                  ariaLabel={`${controller.label} LED output pin`}
                  value={targetPin}
                  onChange={(next) => setTargetPin(Number(next))}
                  options={pinOptions}
                />
              </div>

              <div className="control-row">
                <label>Write this level</label>
                <FancySelect
                  ariaLabel={`${controller.label} output level`}
                  value={outputLevel}
                  onChange={(next) => setOutputLevel(Number(next))}
                  options={[
                    { label: "HIGH", value: 1 },
                    { label: "LOW", value: 0 },
                  ]}
                />
              </div>
            </>
          ) : (
            <>
              <div className="control-row">
                <label>Sensor input pin</label>
                <FancySelect
                  ariaLabel={`${controller.label} sensor input pin`}
                  value={inputPin}
                  onChange={(next) => {
                    const nextValue = Number(next);
                    setInputPin(nextValue);
                    if (nextValue === ledPin) {
                      setLedPin(nextValue === controller.pinCount - 1 ? 0 : nextValue + 1);
                    }
                  }}
                  options={inputOptions}
                />
              </div>

              <div className="control-row">
                <label>LED output pin</label>
                <FancySelect
                  ariaLabel={`${controller.label} LED output pin`}
                  value={ledPin}
                  onChange={(next) => {
                    const nextValue = Number(next);
                    setLedPin(nextValue);
                    if (nextValue === inputPin) {
                      setInputPin(nextValue === controller.pinCount - 1 ? 0 : nextValue + 1);
                    }
                  }}
                  options={ledOptions}
                />
              </div>

              <div className="control-row">
                <label>External sensor level</label>
                <FancySelect
                  ariaLabel={`${controller.label} external sensor level`}
                  value={inputLevel}
                  onChange={(next) => setInputLevel(Number(next))}
                  options={[
                    { label: "HIGH", value: 1 },
                    { label: "LOW", value: 0 },
                  ]}
                />
              </div>
            </>
          )}

          <div className="callout">
            <strong>What is happening right now</strong>
            <span>{model.explanation}</span>
          </div>
        </div>

        <GpioBoard
          pins={model.pins}
          title={`${controller.label} GPIO pins`}
          subtitle={
            scenarioId === "input"
              ? "Click the highlighted sensor pin or use the selector to change the incoming level."
              : "The highlighted pin is the one your program is actively controlling."
          }
          onInputToggle={scenarioId === "input" ? () => setInputLevel((current) => (current ? 0 : 1)) : undefined}
        />
      </div>

      <div className="lesson-gpio-readouts">
        <div className="panel gpio-teaching-panel">
          <p className="eyebrow">Memory first</p>
          <h3>GPIO is just reading and writing the right memory location</h3>

          <AddressStory
            controller={controller}
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
          />

          <RegisterCards
            registers={model.registers}
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
          />

          <MemoryMap
            title="GPIO register addresses"
            subtitle="Click a card above to focus on one memory meaning."
            cells={model.memoryCells}
            columns={3}
            activeGroup={activeGroup}
          />

          <EnglishSteps steps={model.english} />
        </div>

        <div className="panel gpio-teaching-panel">
          <p className="eyebrow">From signal to action</p>
          <h3>See how the real world touches the code</h3>
          <FlowStory scenarioId={scenarioId} controller={controller} model={model} />
        </div>

        <CodePipelineViewer title="Translate one GPIO idea down to the CPU" stages={stages} />
        <TranslationLegend />
      </div>
    </div>
  );
}

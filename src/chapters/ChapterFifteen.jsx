import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import {
  analogPipelines,
  communicationProtocols,
  connectionPatterns,
  busStories,
  gpioModes,
  microcontrollerPrimerItems,
  peripheralPlaybook,
  systemBlocks,
  wholeSystemScenarios,
} from "../data/chapterSixteen";
import { formatSectionLabel } from "../utils/courseLabels";

const gpioNodes = [
  { id: "sensor", label: "External source" },
  { id: "pad", label: "Pin pad" },
  { id: "pull", label: "Pull network" },
  { id: "input", label: "Input buffer" },
  { id: "analog", label: "Analog path" },
  { id: "mux", label: "Pin mux" },
  { id: "register", label: "GPIO register" },
  { id: "interrupt", label: "Interrupt logic" },
  { id: "cpu", label: "CPU" },
  { id: "peripheral", label: "Peripheral block" },
  { id: "output", label: "Output driver" },
  { id: "driver", label: "External driver" },
  { id: "load", label: "Load / device" },
];

const protocolNodes = [
  { id: "controller", label: "MCU controller" },
  { id: "cs", label: "Select / address" },
  { id: "clock", label: "Timing" },
  { id: "wire", label: "Shared wires" },
  { id: "device", label: "Target device" },
  { id: "memory", label: "Device register" },
  { id: "ram", label: "RAM buffer" },
  { id: "driver", label: "Transceiver" },
];

const analogNodes = [
  { id: "sensor", label: "Sensor / source" },
  { id: "front", label: "Analog front end" },
  { id: "adc", label: "ADC" },
  { id: "dac", label: "DAC" },
  { id: "clock", label: "Timing source" },
  { id: "memory", label: "Data register" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "RAM" },
  { id: "timer", label: "Timer/PWM" },
  { id: "gpio", label: "Pin output" },
  { id: "driver", label: "Driver stage" },
  { id: "load", label: "Actuator / circuit" },
];

const busNodes = [
  { id: "cpu", label: "CPU core" },
  { id: "flash", label: "Flash" },
  { id: "cache", label: "Cache / prefetch" },
  { id: "bus", label: "Bus fabric" },
  { id: "ram", label: "SRAM" },
  { id: "dma", label: "DMA" },
  { id: "apb", label: "Peripheral bridge" },
  { id: "peripheral", label: "Peripheral register" },
];

const systemMovieNodes = [
  { id: "sensor", label: "Sensor / plant" },
  { id: "analog", label: "Front end / protocol" },
  { id: "adc", label: "Capture engine" },
  { id: "comms", label: "Comms block" },
  { id: "ram", label: "RAM state" },
  { id: "cpu", label: "CPU logic" },
  { id: "clock", label: "Clock / timing" },
  { id: "timer", label: "Timer / PWM" },
  { id: "gpio", label: "GPIO / pin mux" },
  { id: "driver", label: "Driver stage" },
  { id: "actuator", label: "Actuator" },
  { id: "feedback", label: "Physical feedback" },
];

function NodeGrid({ nodes, activeIds = [] }) {
  return (
    <div className="mcu-node-grid">
      {nodes.map((node) => (
        <div key={node.id} className={`mcu-node-card ${activeIds.includes(node.id) ? "active" : ""}`}>
          <span>{node.label}</span>
        </div>
      ))}
    </div>
  );
}

function StepSelector({ steps, activeIndex, onSelect }) {
  return (
    <div className="mcu-step-grid">
      {steps.map((step, index) => (
        <button
          key={`${step.label}-${step.title}`}
          type="button"
          className={`mcu-step-card ${index === activeIndex ? "active" : ""}`}
          onClick={() => onSelect(index)}
        >
          <span>{step.label}</span>
          <strong>{step.title}</strong>
        </button>
      ))}
    </div>
  );
}

function SystemAtlasLab() {
  const [blockId, setBlockId] = useState(systemBlocks[0].id);
  const block = useMemo(
    () => systemBlocks.find((item) => item.id === blockId) ?? systemBlocks[0],
    [blockId]
  );

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <p className="eyebrow">System atlas</p>
        <h3>Meet the main blocks inside a modern microcontroller</h3>
        <p className="panel-copy">
          Select a block and treat the controller like a real working machine, not a black box.
          This is the internal cast that later sections keep animating.
        </p>

        <div className="mcu-atlas-grid">
          {systemBlocks.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mcu-atlas-card ${item.id === blockId ? "active" : ""}`}
              onClick={() => setBlockId(item.id)}
            >
              <span>{item.kicker}</span>
              <strong>{item.label}</strong>
              <p>{item.summary}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Focused explanation</p>
        <h3>{block.label}</h3>

        <div className="callout">
          <strong>{block.kicker}</strong>
          <span>{block.summary}</span>
        </div>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Beginner view</span>
            <p>{block.beginnerView}</p>
          </article>
          <article className="teaching-step-card">
            <span>Expert view</span>
            <p>{block.expertView}</p>
          </article>
          <article className="teaching-step-card">
            <span>When it matters</span>
            <p>{block.whenUsed}</p>
          </article>
          <article className="teaching-step-card">
            <span>Common trap</span>
            <p>{block.watchOut}</p>
          </article>
        </div>

        <div className="mcu-related-row">
          {block.related.map((id) => {
            const related = systemBlocks.find((item) => item.id === id);
            return (
              <div key={`${block.id}-${id}`} className="mcu-related-chip">
                {related?.label ?? id}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GpioLab() {
  const [modeId, setModeId] = useState(gpioModes[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const mode = useMemo(() => gpioModes.find((item) => item.id === modeId) ?? gpioModes[0], [modeId]);
  const step = mode.beats[stepIndex] ?? mode.beats[0];

  useEffect(() => {
    setStepIndex(0);
  }, [modeId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % mode.beats.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [autoPlay, mode.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">GPIO movie</p>
            <h3>Pins are not just metal pads, they are configurable gateways</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="button-row">
          {gpioModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === modeId ? "active" : ""}`}
              onClick={() => setModeId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <NodeGrid nodes={gpioNodes} activeIds={step.active} />
        <StepSelector steps={mode.beats} activeIndex={stepIndex} onSelect={setStepIndex} />
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">What is happening</p>
        <h3>{mode.headline}</h3>
        <p className="panel-copy">{mode.summary}</p>

        <div className="callout">
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Use it for</span>
            <p>{mode.useCases.join(", ")}</p>
          </article>
          <article className="teaching-step-card">
            <span>Electrical caution</span>
            <p>{mode.caution}</p>
          </article>
          <article className="teaching-step-card">
            <span>Most important correction</span>
            <p>
              Input flow begins outside the MCU. Output flow begins with an internal register or
              peripheral write. That causal direction matters.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

function CommunicationLab() {
  const [protocolId, setProtocolId] = useState(communicationProtocols[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const protocol = useMemo(
    () => communicationProtocols.find((item) => item.id === protocolId) ?? communicationProtocols[0],
    [protocolId]
  );
  const step = protocol.beats[stepIndex] ?? protocol.beats[0];

  useEffect(() => {
    setStepIndex(0);
  }, [protocolId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % protocol.beats.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, [autoPlay, protocol.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Communication lab</p>
            <h3>How the MCU talks to sensors, memories, and other machines</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="button-row">
          {communicationProtocols.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === protocolId ? "active" : ""}`}
              onClick={() => setProtocolId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <NodeGrid nodes={protocolNodes} activeIds={step.active} />
        <StepSelector steps={protocol.beats} activeIndex={stepIndex} onSelect={setStepIndex} />
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Protocol reasoning</p>
        <h3>{protocol.label}</h3>

        <div className="mcu-stat-grid">
          <article className="mcu-stat-card">
            <span>Wires</span>
            <strong>{protocol.wires}</strong>
          </article>
          <article className="mcu-stat-card">
            <span>Topology</span>
            <strong>{protocol.topology}</strong>
          </article>
          <article className="mcu-stat-card">
            <span>Best fit</span>
            <strong>{protocol.bestFor}</strong>
          </article>
        </div>

        <div className="callout">
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Why pick it</span>
            <p>{protocol.whyItFits}</p>
          </article>
          <article className="teaching-step-card">
            <span>Watch out</span>
            <p>{protocol.caution}</p>
          </article>
          <article className="teaching-step-card">
            <span>Typical devices</span>
            <p>{protocol.examples.join(", ")}</p>
          </article>
        </div>

      </div>
    </div>
  );
}

function AnalogPeripheralLab() {
  const [pipelineId, setPipelineId] = useState(analogPipelines[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const pipeline = useMemo(
    () => analogPipelines.find((item) => item.id === pipelineId) ?? analogPipelines[0],
    [pipelineId]
  );
  const step = pipeline.beats[stepIndex] ?? pipeline.beats[0];

  useEffect(() => {
    setStepIndex(0);
  }, [pipelineId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % pipeline.beats.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, [autoPlay, pipeline.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Analog and timed peripherals</p>
            <h3>ADC, DAC, and PWM turn numbers into measurements and action</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="button-row">
          {analogPipelines.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === pipelineId ? "active" : ""}`}
              onClick={() => setPipelineId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <NodeGrid nodes={analogNodes} activeIds={step.active} />
        <StepSelector steps={pipeline.beats} activeIndex={stepIndex} onSelect={setStepIndex} />
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Focused explanation</p>
        <h3>{pipeline.headline}</h3>
        <p className="panel-copy">{pipeline.summary}</p>

        <div className="callout">
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Best for</span>
            <p>{pipeline.bestFor}</p>
          </article>
          <article className="teaching-step-card">
            <span>Engineering caution</span>
            <p>{pipeline.caution}</p>
          </article>
          <article className="teaching-step-card">
            <span>Big picture</span>
            <p>
              ADC brings the physical world into numbers. DAC and PWM help turn numbers back into a
              physical effect through analog or power stages.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

function BusMemoryLab() {
  const [storyId, setStoryId] = useState(busStories[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const story = useMemo(() => busStories.find((item) => item.id === storyId) ?? busStories[0], [storyId]);
  const step = story.beats[stepIndex] ?? story.beats[0];

  useEffect(() => {
    setStepIndex(0);
  }, [storyId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % story.beats.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, [autoPlay, story.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Bus and memory traffic</p>
            <h3>See how data really moves inside the controller</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="button-row">
          {busStories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === storyId ? "active" : ""}`}
              onClick={() => setStoryId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <NodeGrid nodes={busNodes} activeIds={step.active} />
        <StepSelector steps={story.beats} activeIndex={stepIndex} onSelect={setStepIndex} />
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Traffic explanation</p>
        <h3>{story.headline}</h3>
        <p className="panel-copy">{story.summary}</p>

        <div className="callout">
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Why this matters</span>
            <p>
              Understanding traffic is how you explain instruction stalls, peripheral latency, DMA
              behavior, and why a fast core can still wait on memory or buses.
            </p>
          </article>
          <article className="teaching-step-card">
            <span>Advanced caution</span>
            <p>{story.caution}</p>
          </article>
        </div>
      </div>
    </div>
  );
}

function WholeSystemMovieLab() {
  const [scenarioId, setScenarioId] = useState(wholeSystemScenarios[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const scenario = useMemo(
    () => wholeSystemScenarios.find((item) => item.id === scenarioId) ?? wholeSystemScenarios[0],
    [scenarioId]
  );
  const steps = scenario.beats.map((beat, index) => ({
    label: `Beat ${index + 1}`,
    title: beat.title,
    active: beat.active,
  }));
  const beat = scenario.beats[stepIndex] ?? scenario.beats[0];

  useEffect(() => {
    setStepIndex(0);
  }, [scenarioId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % scenario.beats.length);
    }, 2100);

    return () => window.clearInterval(timer);
  }, [autoPlay, scenario.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Whole-controller movie</p>
            <h3>Watch a microcontroller behave like a connected physical machine</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <div className="button-row">
          {wholeSystemScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === scenarioId ? "active" : ""}`}
              onClick={() => setScenarioId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <blockquote className="mcu-quote-card">
          <span>System requirement</span>
          <p>{scenario.quote}</p>
        </blockquote>

        <NodeGrid nodes={systemMovieNodes} activeIds={beat.active} />
        <StepSelector steps={steps} activeIndex={stepIndex} onSelect={setStepIndex} />
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Current machine beat</p>
        <h3>{beat.title}</h3>
        <p className="panel-copy">{scenario.overview}</p>

        <div className="callout">
          <strong>What the machine is doing now</strong>
          <span>{beat.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          {scenario.lessons.map((lesson) => (
            <article key={lesson} className="teaching-step-card">
              <span>What to notice</span>
              <p>{lesson}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Expert bridge</strong>
          <span>{scenario.expertNote}</span>
        </div>
      </div>
    </div>
  );
}

function PeripheralPlaybookPanel() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel mcu-panel-stack">
        <p className="eyebrow">Peripheral playbook</p>
        <h3>More building blocks you should know are often present</h3>

        <div className="mcu-atlas-grid">
          {peripheralPlaybook.map((item) => (
            <article key={item.title} className="mcu-atlas-card static">
              <span>Peripheral</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="panel mcu-panel-stack">
        <p className="eyebrow">System designer mindset</p>
        <h3>How to picture a complete microcontroller before deeper topics</h3>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Inputs arrive in different forms</span>
            <p>
              Some signals are analog and need ADC. Some are digital and enter through GPIO. Some
              arrive over protocols like SPI or I2C. The chip must host all three stories at once.
            </p>
          </article>
          <article className="teaching-step-card">
            <span>Outputs also differ</span>
            <p>
              Some outputs are simple bits, some are timed PWM waveforms, and some become analog
              levels or network messages through dedicated peripherals.
            </p>
          </article>
          <article className="teaching-step-card">
            <span>Internal movement matters</span>
            <p>
              The CPU, buses, flash, RAM, DMA, interrupts, and caches cooperate. A system is only
              understandable when you can narrate how they share the work.
            </p>
          </article>
          <article className="teaching-step-card">
            <span>Real products add constraints</span>
            <p>
              Voltage levels, timing margins, pin count, memory limits, power budget, and safety
              rules all influence which peripherals and architectures make sense.
            </p>
          </article>
        </div>

        <div className="callout">
          <strong>One sentence to keep</strong>
          <span>
            A microcontroller is not only a CPU running code. It is a timed network of memories,
            buses, peripherals, pins, and driver stages that continuously translates between digital
            state and the physical world.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterFifteen({ chapterLabel = "Chapter 16", chapterNumber = "16" }) {
  return (
    <section className="chapter" id="chapter-16">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Inside a real microcontroller: core, memory, peripherals, and system flow</h2>
        <p>
          This chapter turns the microcontroller into a machine you can actually picture. We map the
          CPU, flash, RAM, clocks, buses, GPIO, timers, ADC, DAC, DMA, interrupts, cache, and
          communication peripherals, then animate how sensors, memory, logic, and actuators work
          together as one live system. The aim is not shallow familiarity. The aim is for a learner
          to be able to imagine a working controller in motion and reason about it with growing
          engineering confidence.
        </p>
      </div>

      <ChapterPrimer
        title="Four anchors before you tour the whole controller"
        items={microcontrollerPrimerItems}
        callout={{
          title: "Best way to read this chapter",
          body: "Do not memorize isolated block names. Keep asking what physical signal or data is entering, where it is stored, which hardware block works on it, and how the final effect leaves the chip again.",
        }}
      />

      <section className="chapter-section" id="chapter-16-atlas">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Map the whole controller before diving into details"
          description="Start by naming the major blocks correctly so later animations feel like one machine seen from several angles."
        />
        <InteractionGuide
          title="How to use the system atlas"
          items={[
            {
              title: "Select one block at a time",
              body: "Lock in what the block does, then notice which neighboring blocks it depends on.",
            },
            {
              title: "Read the beginner and expert views together",
              body: "The chapter is designed to stay accessible while still introducing the language used by real engineers.",
            },
            {
              title: "Use relationships, not lists",
              body: "The fastest path to expertise is understanding which blocks cooperate rather than memorizing names in isolation.",
            },
          ]}
        />
        <SystemAtlasLab />
        <RecapCheckpoint
          title="Checkpoint: a microcontroller is a connected machine, not only a CPU"
          items={[
            "CPU, clocks, memories, buses, and peripherals all contribute to one runtime story.",
            "GPIO, timers, ADC, DAC, communication blocks, DMA, and interrupts exist so the CPU does not have to do every low-level task manually.",
            "You should already be able to explain why flash, RAM, and bus fabric matter even before any application-specific code is written.",
          ]}
          question="Could you explain why saying 'the CPU does everything' is too shallow to describe a real microcontroller?"
        />
      </section>

      <section className="chapter-section" id="chapter-16-gpio">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Pins, GPIO, alternate functions, and the edge of the chip"
          description="Learn how one physical pin can act as an input, output, analog input, or peripheral signal depending on configuration and hardware routing."
        />
        <GpioLab />
        <RecapCheckpoint
          title="Checkpoint: pins are configurable interfaces, not magic wires"
          items={[
            "Input flow begins outside the chip and becomes readable state later.",
            "Output flow begins with an internal register or peripheral and becomes a physical voltage at the pin.",
            "Alternate functions let timers, SPI, I2C, UART, and other engines borrow the pin instead of plain GPIO control.",
          ]}
          question="If a peripheral is configured correctly internally but nothing appears on the pin, do you know which pin-routing assumptions to check?"
        />
        <DeepDiveBlock
          title="Why electrical thinking matters at the GPIO boundary"
          summary="This is where software starts touching physics directly."
          points={[
            {
              title: "Voltage and current limits",
              body: "Pins only tolerate certain voltage ranges and source or sink limited current, which is why large loads need driver stages rather than direct pin drive.",
            },
            {
              title: "Pull resistors and noise",
              body: "Floating inputs can produce random readings. Pull-up and pull-down networks exist so the hardware has a stable default state.",
            },
            {
              title: "Protection and real products",
              body: "ESD protection, filtering, level shifting, and transceivers often sit between the outside world and the MCU pin in serious hardware.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-16-comms">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Communication peripherals and how sensors connect"
          description="See how SPI, I2C, UART, and CAN move data between the controller and the outside world, and how that shapes sensor and device connection choices."
        />
        <CommunicationLab />
        <RecapCheckpoint
          title="Checkpoint: protocol choice is part of system design"
          items={[
            "SPI, I2C, UART, and CAN solve different wiring, topology, timing, and robustness problems.",
            "Many modern sensors are not analog at all; they are digital devices connected through communication peripherals.",
            "A protocol is more than pins. It includes timing rules, framing, electrical assumptions, and software handling.",
          ]}
          question="Could you explain why two sensors that both measure motion might still use different communication links on different products?"
        />
        <DeepDiveBlock
          title="How to choose a communication peripheral scientifically"
          summary="Pick by constraints, not by habit."
          points={[
            {
              title: "Wire count versus speed",
              body: "I2C saves wires, SPI often increases throughput, UART keeps simple point-to-point links easy, and CAN adds robustness and multi-node behavior.",
            },
            {
              title: "Board-level reality",
              body: "Connector size, noise, cable length, available pins, and whether devices must share the same bus all change the right answer.",
            },
            {
              title: "Software consequences",
              body: "Protocol handling affects buffering, interrupts, DMA use, bus arbitration, error handling, and how easy the system is to debug in the field.",
            },
          ]}
        />
        <DeepDiveBlock
          title="Typical sensor and device connection patterns"
          summary="Open this when you want a practical board-level view of who usually connects how."
        >
          <div className="connection-pattern-grid">
            {connectionPatterns.map((item) => (
              <article key={item.title} className="connection-pattern-card">
                <span>{item.title}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </DeepDiveBlock>
      </section>

      <section className="chapter-section" id="chapter-16-analog">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Analog peripherals, timers, ADC, DAC, and PWM"
          description="Learn how the MCU measures real voltages, creates analog-style outputs, and uses timer-driven waveforms to control loads and sampling schedules."
        />
        <AnalogPeripheralLab />
        <RecapCheckpoint
          title="Checkpoint: ADC, DAC, and PWM each solve different bridges between numbers and physics"
          items={[
            "ADC turns a real voltage into a number.",
            "DAC turns a number into a real analog level.",
            "PWM uses timing to create a controllable average physical effect even when the signal is still digitally switching.",
          ]}
          question="Could you explain why many motor and LED systems use PWM even if the MCU also has ordinary GPIO outputs?"
        />
        <DeepDiveBlock
          title="What analog honesty looks like in embedded systems"
          summary="Good analog teaching prevents a lot of later confusion."
          points={[
            {
              title: "References matter",
              body: "ADC and DAC quality depends on the reference voltage and the cleanliness of the analog path, not only on the converter resolution listed in the datasheet.",
            },
            {
              title: "Sampling is a timing decision",
              body: "Choosing when to sample can matter almost as much as choosing how many bits of resolution you have.",
            },
            {
              title: "Actuation usually needs power electronics",
              body: "The MCU often creates the command signal, but a MOSFET, gate driver, amplifier, or H-bridge usually delivers the real energy to the load.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-16-buses">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="Internal buses, DMA, cache, and memory traffic"
          description="Follow real transfers inside the chip so instruction fetch, RAM updates, memory-mapped peripherals, DMA, and cache stop feeling abstract."
        />
        <BusMemoryLab />
        <RecapCheckpoint
          title="Checkpoint: internal traffic shapes performance and behavior"
          items={[
            "Instruction fetch, RAM access, peripheral register reads, and DMA all compete for internal transport resources.",
            "Memory-mapped peripherals work because the bus fabric routes certain addresses to hardware blocks rather than only to RAM.",
            "Cache can accelerate larger systems, but it is optional and can complicate deterministic behavior.",
          ]}
          question="If an MCU feels fast in benchmarks but still misses a real-time job, would you know why internal traffic might be the real problem?"
        />
      </section>

      <section className="chapter-section" id="chapter-16-system-movie">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 6)}
          title="Whole-system animation: sensor to memory to logic to actuator"
          description="Use complete scenarios to picture the controller as a live closed-loop machine instead of a stack of disconnected textbook blocks."
        />
        <WholeSystemMovieLab />
        <RecapCheckpoint
          title="Checkpoint: can you narrate a microcontroller as one continuous chain?"
          items={[
            "Real products combine sensing, storage, computation, timing, and actuation in one repeated system movie.",
            "Peripherals exist to translate between the outside world and internal digital state efficiently and predictably.",
            "The strongest mental model is causal: what changed first, what stored it, what decided next, and what physical effect followed?",
          ]}
          question="Could you describe one complete embedded control loop without skipping the path through peripherals and memory?"
        />
        <DeepDiveBlock
          title="Why this chapter matters before harder embedded topics"
          summary="This is the picture you want in your head before drivers, RTOS work, or advanced architecture."
          points={[
            {
              title: "Driver design",
              body: "Good driver code is just a disciplined way of controlling these peripherals and reading back their state honestly.",
            },
            {
              title: "Real-time systems",
              body: "Once the whole controller movie is clear, interrupt latency, timer deadlines, and DMA strategy become much easier to reason about.",
            },
            {
              title: "Board-level design",
              body: "Hardware and firmware stop feeling separate when you can trace a signal all the way from a sensor or connector to the exact peripheral, bus path, memory region, and actuator output.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-16-playbook">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 7)}
          title="Peripheral playbook and final mental model"
          description="Finish by widening the picture to include supervision, low power, debug, and other hardware helpers that serious products often rely on."
        />
        <PeripheralPlaybookPanel />
        <RecapCheckpoint
          title="Final checkpoint: what beginner-to-expert progress should look like here"
          items={[
            "You should be able to picture a complete controller with CPU, memories, buses, peripherals, pins, and driver stages working together.",
            "You should be able to explain how sensors and actuators connect through specific peripheral paths rather than vague 'input' and 'output' words.",
            "You should be ready to reason about later embedded topics using one connected hardware-software system model.",
          ]}
          question="If someone handed you a new MCU datasheet, could you now look for clocks, memories, buses, GPIO, timers, ADC, communication blocks, and driver needs with a much clearer purpose?"
        />
      </section>
    </section>
  );
}

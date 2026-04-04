import { useEffect, useMemo, useRef, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import FancySelect from "../components/FancySelect";
import InteractionGuide from "../components/InteractionGuide";
import MemoryMap from "../components/MemoryMap";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import { pressureScenario, protocolScenario, signalScenario } from "../data/chapterFive";
import {
  buildPressureMemory,
  buildProtocolBuffer,
  buildSignalWaveform,
  detectSignalEvent,
  evaluatePressureProgram,
  evaluateProtocolProgram,
} from "../utils/chapterFive";
import { formatAddress, toHex } from "../utils/bitMath";
import { formatSectionLabel } from "../utils/courseLabels";

function PseudoCode({ title, lines }) {
  return (
    <div className="pseudo-shell">
      <strong>{title}</strong>
      <div className="pseudo-code">
        {lines.map((line, index) => (
          <div key={`${title}-${index}`} className="pseudo-line">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>{line}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PressureFlowLab() {
  const [sourceAddress, setSourceAddress] = useState("0x7000");
  const [threshold, setThreshold] = useState(140);
  const [tick, setTick] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => setTick((current) => current + 1), 900);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  const sensorValue = useMemo(
    () => Math.max(0, Math.min(255, Math.round(120 + 85 * Math.sin(tick / 1.8)))),
    [tick]
  );
  const program = useMemo(
    () => evaluatePressureProgram(sourceAddress, threshold, sensorValue),
    [sourceAddress, threshold, sensorValue]
  );
  const memoryCells = useMemo(
    () => buildPressureMemory(sensorValue, program.ledOn),
    [sensorValue, program.ledOn]
  );

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Live control loop</p>
            <h3>Watch input become memory and memory become output</h3>
          </div>
          <div className="button-row chapter-lab-controls">
            <button
              type="button"
              className={`toggle-button ${autoPlay ? "on" : ""}`}
              onClick={() => setAutoPlay((current) => !current)}
            >
              {autoPlay ? "Auto play" : "Manual"}
            </button>
            <button type="button" className="chip-button" onClick={() => setTick((current) => current + 1)}>
              Step
            </button>
          </div>
        </div>
        <div className="device-stage">
          <div className="device-card sensor-device">
            <span>Pressure sensor</span>
            <strong>{sensorValue}</strong>
            <small>live sample</small>
          </div>
          <div className="flow-column">
            <div className="flow-line active">
              <span className="flow-dot" />
            </div>
            <span>memory write</span>
          </div>
          <div className="device-card scale-device">
            <span>Computer memory</span>
            <strong>{formatAddress(pressureScenario.sensorAddress)}</strong>
            <small>sensor register</small>
          </div>
          <div className="flow-column">
            <div className={`flow-line ${program.correctSource ? "active" : ""}`}>
              <span className="flow-dot" />
            </div>
            <span>your logic</span>
          </div>
          <div className={`device-card led-device ${program.ledOn ? "on" : ""}`}>
            <span>LED output</span>
            <strong>{program.ledOn ? "ON" : "OFF"}</strong>
            <small>action</small>
          </div>
        </div>

        <PseudoCode
          title="Beginner logic"
          lines={[
            <>
              reading = MEM[
              <FancySelect
                inline
                ariaLabel="Pressure source address"
                value={sourceAddress}
                onChange={setSourceAddress}
                options={pressureScenario.sourceOptions.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
              ]
            </>,
            <>
              if reading &gt;
              <FancySelect
                inline
                ariaLabel="Pressure threshold"
                value={threshold}
                onChange={(nextValue) => setThreshold(Number(nextValue))}
                options={pressureScenario.thresholdOptions.map((option) => ({
                  label: String(option),
                  value: option,
                }))}
              />
            </>,
            <>LED = ON else LED = OFF</>,
          ]}
        />

        <div className="callout">
          <strong>What is happening?</strong>
          <span>
            The pressure sensor keeps dumping a fresh value into memory. Your tiny program reads
            one memory location and decides whether to turn the LED on. If you read the wrong
            address, you are reacting to the wrong data. This is the essence of embedded software:
            physical signals become memory values, then software decisions become hardware outputs.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Live registers</p>
        <h3>Data arrives in memory before your code makes sense of it</h3>
        <MemoryMap
          title="Pressure sensor memory"
          subtitle={`Program reads ${sourceAddress} and sees ${program.readValue}`}
          cells={memoryCells}
          activeGroup={sourceAddress === "0x7000" ? "sensor" : sourceAddress === "0x7001" ? "noise" : "noise"}
          columns={2}
        />
      </div>
    </div>
  );
}

function SignalFlowLab() {
  const [mode, setMode] = useState("rising");
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const previousValueRef = useRef(0);
  const waveform = useMemo(() => buildSignalWaveform(step), [step]);
  const currentValue = waveform[step % waveform.length].value;
  const activeMode = signalScenario.modes.find((item) => item.id === mode) ?? signalScenario.modes[0];

  useEffect(() => {
    setCount(0);
    setStep(0);
    previousValueRef.current = 0;
  }, [mode]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStep((current) => {
        const next = current + 1;
        const currentPattern = buildSignalWaveform(current);
        const nextPattern = buildSignalWaveform(next);
        const previous = currentPattern[current % currentPattern.length].value;
        const nextValue = nextPattern[next % nextPattern.length].value;

        if (detectSignalEvent(mode, previous, nextValue)) {
          setCount((value) => value + 1);
        }

        previousValueRef.current = nextValue;
        return next;
      });
    }, 800);

    return () => window.clearInterval(timer);
  }, [autoPlay, mode]);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Event detector</p>
            <h3>Read the waveform like an embedded event counter</h3>
          </div>
          <div className="button-row chapter-lab-controls">
            <button
              type="button"
              className={`toggle-button ${autoPlay ? "on" : ""}`}
              onClick={() => setAutoPlay((current) => !current)}
            >
              {autoPlay ? "Auto play" : "Manual"}
            </button>
            <button type="button" className="chip-button" onClick={() => setStep((current) => current + 1)}>
              Step
            </button>
          </div>
        </div>
        <div className="button-row">
          {signalScenario.modes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${mode === item.id ? "active" : ""}`}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <PseudoCode
          title="Embedded reaction"
          lines={[
            <>
              when signal has a <strong>{activeMode.label}</strong>
            </>,
            <>pulse_count = pulse_count + 1</>,
            <>show pulse_count on display</>,
          ]}
        />

        <div className="stat-grid">
          <div className="stat-box">
            <span>Current level</span>
            <strong>{currentValue}</strong>
          </div>
          <div className="stat-box">
            <span>Trigger style</span>
            <strong>{activeMode.label}</strong>
          </div>
          <div className="stat-box">
            <span>Count</span>
            <strong>{count}</strong>
          </div>
        </div>

        <div className="callout">
          <strong>Why this matters in embedded</strong>
          <span>
            Many real systems count pulses from wheels, hall sensors, buttons or encoders. Your
            code watches the incoming electrical signal and takes action when the event you care
            about happens. This is the first step toward interrupts, timers, motor control, and
            digital communication timing.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Signal waveform</p>
        <h3>A signal is just 0 and 1 changing over time</h3>
        <div className="waveform-grid" aria-label="Signal waveform">
          {waveform.map((sample) => (
            <div
              key={sample.index}
              className={`wave-sample ${sample.value ? "high" : "low"} ${sample.active ? "active" : ""}`}
            >
              <span>{sample.value}</span>
            </div>
          ))}
        </div>
        <p className="panel-copy">{activeMode.explain}</p>
      </div>
    </div>
  );
}

function ProtocolFlowLab() {
  const [startByte, setStartByte] = useState("0xAA");
  const [valueIndex, setValueIndex] = useState(2);
  const [action, setAction] = useState("display");
  const [packetIndex, setPacketIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(
      () => setPacketIndex((current) => (current + 1) % protocolScenario.packets.length),
      1200
    );
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  const packet = protocolScenario.packets[packetIndex];
  const program = useMemo(
    () => evaluateProtocolProgram(packet, startByte, valueIndex, action),
    [packet, startByte, valueIndex, action]
  );
  const bufferCells = useMemo(
    () => buildProtocolBuffer(packet, program.parsedValue, Boolean(program.actionState)),
    [packet, program.parsedValue, program.actionState]
  );

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Protocol parser movie</p>
            <h3>Step through raw bytes turning into application meaning</h3>
          </div>
          <div className="button-row chapter-lab-controls">
            <button
              type="button"
              className={`toggle-button ${autoPlay ? "on" : ""}`}
              onClick={() => setAutoPlay((current) => !current)}
            >
              {autoPlay ? "Auto play" : "Manual"}
            </button>
            <button
              type="button"
              className="chip-button"
              onClick={() => setPacketIndex((current) => (current + 1) % protocolScenario.packets.length)}
            >
              Next packet
            </button>
          </div>
        </div>
        <div className="protocol-stage">
          <div className="device-card protocol-device">
            <span>UART sender</span>
            <strong>{packet.map((byte) => toHex(byte)).join(" ")}</strong>
            <small>incoming bytes</small>
          </div>
          <div className="flow-column">
            <div className="flow-line active">
              <span className="flow-dot" />
            </div>
            <span>RX buffer</span>
          </div>
          <div className="device-card protocol-device target">
            <span>{action === "display" ? "Display" : "Alarm"}</span>
            <strong>{action === "display" ? program.parsedValue : program.actionState ? "ON" : "OFF"}</strong>
            <small>application action</small>
          </div>
        </div>

        <PseudoCode
          title="Protocol parser"
          lines={[
            <>
              if rx[0] =={" "}
              <FancySelect
                inline
                ariaLabel="Protocol start byte"
                value={startByte}
                onChange={setStartByte}
                options={protocolScenario.startOptions.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            </>,
            <>
              data = rx[
              <FancySelect
                inline
                ariaLabel="Protocol value index"
                value={valueIndex}
                onChange={(nextValue) => setValueIndex(Number(nextValue))}
                options={protocolScenario.valueIndexOptions.map((option) => ({
                  label: String(option),
                  value: option,
                }))}
              />
              ]
            </>,
            <>
              send data to{" "}
              <FancySelect
                inline
                ariaLabel="Protocol action"
                value={action}
                onChange={setAction}
                options={protocolScenario.actionOptions.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            </>,
          ]}
        />

        <div className="callout">
          <strong>What this teaches</strong>
          <span>
            Communication protocols keep feeding bytes into memory. Your embedded code must know
            where a packet starts, which byte carries the meaning you want, and what output
            action should happen next. Real firmware spends a lot of time turning raw byte streams
            into structured meaning and safe system behavior.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Receive buffer</p>
        <h3>Continuous communication becomes useful only after parsing</h3>
        <MemoryMap
          title="Protocol bytes in memory"
          subtitle={program.validStart ? `Valid frame, parsed value ${program.parsedValue}` : "Wrong start byte selected"}
          cells={bufferCells}
          columns={4}
        />
      </div>
    </div>
  );
}

export default function ChapterFive({ chapterLabel = "Chapter 5", chapterNumber = "5" }) {
  return (
    <section className="chapter" id="chapter-5">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Input, memory, decisions, and output: the embedded control loop</h2>
        <p>
          This chapter is where the course starts to feel like a real embedded system rather than a
          set of isolated facts. Sensors, signals, and serial packets all become meaningful only
          when software reads them from memory, applies logic, and drives an output in time.
        </p>
      </div>

      <ChapterPrimer
        title="The common pattern behind many embedded products"
        items={[
          {
            title: "The outside world changes first",
            body: "A sensor, button, protocol line, wheel encoder, or actuator feedback source changes in the physical world before your program reacts.",
          },
          {
            title: "Hardware captures the state",
            body: "Registers, buffers, and memory-mapped peripherals hold the latest sampled value so software can read it safely.",
          },
          {
            title: "Software decides what it means",
            body: "The program compares, filters, counts, validates, or parses the incoming data according to the system's rules.",
          },
          {
            title: "An output changes the machine",
            body: "The result might turn on an LED, change PWM duty, trigger an alarm, move a motor, or send a packet back out.",
          },
        ]}
        callout={{
          title: "Expert habit",
          body: "When you study any embedded feature, trace the whole loop: source of data, storage location, decision rule, timing constraint, and final physical effect.",
        }}
      />

      <section className="chapter-section" id="chapter-5-pressure">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="A pressure sensor keeps writing to memory and your logic turns on an LED"
          description="Pick the memory source and threshold, then watch a live sensor value become a software decision and finally an output register change."
        />
        <InteractionGuide
          title="How to read the sensor-to-output animation"
          items={[
            {
              title: "First watch the left side",
              body: "The sensor changes first. That keeps the cause-and-effect order honest.",
            },
            {
              title: "Then watch memory",
              body: "The sample must land in a register or memory slot before your code can read it.",
            },
            {
              title: "Finally watch the output",
              body: "The LED is the last consequence of the chain, not the first event.",
            },
          ]}
        />
        <PressureFlowLab />
        <RecapCheckpoint
          title="Checkpoint: sensors become decisions only after storage and logic"
          items={[
            "Physical input changes first, then hardware captures the value, then software reacts.",
            "Reading the wrong address means reacting to the wrong source.",
            "Output action is the end of the loop, not the beginning.",
          ]}
          question="Could you explain the entire pressure-to-LED chain without skipping the memory step?"
        />
        <DeepDiveBlock
          title="Why this tiny example scales to real control systems"
          summary="The same flow appears in fans, pumps, motor drives, and battery controllers."
          points={[
            {
              title: "Sampling matters",
              body: "Real products care when the sample was taken, not just what its value was.",
            },
            {
              title: "Source integrity",
              body: "Choosing the wrong register or stale value is enough to break a control loop even if the decision code looks correct.",
            },
            {
              title: "General rule",
              body: "Most embedded loops are input capture plus memory plus logic plus output timing.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-5-signals">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Signals are changes over time that embedded software can react to"
          description="Choose the trigger type and watch a pulse signal count events the way a wheel sensor, hall sensor, encoder, or digital input would in a real product."
        />
        <InteractionGuide
          title="How to read the signal animation"
          items={[
            {
              title: "Track the active sample",
              body: "The highlighted waveform cell is the current instant the software is judging.",
            },
            {
              title: "Change the trigger style",
              body: "Rising, falling, and both-edge logic count different kinds of events even on the same signal.",
            },
            {
              title: "Use manual stepping",
              body: "Stepping one sample at a time is the best way to build interrupt-style intuition.",
            },
          ]}
        />
        <SignalFlowLab />
        <RecapCheckpoint
          title="Checkpoint: event logic depends on changes over time"
          items={[
            "A digital signal is not only a value; it is a timeline of values.",
            "Edge detection compares what the signal was with what it became.",
            "This same reasoning later powers interrupts, counters, and protocol timing.",
          ]}
          question="Can you explain why counting edges is different from only reading a single HIGH or LOW?"
        />
        <DeepDiveBlock
          title="Why time-aware signals matter in real firmware"
          summary="This is the doorway to timers, captures, and interrupts."
          points={[
            {
              title: "Wheel and motor sensing",
              body: "Pulse timing can encode speed, direction, or position even though each sample is still just 0 or 1.",
            },
            {
              title: "Debounce and filtering",
              body: "Real signals may chatter or bounce, so software often cares about event timing quality as well as edge count.",
            },
            {
              title: "Scheduling",
              body: "Time-based input handling is one reason embedded work cares so much about clocks and deterministic latency.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-5-protocol">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="A communication protocol keeps streaming bytes into memory"
          description="Select a parse rule and see how raw bytes in a receive buffer become structured meaning, application state, and an output action."
        />
        <InteractionGuide
          title="How to read the protocol parser"
          items={[
            {
              title: "Watch the incoming frame first",
              body: "The UART sender provides raw bytes with no built-in meaning yet.",
            },
            {
              title: "Then apply the parse rule",
              body: "Start byte, field position, and action rule are what turn those bytes into structured meaning.",
            },
            {
              title: "Check the output device last",
              body: "The display or alarm only changes after the parser decides the frame is valid and meaningful.",
            },
          ]}
        />
        <ProtocolFlowLab />
        <RecapCheckpoint
          title="Checkpoint: protocols are bytes plus rules"
          items={[
            "Raw bytes are not useful until the firmware knows where the frame starts and which field matters.",
            "A receive buffer is only temporary storage; parsing is what creates application meaning.",
            "The same transport bytes can trigger different outputs depending on the parser logic.",
          ]}
          question="If a packet looks wrong on the screen, do you know whether the bytes are wrong or the parser rule is wrong?"
        />
        <DeepDiveBlock
          title="Why protocol literacy matters everywhere in embedded work"
          summary="Serial links, CAN messages, and sensor frames all follow the same logic."
          points={[
            {
              title: "Framing",
              body: "You need a reliable way to detect where a frame starts and ends before you can trust field positions.",
            },
            {
              title: "Validation",
              body: "Real firmware often adds checksums, lengths, or message IDs because blindly trusting raw bytes is unsafe.",
            },
            {
              title: "Application boundary",
              body: "The parser is the bridge between transport-level bytes and product-level behavior.",
            },
          ]}
        />
      </section>
    </section>
  );
}

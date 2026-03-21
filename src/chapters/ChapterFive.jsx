import { useEffect, useMemo, useRef, useState } from "react";
import MemoryMap from "../components/MemoryMap";
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

  useEffect(() => {
    const timer = window.setInterval(() => setTick((current) => current + 1), 900);
    return () => window.clearInterval(timer);
  }, []);

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
              <select value={sourceAddress} onChange={(event) => setSourceAddress(event.target.value)}>
                {pressureScenario.sourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              ]
            </>,
            <>
              if reading &gt;
              <select value={threshold} onChange={(event) => setThreshold(Number(event.target.value))}>
                {pressureScenario.thresholdOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>,
            <>LED = ON else LED = OFF</>,
          ]}
        />

        <div className="callout">
          <strong>What is happening?</strong>
          <span>
            The pressure sensor keeps dumping a fresh value into memory. Your tiny program reads
            one memory location and decides whether to turn the LED on. If you read the wrong
            address, you are reacting to the wrong data.
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
  }, [mode]);

  return (
    <div className="chapter-grid">
      <div className="panel">
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
            about happens.
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

  useEffect(() => {
    const timer = window.setInterval(
      () => setPacketIndex((current) => (current + 1) % protocolScenario.packets.length),
      1200
    );
    return () => window.clearInterval(timer);
  }, []);

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
              <select value={startByte} onChange={(event) => setStartByte(event.target.value)}>
                {protocolScenario.startOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>,
            <>
              data = rx[
              <select value={valueIndex} onChange={(event) => setValueIndex(Number(event.target.value))}>
                {protocolScenario.valueIndexOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              ]
            </>,
            <>
              send data to{" "}
              <select value={action} onChange={(event) => setAction(event.target.value)}>
                {protocolScenario.actionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>,
          ]}
        />

        <div className="callout">
          <strong>What this teaches</strong>
          <span>
            Communication protocols keep feeding bytes into memory. Your embedded code must know
            where a packet starts, which byte carries the meaning you want, and what output
            action should happen next.
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

export default function ChapterFive({ chapterLabel = "Chapter 5" }) {
  return (
    <section className="chapter" id="chapter-5">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Input, memory, decisions and output</h2>
        <p>
          This chapter shows the embedded loop in a very simple way: hardware produces data,
          that data lands in memory, software reads it, and then software drives an output. The
          goal is not exact syntax yet. The goal is understanding the flow of information.
        </p>
      </div>

      <section className="chapter-section" id="chapter-5-pressure">
        <SectionHeading
          eyebrow="Flow 1"
          title="A pressure sensor keeps writing to memory and your logic turns on an LED"
          description="Pick the memory source and threshold, then watch the sensor continuously update the computer and the LED react to your program."
        />
        <PressureFlowLab />
      </section>

      <section className="chapter-section" id="chapter-5-signals">
        <SectionHeading
          eyebrow="Flow 2"
          title="Signals are changes over time that embedded software can react to"
          description="Choose the trigger type and watch a pulse signal count events the way a wheel sensor, button, or hall sensor would in a real product."
        />
        <SignalFlowLab />
      </section>

      <section className="chapter-section" id="chapter-5-protocol">
        <SectionHeading
          eyebrow="Flow 3"
          title="A communication protocol keeps streaming bytes into memory"
          description="Select a simple parse rule and see how raw bytes in a receive buffer become a display update or an alarm action."
        />
        <ProtocolFlowLab />
      </section>
    </section>
  );
}

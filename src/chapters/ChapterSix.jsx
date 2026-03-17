import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { compilerExample, embeddedExamples, processingSystems, systemUseCases, timingPresets } from "../data/chapterSix";
import { buildTimelineSegments, evaluateTimingPreset, summarizeEmbeddedExample, systemDecision } from "../utils/chapterSix";

function EmbeddedMeaningLab() {
  const [selectedId, setSelectedId] = useState(embeddedExamples[0].id);
  const selected = embeddedExamples.find((item) => item.id === selectedId) ?? embeddedExamples[0];
  const summary = summarizeEmbeddedExample(selected);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {embeddedExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              className={`chip-button ${selectedId === example.id ? "active" : ""}`}
              onClick={() => setSelectedId(example.id)}
            >
              {example.label}
            </button>
          ))}
        </div>

        <div className="embedded-loop-card">
          <span>Analogy</span>
          <h3>{selected.analogy}</h3>
          <p className="panel-copy">{selected.whyEmbedded}</p>
        </div>

        <div className="sense-think-act">
          <div className="sta-block input">
            <span>Sense</span>
            <strong>{selected.inputs.join(" + ")}</strong>
          </div>
          <div className="sta-arrow" />
          <div className="sta-block think">
            <span>Think</span>
            <strong>{selected.thinking}</strong>
          </div>
          <div className="sta-arrow" />
          <div className="sta-block output">
            <span>Act</span>
            <strong>{selected.outputs.join(" + ")}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Simple definition</p>
        <h3>Embedded programming means writing software that lives inside a product</h3>
        <div className="bullet-stack">
          {summary.map((item) => (
            <div key={item} className="bullet-card">
              {item}
            </div>
          ))}
        </div>
        <div className="callout">
          <strong>Easy way to remember it</strong>
          <span>
            A desktop computer is built to run many different programs for you. An embedded system
            is a computer hidden inside a machine, built mainly to run one product well.
          </span>
        </div>
      </div>
    </div>
  );
}

function TimingLab() {
  const [presetId, setPresetId] = useState(timingPresets[0].id);
  const [speedScale, setSpeedScale] = useState(1);
  const preset = timingPresets.find((item) => item.id === presetId) ?? timingPresets[0];
  const result = useMemo(() => evaluateTimingPreset(preset, speedScale), [preset, speedScale]);
  const segments = useMemo(() => buildTimelineSegments(result.scaledTasks), [result.scaledTasks]);
  const total = Math.max(preset.deadlineMs, result.totalMs);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {timingPresets.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${presetId === item.id ? "active" : ""}`}
              onClick={() => setPresetId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="control-row">
          <label htmlFor="speedScale">How optimized is the code?</label>
          <div className="slider-row">
            <input
              id="speedScale"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speedScale}
              onChange={(event) => setSpeedScale(Number(event.target.value))}
            />
            <div className="number-input timing-pill">{speedScale.toFixed(1)}x</div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Deadline</span>
            <strong>{preset.deadlineMs} ms</strong>
          </div>
          <div className="stat-box">
            <span>Total loop time</span>
            <strong>{result.totalMs} ms</strong>
          </div>
          <div className="stat-box">
            <span>Status</span>
            <strong>{result.meetsDeadline ? "On time" : "Deadline missed"}</strong>
          </div>
        </div>

        <div className="callout">
          <strong>What is a time-bound system?</strong>
          <span>
            A time-bound or real-time system does not only need the correct answer. It needs the
            correct answer before the deadline. Missing the time can be as bad as giving a wrong result.
          </span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Deadline timeline</p>
        <h3>Real-time means predictable finishing time</h3>
        <div className="timeline-shell">
          <div className="deadline-marker" style={{ left: `${(preset.deadlineMs / total) * 100}%` }}>
            deadline
          </div>
          <div className="timeline-bar">
            {segments.map((segment) => (
              <div
                key={segment.name}
                className="timeline-segment"
                style={{
                  width: `${(segment.actualDurationMs / total) * 100}%`,
                }}
              >
                <span>{segment.name}</span>
                <small>{segment.actualDurationMs} ms</small>
              </div>
            ))}
          </div>
        </div>
        <p className="panel-copy">
          {result.meetsDeadline
            ? `This loop finishes ${result.slackMs} ms before the deadline, so the system is still predictable.`
            : `This loop misses the deadline by ${Math.abs(result.slackMs)} ms, so the system may react too late in the real world.`}
        </p>
      </div>
    </div>
  );
}

function ProcessingLab() {
  const [selectedSystem, setSelectedSystem] = useState("mcu");
  const [useCaseId, setUseCaseId] = useState(systemUseCases[0].id);
  const system = processingSystems.find((item) => item.id === selectedSystem) ?? processingSystems[0];
  const useCase = systemUseCases.find((item) => item.id === useCaseId) ?? systemUseCases[0];
  const verdict = systemDecision(useCase, selectedSystem);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="button-row">
          {processingSystems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${selectedSystem === item.id ? "active" : ""}`}
              onClick={() => setSelectedSystem(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="chip-diagram">
          {system.builtIn.map((block) => (
            <div key={block} className="chip-block">
              {block}
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>Analogy</strong>
          <span>{system.analogy}</span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Pick a product</p>
        <div className="button-row">
          {systemUseCases.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${useCaseId === item.id ? "active" : ""}`}
              onClick={() => setUseCaseId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="stat-grid">
          <div className="stat-box">
            <span>Use case</span>
            <strong>{useCase.label}</strong>
          </div>
          <div className="stat-box">
            <span>Main need</span>
            <strong>{useCase.needs}</strong>
          </div>
          <div className="stat-box">
            <span>Natural fit</span>
            <strong>{useCase.recommended === "mcu" ? "Microcontroller" : "Microprocessor"}</strong>
          </div>
        </div>

        <div className="callout">
          <strong>MCU vs MPU</strong>
          <span>{verdict.message} {system.why}</span>
        </div>
      </div>
    </div>
  );
}

function CompilerLab() {
  const [stageIndex, setStageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const stage = compilerExample.stages[stageIndex];

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % compilerExample.stages.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className="chapter-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Human side</p>
            <h3>Code is a written description of what you want the machine to do</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto explain" : "Step manually"}
          </button>
        </div>

        <div className="source-card">
          {compilerExample.sourceCode.map((line) => (
            <div key={line} className="source-line">
              {line}
            </div>
          ))}
        </div>

        <div className="button-row compiler-steps">
          {compilerExample.stages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${stageIndex === index ? "active" : ""}`}
              onClick={() => setStageIndex(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Translation flow</p>
        <h3>{stage.label}</h3>
        <p className="panel-copy">{stage.explain}</p>

        <div className="compiler-flow">
          {stage.output.map((item, index) => (
            <div key={`${stage.id}-${item}`} className="compiler-node" style={{ animationDelay: `${index * 120}ms` }}>
              {item}
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>Easy analogy</strong>
          <span>
            Your code is like a message in human language. The compiler is the translator.
            Machine code is the translated version that the CPU can actually understand and run.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterSix() {
  return (
    <section className="chapter" id="chapter-6">
      <div className="chapter-header">
        <p className="chapter-kicker">Chapter 6</p>
        <h2>What embedded programming really is</h2>
        <p>
          This chapter steps back and explains the big picture. It answers what embedded
          programming is, why timing matters, how microcontrollers and microprocessors differ,
          and how your source code becomes something a real machine can execute.
        </p>
      </div>

      <section className="chapter-section" id="chapter-6-meaning">
        <SectionHeading
          eyebrow="Big picture"
          title="Embedded programming is software inside a real machine"
          description="Use everyday product examples to see the common pattern: sense the world, make a decision, then control hardware."
        />
        <EmbeddedMeaningLab />
      </section>

      <section className="chapter-section" id="chapter-6-timing">
        <SectionHeading
          eyebrow="Timing"
          title="Time-bound systems must finish their work before the deadline"
          description="A real-time system is not just about being fast. It is about being predictably on time whenever the real world expects a response."
        />
        <TimingLab />
      </section>

      <section className="chapter-section" id="chapter-6-systems">
        <SectionHeading
          eyebrow="Hardware"
          title="Microcontroller vs microprocessor"
          description="Compare the two and connect them to real products so the difference feels practical instead of abstract."
        />
        <ProcessingLab />
      </section>

      <section className="chapter-section" id="chapter-6-compiler">
        <SectionHeading
          eyebrow="Toolchain"
          title="Code is written by humans, machine instructions are executed by the CPU"
          description="Follow one tiny example from source code to compiler output to hardware action."
        />
        <CompilerLab />
      </section>
    </section>
  );
}

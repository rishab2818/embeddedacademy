import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import { compilerExample, embeddedExamples, processingSystems, systemUseCases, timingPresets } from "../data/chapterSix";
import { formatSectionLabel } from "../utils/courseLabels";
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
            The more advanced you get, the more you will see that embedded work is really the art
            of turning software into dependable physical behavior.
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
            correct answer before the deadline. Missing the time can be as bad as giving a wrong result,
            which is why timing analysis matters so much in control systems, robotics, power electronics,
            and avionics.
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
          <span>
            {verdict.message} {system.why} Strong embedded engineers learn to choose the right
            processing platform based on timing needs, memory needs, software complexity, power,
            cost, and reliability targets.
          </span>
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
            A serious embedded engineer eventually learns to reason across all three layers:
            source code, generated instructions, and hardware effect.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterSix({ chapterLabel = "Chapter 6", chapterNumber = "6" }) {
  return (
    <section className="chapter" id="chapter-6">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>What embedded programming really is, and why it is different from ordinary app coding</h2>
        <p>
          This chapter steps back from individual bytes and variables and looks at the whole
          discipline. It explains what makes embedded software special, why timing and deadlines
          matter, how hardware platforms are chosen, and how source code becomes machine action.
        </p>
      </div>

      <ChapterPrimer
        title="This is the chapter that explains what kind of engineer you are becoming"
        items={[
          {
            title: "Embedded software controls the physical world",
            body: "Unlike ordinary app software, embedded software is tightly connected to sensors, actuators, timing constraints, and hardware failures.",
          },
          {
            title: "Correct and on-time both matter",
            body: "In serious systems, a late answer can be functionally equivalent to a wrong answer, which changes how you design and test software.",
          },
          {
            title: "Platform choice is part of engineering",
            body: "Choosing between an MCU and an MPU is not fashion. It is a system-level decision involving timing, memory, interfaces, power, and complexity.",
          },
          {
            title: "Code is only one layer",
            body: "Expert embedded engineers connect requirements, source code, compiler output, machine instructions, registers, and hardware effects into one chain.",
          },
        ]}
        callout={{
          title: "Expert habit",
          body: "For any feature, be able to explain the whole path: requirement, input source, software decision, timing budget, machine instructions, and final physical output.",
        }}
      />

      <section className="chapter-section" id="chapter-6-meaning">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Embedded programming is software inside a real machine"
          description="Use real product examples to see the universal embedded loop: sense the world, update internal state, make a decision, and control hardware."
        />
        <InteractionGuide
          title="How to read the product examples"
          items={[
            {
              title: "Start with inputs",
              body: "Notice what the product is sensing from the world before any computation starts.",
            },
            {
              title: "Then read the internal decision",
              body: "The middle block is the software or control logic translating input into action.",
            },
            {
              title: "Finish with physical effect",
              body: "The output is what the product actually changes in the outside world.",
            },
          ]}
        />
        <EmbeddedMeaningLab />
        <RecapCheckpoint
          title="Checkpoint: embedded software exists to make a product behave"
          items={[
            "Embedded software is tightly tied to inputs, outputs, and the machine's physical job.",
            "The sense-think-act loop is the common shape behind many products.",
            "Product behavior, not abstract code elegance alone, is the final measure of success.",
          ]}
          question="Could you explain embedded programming without mentioning screens or apps at all?"
        />
        <DeepDiveBlock
          title="Why this mindset matters for expert growth"
          summary="This is the shift from coding to engineering."
          points={[
            {
              title: "Hardware responsibility",
              body: "Embedded engineers must reason about sensors, timing, power, failure modes, and physical outputs alongside the code itself.",
            },
            {
              title: "Traceability",
              body: "A good design connects product requirement all the way to software logic and hardware effect without losing the chain in the middle.",
            },
            {
              title: "System thinking",
              body: "This is why embedded development often feels more like system design than like ordinary application programming.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-6-timing">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Time-bound systems must finish their work before the deadline"
          description="A real-time system is not just about being fast. It is about being predictably on time every time the real world expects a response."
        />
        <TimingLab />
        <RecapCheckpoint
          title="Checkpoint: on-time matters as much as correct"
          items={[
            "A late answer can be equivalent to a wrong answer in a control system.",
            "Real-time design is about predictable completion, not only average speed.",
            "Timing budgets help engineers reason about whether a loop can always finish before its deadline.",
          ]}
          question="If a system gives the right output but misses the deadline, can that still be a failure?"
        />
        <DeepDiveBlock
          title="Real-time is about guarantees, not bragging rights"
          summary="Open this for the system-design consequence."
          points={[
            {
              title: "Worst-case thinking",
              body: "Engineers care about the slowest safe completion time, not only the average completion time seen in a happy-path demo.",
            },
            {
              title: "Control and safety",
              body: "Motor drives, medical devices, and flight systems cannot rely on occasional success. They need bounded response times.",
            },
            {
              title: "Scheduling consequence",
              body: "Timing pressure is why architects care about clocks, interrupts, DMA, priorities, and lean code paths.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-6-systems">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Microcontroller vs microprocessor"
          description="Compare the two and connect them to real products so the distinction feels like an engineering tradeoff, not a vocabulary test."
        />
        <InteractionGuide
          title="How to read the platform chooser"
          items={[
            {
              title: "Start with the product need",
              body: "The use case sets the real constraints: timing, software complexity, memory, cost, and power.",
            },
            {
              title: "Then compare the platform shape",
              body: "An MCU integrates more control-oriented hardware; an MPU is built for larger software ecosystems and higher complexity.",
            },
            {
              title: "Judge the fit, not the prestige",
              body: "The right platform is the one that matches the system need most honestly.",
            },
          ]}
        />
        <ProcessingLab />
        <RecapCheckpoint
          title="Checkpoint: MCU and MPU are engineering choices"
          items={[
            "Microcontrollers are strong when deterministic control, integrated peripherals, lower power, and tighter cost matter.",
            "Microprocessors are strong when rich operating systems, complex software stacks, and larger memory systems matter.",
            "The correct choice depends on product requirements, not on whichever sounds more advanced.",
          ]}
          question="Could you justify an MCU over an MPU for a serious product without making it sound like the MCU is merely the 'smaller' option?"
        />
        <DeepDiveBlock
          title="Why platform choice affects the whole software project"
          summary="This decision reshapes architecture, tooling, and test strategy."
          points={[
            {
              title: "Toolchain and OS impact",
              body: "The chosen platform changes whether you are writing bare-metal firmware, RTOS software, Linux applications, or some mix of layers.",
            },
            {
              title: "Board and memory impact",
              body: "It also changes external RAM needs, boot strategy, peripheral attachment, and power management design.",
            },
            {
              title: "Long-term maintenance",
              body: "Choosing a heavier platform than necessary can increase complexity and update burden for years.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-6-compiler">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Code is written by humans, machine instructions are executed by the CPU"
          description="Follow one small decision from source code to compiler translation to machine action so the software stack starts to feel physically real."
        />
        <InteractionGuide
          title="How to read the compiler flow"
          items={[
            {
              title: "Look at the human source first",
              body: "That is the requirement written in a form humans can maintain.",
            },
            {
              title: "Then watch the stage selector",
              body: "Each stage changes the form while preserving the intended behavior.",
            },
            {
              title: "Connect it back to hardware",
              body: "The CPU will only ever execute the final stored machine instructions, not the original source code.",
            },
          ]}
        />
        <CompilerLab />
        <RecapCheckpoint
          title="Checkpoint: source code is only the first expression of behavior"
          items={[
            "Humans write source, but the CPU executes machine instructions.",
            "The compiler and related tools transform readable intent into target-specific executable form.",
            "Expert debugging often requires reasoning across source, generated instructions, and hardware effect together.",
          ]}
          question="If the source code looks correct but the hardware behaves oddly, do you know which translation layer to inspect next?"
        />
        <DeepDiveBlock
          title="Why the compilation story matters so much in embedded work"
          summary="This is where many later chapters connect back together."
          points={[
            {
              title: "Target dependence",
              body: "The same C code can produce very different instruction streams on different architectures because the compiler is targeting different machine realities.",
            },
            {
              title: "Optimization tradeoffs",
              body: "Optimization may change code shape, timing, memory layout, and even what a debugger can easily show you.",
            },
            {
              title: "System literacy",
              body: "Embedded experts eventually learn to treat compiler output and runtime behavior as part of the same machine story.",
            },
          ]}
        />
      </section>
    </section>
  );
}

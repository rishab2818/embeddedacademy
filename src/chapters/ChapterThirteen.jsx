import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import FancySelect from "../components/FancySelect";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import {
  codeViews,
  cycleStages,
  executionModes,
  executionProfiles,
  flashRamCards,
  ioModes,
} from "../data/chapterThirteen";
import { formatSectionLabel } from "../utils/courseLabels";
import {
  buildCpuFlowScene,
  buildFetchCycleCards,
  buildMemoryPlacementScene,
  getExecutionProfile,
} from "../utils/chapterThirteen";

function ControllerToggle({ profileId, onChange }) {
  return (
    <div className="button-row controller-chip-row">
      {executionProfiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          className={`chip-button ${profile.id === profileId ? "active" : ""}`}
          onClick={() => onChange(profile.id)}
        >
          {profile.label}
        </button>
      ))}
    </div>
  );
}

function MemoryPlacementLab({ profileId, onProfileChange }) {
  const [viewId, setViewId] = useState(codeViews[0].id);
  const [executionModeId, setExecutionModeId] = useState(executionModes[0].id);
  const scene = useMemo(
    () => buildMemoryPlacementScene({ profileId, viewId, executionModeId }),
    [executionModeId, profileId, viewId]
  );

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Code to memory map</p>
        <h3>How source becomes machine code and where it sits</h3>
        <ControllerToggle profileId={profileId} onChange={onProfileChange} />

        <div className="runtime-control-grid">
          <div className="control-row">
            <label>Code view</label>
            <FancySelect
              ariaLabel="Choose code view"
              value={viewId}
              onChange={setViewId}
              options={codeViews.map((view) => ({ label: view.label, value: view.id }))}
            />
          </div>

          <div className="control-row">
            <label>Execution model</label>
            <FancySelect
              ariaLabel="Choose execution model"
              value={executionModeId}
              onChange={setExecutionModeId}
              options={executionModes.map((mode) => ({ label: mode.label, value: mode.id }))}
            />
          </div>
        </div>

        <div className="source-card runtime-source-card">
          {scene.activeLines.map((line) => (
            <div key={`${scene.view.id}-${line}`} className="source-line">
              {line}
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>{scene.mode.label}</strong>
          <span>{scene.narrative}</span>
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Memory picture</p>
        <h3>{scene.profile.title}</h3>
        <p className="panel-copy">{scene.profile.startupNote}</p>

        <div className="memory-placement-grid">
          <div className="memory-bank-card flash">
            <span>Flash / program memory</span>
            {scene.flashCells.map((cell) => (
              <div key={cell.id} className={`memory-bank-cell ${cell.active ? "active" : ""}`}>
                <strong>{cell.label}</strong>
                <small>{cell.value}</small>
              </div>
            ))}
          </div>

          <div className="memory-bank-card ram">
            <span>RAM / working memory</span>
            {scene.ramCells.map((cell) => (
              <div key={cell.id} className={`memory-bank-cell ${cell.active ? "active" : ""}`}>
                <strong>{cell.label}</strong>
                <small>{cell.value}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CpuEngineLab({ profileId, onProfileChange }) {
  const [ioModeId, setIoModeId] = useState(ioModes[0].id);
  const [executionModeId, setExecutionModeId] = useState(executionModes[0].id);
  const [autoPlay, setAutoPlay] = useState(true);
  const [cycleIndex, setCycleIndex] = useState(0);

  const scene = useMemo(
    () => buildCpuFlowScene({ profileId, ioModeId, executionModeId, cycleIndex }),
    [cycleIndex, executionModeId, ioModeId, profileId]
  );

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCycleIndex((current) => (current + 1) % cycleStages.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">CPU action stage</p>
            <h3>Clocked path from memory to CPU to real input or output</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <ControllerToggle profileId={profileId} onChange={onProfileChange} />

        <div className="runtime-control-grid">
          <div className="control-row">
            <label>Flow type</label>
            <div className="button-row">
              {ioModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`chip-button ${mode.id === ioModeId ? "active" : ""}`}
                  onClick={() => setIoModeId(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <label>Instruction source</label>
            <FancySelect
              ariaLabel="Choose instruction source"
              value={executionModeId}
              onChange={setExecutionModeId}
              options={executionModes.map((mode) => ({ label: mode.label, value: mode.id }))}
            />
          </div>
        </div>

        <div className="cpu-engine-grid">
          {scene.unitStates.map((unit) => (
            <div key={unit.id} className={`cpu-engine-unit ${unit.active ? "active" : ""}`}>
              <span>{unit.label}</span>
              <strong>{unit.active ? scene.currentStage.label : "waiting"}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Current clock step</p>
        <h3>{scene.currentStage.label}</h3>
        <p className="panel-copy">{scene.stageNarrative}</p>

        <div className="cycle-stage-grid runtime-cycle-grid">
          {cycleStages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className={`cycle-stage-card ${index === cycleIndex ? "active" : ""}`}
              onClick={() => setCycleIndex(index)}
            >
              <span>{stage.label}</span>
              <strong>{stage.summary}</strong>
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>{scene.ioMode.label}</strong>
          <span>{scene.ioMode.source}</span>
        </div>
      </div>
    </div>
  );
}

function CpuUnitsLab({ profileId, onProfileChange }) {
  const profile = useMemo(() => getExecutionProfile(profileId), [profileId]);
  const [unitId, setUnitId] = useState(profile.cpuUnits[0].id);

  useEffect(() => {
    setUnitId(profile.cpuUnits[0].id);
  }, [profile]);

  const activeUnit = profile.cpuUnits.find((unit) => unit.id === unitId) ?? profile.cpuUnits[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <p className="eyebrow">CPU units</p>
        <h3>Meet the main working blocks inside the CPU</h3>
        <ControllerToggle profileId={profileId} onChange={onProfileChange} />

        <div className="cpu-unit-grid">
          {profile.cpuUnits.map((unit) => (
            <button
              key={unit.id}
              type="button"
              className={`cpu-unit-card ${unit.id === unitId ? "active" : ""}`}
              onClick={() => setUnitId(unit.id)}
            >
              <span>{unit.label}</span>
              <p>{unit.detail}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Focused explanation</p>
        <h3>{activeUnit.label}</h3>

        <div className="callout">
          <strong>{profile.clockLabel}</strong>
          <span>{activeUnit.detail}</span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>What it does</span>
            <p>{activeUnit.detail}</p>
          </div>
          <div className="teaching-step-card">
            <span>Why it matters</span>
            <p>
              Without this unit, the CPU would lose one part of the chain between stored machine code,
              temporary working values, and real hardware action.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Memory relation</span>
            <p>
              CPU units do not replace flash or RAM. They cooperate with them: fetch from flash, work with
              registers and ALU, then store or react through RAM and peripherals.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Clock relation</span>
            <p>
              The clock gives ordered moments when this unit is allowed to capture, process, or forward new data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FetchCycleLab({ profileId, onProfileChange }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const cards = useMemo(() => buildFetchCycleCards(profileId), [profileId]);
  const activeCard = cards[stageIndex] ?? cards[0];
  const profile = useMemo(() => getExecutionProfile(profileId), [profileId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % cards.length);
    }, 1600);

    return () => window.clearInterval(timer);
  }, [autoPlay, cards.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Fetch-decode-execute</p>
            <h3>The repeating heartbeat of program execution</h3>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto cycle" : "Manual"}
          </button>
        </div>

        <ControllerToggle profileId={profileId} onChange={onProfileChange} />

        <div className="compile-stage-grid runtime-cycle-grid">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`compile-stage-card ${index === stageIndex ? "active" : ""}`}
              onClick={() => setStageIndex(index)}
            >
              <span>{card.label}</span>
              <strong>{card.summary}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Cycle detail</p>
        <h3>{activeCard.label}</h3>
        <p className="panel-copy">{activeCard.summary}</p>

        <div className="source-card compile-output-card">
          {activeCard.lines.map((line) => (
            <div key={`${activeCard.id}-${line}`} className="source-line">
              {line}
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>{profile.label}</strong>
          <span>
            This cycle repeats instruction after instruction. Fast or slow, simple or complex, the machine stays
            understandable because the same basic stages keep happening again and again.
          </span>
        </div>
      </div>
    </div>
  );
}

function FlashRamRecapLab() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Flash and RAM again</p>
        <h3>Return to the memory story with full runtime context</h3>

        <div className="teaching-step-grid compact">
          {flashRamCards.map((card) => (
            <div key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Big takeaway</p>
        <h3>What should the learner now be able to picture?</h3>

        <div className="callout">
          <strong>Whole-machine picture</strong>
          <span>
            Machine code sits in flash as stored bits. The CPU clock creates ordered chances to fetch those bits,
            decode them, read RAM or peripheral state, work through registers and the ALU, and finally write an
            output register or capture an input value.
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>For outputs</span>
            <p>
              The CPU executes instructions that write a peripheral or GPIO register, and the microcontroller then
              drives a real output pin HIGH or LOW.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For inputs</span>
            <p>
              The outside world changes a voltage on a pin, the GPIO input register captures that state, and the CPU
              reads it during a later instruction.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For memory</span>
            <p>
              Flash keeps the long-term program image. RAM keeps the changing state that makes each run of the program
              unique in real time.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For understanding bit width</span>
            <p>
              Different controller widths change how naturally the CPU handles big values and addresses, but the same
              broad execution story still applies across 8-bit, 16-bit, and 32-bit devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuntimeMindsetPanel() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel runtime-panel-stack">
        <p className="eyebrow">How to picture runtime</p>
        <h3>Think in repeated cycles, not in static diagrams</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Stored program</span>
            <p>
              Flash holds the long-term instruction image. It is the prepared script the CPU will keep
              reading from, instruction after instruction.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Working state</span>
            <p>
              RAM holds the values that change while the script runs: variables, buffers, stack frames,
              and intermediate results.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Clocked action</span>
            <p>
              The CPU does not do everything at once. The clock gives ordered opportunities to fetch,
              decode, move, calculate, compare, and write results.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Hardware consequence</span>
            <p>
              A software statement becomes meaningful only when the machine eventually changes a real
              register, memory cell, peripheral state, or external pin.
            </p>
          </div>
        </div>
      </div>

      <div className="panel runtime-panel-stack">
        <p className="eyebrow">Why advanced learners care</p>
        <h3>This is the core runtime movie behind real embedded systems</h3>

        <div className="callout">
          <strong>System-design payoff</strong>
          <span>
            Once you can mentally animate this flow, debugging becomes much more scientific. You can
            ask where the expected value should exist, when it should be captured, which unit should
            act on it, and which output or side effect should appear next.
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>For control systems</span>
            <p>
              This lets you reason about sensor capture, filtering, control decisions, and actuator
              updates as a timed loop rather than a pile of disconnected code.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For performance work</span>
            <p>
              You can start estimating where time is spent: flash wait states, instruction count,
              memory traffic, branches, and peripheral access.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For debugging</span>
            <p>
              If a GPIO pin never changes, you can walk backward through the chain instead of guessing:
              was the register written, was the branch taken, was the value computed, was the input read?
            </p>
          </div>
          <div className="teaching-step-card">
            <span>For architecture growth</span>
            <p>
              Bigger processors add caches, pipelines, buses, DMA, and protection features, but this
              chapter's runtime skeleton still remains underneath.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterThirteen({ chapterLabel = "Chapter 12", chapterNumber = "12" }) {
  const [profileId, setProfileId] = useState(executionProfiles[2].id);

  return (
    <section className="chapter" id="chapter-12">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Flash, RAM, and execution</h2>
        <p>
          This chapter connects stored machine code to real runtime behavior. We show how code and data live in flash
          and RAM, how the clocked CPU fetches and decodes instructions, how registers and the ALU participate, and
          how those steps finally read inputs or drive outputs on a microcontroller. The goal is to replace the vague
          phrase "the code runs" with a clear mental movie of what the machine is doing every clocked moment.
        </p>
      </div>

      <ChapterPrimer
        title="The runtime movie in plain English"
        items={[
          {
            title: "Flash",
            body: "Flash usually keeps the stored program image and constants when power is removed.",
          },
          {
            title: "RAM",
            body: "RAM holds changing state like variables, buffers, and stack data while the program runs.",
          },
          {
            title: "CPU execution",
            body: "The CPU fetches an instruction, decodes it, reads what it needs, executes the action, and writes the result back.",
          },
          {
            title: "I/O",
            body: "Outputs happen when software writes hardware registers. Inputs happen when the outside world changes a pin and software later reads that captured state.",
          },
        ]}
        callout={{
          title: "Important correction",
          body: "Many microcontrollers execute directly from flash. RAM is always important for working state, and some systems also copy selected data or code there, but not every MCU copies all code into RAM first.",
        }}
      />

      <RuntimeMindsetPanel />

      <section className="chapter-section" id="chapter-12-placement">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="How code sits in flash and data sits in RAM"
          description="Start with one code example, then view it as C, assembly, and machine code while placing each form into flash and RAM with an honest execution model."
        />
        <InteractionGuide
          title="How to read the flash-and-RAM placement lab"
          items={[
            {
              title: "Switch the code view deliberately",
              body: "One behavior can be described in several forms before it becomes the stored program image the CPU will execute.",
            },
            {
              title: "Compare flash and RAM jobs",
              body: "Flash keeps the stable program image while RAM holds changing state during execution.",
            },
            {
              title: "Use the execution model honestly",
              body: "Different systems fetch and place code differently, so avoid flattening every controller into one oversimplified story.",
            },
          ]}
        />
        <MemoryPlacementLab profileId={profileId} onProfileChange={setProfileId} />
        <RecapCheckpoint
          title="Checkpoint: stored program and working state are different"
          items={[
            "Flash usually stores the long-term program image and persistent constants.",
            "RAM keeps changing data such as variables, buffers, and stack frames.",
            "The program can stay the same in flash while the runtime story changes completely because RAM and inputs are different.",
          ]}
          question="Could you explain why an MCU can execute from flash and still rely heavily on RAM at the same time?"
        />
        <DeepDiveBlock
          title="Why the flash-versus-RAM split matters so much"
          summary="This is one of the cleanest mental models in embedded systems."
          points={[
            {
              title: "Persistence versus volatility",
              body: "Flash survives power loss, while RAM is optimized for fast changing state during live execution.",
            },
            {
              title: "Runtime uniqueness",
              body: "The same flash image can behave differently on each run because the RAM state and external inputs are changing.",
            },
            {
              title: "Debugging clarity",
              body: "When something is wrong, you need to know whether the problem belongs in stored code, initialized data, or changing runtime state.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-12-engine">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="How the clocked CPU moves code and data through the machine"
          description="Watch flash, RAM, registers, ALU, GPIO, and the clock act together so inputs and outputs stop feeling magical and start feeling causally connected."
        />
        <CpuEngineLab profileId={profileId} onProfileChange={setProfileId} />
        <RecapCheckpoint
          title="Checkpoint: runtime is a timed movement story"
          items={[
            "Execution is an ordered path through stored instructions, registers, ALU work, RAM state, and peripherals.",
            "The clock gives each part an ordered chance to fetch, hold, compute, or forward state.",
            "Inputs and outputs become understandable when they are narrated as timed machine events.",
          ]}
          question="Could you describe one GPIO output change as a sequence of timed machine steps?"
        />
      </section>

      <section className="chapter-section" id="chapter-12-units">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="CPU units and what each one does"
          description="Program counter, decoder, registers, ALU, bus interface, and GPIO each play a different role in execution, and understanding those roles makes debugging much more concrete."
        />
        <CpuUnitsLab profileId={profileId} onProfileChange={setProfileId} />
        <RecapCheckpoint
          title="Checkpoint: the CPU is a team of specialized units"
          items={[
            "The program counter tracks where execution is, the decoder interprets instructions, and registers hold fast working values.",
            "The ALU performs arithmetic or logical work while bus interfaces and peripherals connect that work to the rest of the machine.",
            "Knowing the units makes runtime explanations much more concrete.",
          ]}
          question="If one execution step fails, can you name which CPU unit should have been responsible?"
        />
        <DeepDiveBlock
          title="Why CPU-unit literacy helps real debugging"
          summary="This is where block diagrams become diagnostic tools."
          points={[
            {
              title: "Failure localization",
              body: "A fetch issue, a decode issue, an ALU issue, and a GPIO issue do not look the same once you understand the unit roles.",
            },
            {
              title: "Predictive reasoning",
              body: "Strong engineers can often describe the expected unit-by-unit activity before they even attach a debugger.",
            },
            {
              title: "Architecture growth",
              body: "As systems become more advanced, more units appear, but the habit of role-based reasoning still scales cleanly.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-12-cycle">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Fetch-decode-execute cycle"
          description="Follow the repeating instruction cycle so the full execution loop becomes memorable, visual, and easy to narrate from memory."
        />
        <FetchCycleLab profileId={profileId} onProfileChange={setProfileId} />
        <RecapCheckpoint
          title="Checkpoint: execution is a repeating loop"
          items={[
            "Fetch-decode-execute is the recurring rhythm behind software running on a CPU.",
            "Each instruction repeats the same broad cycle even when the detailed work changes.",
            "Once this loop is clear, the phrase 'the code runs' becomes much less vague.",
          ]}
          question="Could you explain one loop iteration of fetch-decode-execute without skipping the decode step?"
        />
      </section>

      <section className="chapter-section" id="chapter-12-recap">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="Flash and RAM in full context"
          description="Finish by tying memory, execution, clocking, input, output, and controller width back into one runtime mental model that can scale to bigger systems."
        />
        <FlashRamRecapLab />
        <RecapCheckpoint
          title="Checkpoint: the whole runtime movie should now be coherent"
          items={[
            "Stored machine code, working RAM state, CPU units, and clock timing cooperate in one runtime chain.",
            "Inputs are captured, processed, and turned into outputs through repeated instruction execution.",
            "This runtime skeleton still applies even when more advanced processors add caches, DMA, or pipelines on top.",
          ]}
          question="Could you narrate the full runtime story of one embedded action from stored code to visible hardware effect?"
        />
        <DeepDiveBlock
          title="What advanced runtime adds on top of this foundation"
          summary="This is the bridge from beginner MCU execution to serious system design."
          points={[
            {
              title: "Stack and function calls",
              body: "Real programs keep return addresses, local variables, and temporary call context on the stack, so runtime correctness depends on disciplined memory use as functions call each other.",
            },
            {
              title: "Interrupts change the timeline",
              body: "An interrupt can pause the normal instruction stream, save context, handle an urgent event, and then return, which is why timing analysis must include asynchronous events as well as the main loop.",
            },
            {
              title: "DMA and smarter buses",
              body: "In larger systems, peripherals may move data directly to RAM without the CPU touching every byte, but the same runtime story still matters because the CPU must later consume, validate, and act on that data correctly.",
            },
          ]}
        />
      </section>
    </section>
  );
}



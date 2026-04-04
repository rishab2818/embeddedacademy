import { useEffect, useMemo, useState } from "react";
import BeatTimeline from "../components/BeatTimeline";
import ChapterPrimer from "../components/ChapterPrimer";
import ClockTreeCard from "../components/ClockTreeCard";
import DeepDiveBlock from "../components/DeepDiveBlock";
import DriverSnippetViewer from "../components/DriverSnippetViewer";
import FancySelect from "../components/FancySelect";
import InteractionGuide from "../components/InteractionGuide";
import PulseLane from "../components/PulseLane";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import {
  anatomyCards,
  dividerOptions,
  flowScenarios,
  foundationBeatNarration,
  foundationFrequencyOptions,
  foundationWorkloadOptions,
  genericClockSources,
  heartbeatCards,
  heartbeatRoles,
  picClockProfiles,
  picDriverViews,
  picSources,
  stmBusDividers,
  stmDriverViews,
  stmPllMultipliers,
  stmSources,
  timelineTracks,
} from "../data/chapterClock";
import {
  buildPicCodeLines,
  buildPulseSequence,
  buildStmCodeLines,
  buildTimelineRows,
  computeCycleMetrics,
  computeGenericClockTree,
  computePicClock,
  computeStmClock,
  describeClockFeel,
  formatCycles,
  formatHz,
  formatPeriodUs,
} from "../utils/chapterClock";
import { formatSectionLabel } from "../utils/courseLabels";

const animationSpeedOptions = [
  { label: "Slow", value: 1000 },
  { label: "Medium", value: 700 },
  { label: "Fast", value: 420 },
];

function ClockFoundationLab() {
  const [frequencyId, setFrequencyId] = useState("1mhz");
  const [workloadCycles, setWorkloadCycles] = useState(40);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(700);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % foundationBeatNarration.length);
    }, speed);

    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const frequency = foundationFrequencyOptions.find((item) => item.id === frequencyId) ?? foundationFrequencyOptions[0];
  const metrics = useMemo(
    () => computeCycleMetrics({ frequency: frequency.frequency, workloadCycles }),
    [frequency.frequency, workloadCycles]
  );
  const narration = foundationBeatNarration[beat];
  const pulses = useMemo(() => buildPulseSequence(foundationBeatNarration.length, beat), [beat]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <div className="panel-header stacked">
          <div>
            <p className="eyebrow">First principles</p>
            <h3>Start with cycles, edges, and timing windows</h3>
            <p className="panel-copy">
              Before talking about PIC or STM32, lock in the basic idea: the clock creates repeated
              moments when synchronous logic can move from one known state to the next.
            </p>
          </div>
        </div>

        <div className="clock-control-grid">
          <div className="control-row">
            <label>Teaching frequency</label>
            <FancySelect
              ariaLabel="Clock teaching frequency"
              value={frequencyId}
              onChange={setFrequencyId}
              options={foundationFrequencyOptions.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>Workload size</label>
            <FancySelect
              ariaLabel="Workload cycles"
              value={workloadCycles}
              onChange={(next) => setWorkloadCycles(Number(next))}
              options={foundationWorkloadOptions.map((item) => ({ label: item.label, value: item.value }))}
            />
          </div>

          <div className="control-row">
            <label>Animation speed</label>
            <FancySelect
              ariaLabel="Animation speed"
              value={speed}
              onChange={(next) => setSpeed(Number(next))}
              options={animationSpeedOptions}
            />
          </div>

          <div className="control-row">
            <label>Playback</label>
            <div className="button-row">
              <button type="button" className="chip-button active" onClick={() => setPlaying((current) => !current)}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="chip-button" onClick={() => setBeat((current) => (current + 1) % foundationBeatNarration.length)}>
                Step
              </button>
            </div>
          </div>
        </div>

        <div className="clock-analogy-grid">
          <PulseLane label="Clock edges" pulses={pulses} accent="clock" />
          <PulseLane label="State updates becoming valid" pulses={pulses} accent="heart" />
        </div>

        <div className="clock-metric-grid">
          <article className="clock-metric-card">
            <span>Selected rate</span>
            <strong>{formatHz(frequency.frequency)}</strong>
            <p>{frequency.note}</p>
          </article>
          <article className="clock-metric-card">
            <span>One cycle lasts</span>
            <strong>{metrics.periodLabel}</strong>
            <p>Frequency and period describe the same clock from two directions.</p>
          </article>
          <article className="clock-metric-card">
            <span>Cycles in 1 ms</span>
            <strong>{metrics.cyclesPerMillisecondLabel}</strong>
            <p>This is why even small delay mistakes become visible at MCU speeds.</p>
          </article>
          <article className="clock-metric-card">
            <span>{workloadCycles} cycles take</span>
            <strong>{metrics.workloadLabel}</strong>
            <p>Execution time is always work size divided by available cycle rate.</p>
          </article>
        </div>

        <div className="callout">
          <strong>
            Beat {beat + 1}: {narration.title}
          </strong>
          <span>{narration.body}</span>
        </div>
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">Anchor the idea</p>
        <h3>Use the metaphor carefully, then replace it with technical language</h3>

        <div className="clock-role-grid">
          {heartbeatRoles.map((role) => (
            <article key={role.id} className="clock-role-card">
              <span>{role.label}</span>
              <p>{role.detail}</p>
            </article>
          ))}
        </div>

        <div className="teaching-step-grid compact">
          {heartbeatCards.map((card) => (
            <article key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Technical sentence worth memorizing</strong>
          <span>
            The clock does not transport program data. It provides repeated timing references that
            synchronous hardware uses to sample, latch, count, and shift safely.
          </span>
        </div>
      </div>
    </div>
  );
}

function ClockAnatomyLab() {
  const [sourceId, setSourceId] = useState(genericClockSources[2].id);
  const [pllEnabled, setPllEnabled] = useState(true);
  const [pllMultiplier, setPllMultiplier] = useState(4);
  const [cpuDivider, setCpuDivider] = useState(1);
  const [busDivider, setBusDivider] = useState(2);

  const source = genericClockSources.find((item) => item.id === sourceId) ?? genericClockSources[0];
  const tree = useMemo(
    () =>
      computeGenericClockTree({
        sourceFrequency: source.frequency,
        pllEnabled,
        pllMultiplier,
        cpuDivider,
        busDivider,
      }),
    [source.frequency, pllEnabled, pllMultiplier, cpuDivider, busDivider]
  );
  const feel = describeClockFeel(tree.cpuFrequency);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <p className="eyebrow">Clock tree explorer</p>
        <h3>Source, PLL, dividers, and domains</h3>

        <div className="clock-control-grid">
          <div className="control-row">
            <label>Clock source</label>
            <FancySelect
              ariaLabel="Clock source"
              value={sourceId}
              onChange={setSourceId}
              options={genericClockSources.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>PLL path</label>
            <FancySelect
              ariaLabel="PLL path"
              value={pllEnabled ? "on" : "off"}
              onChange={(next) => setPllEnabled(next === "on")}
              options={[
                { label: "Enabled", value: "on" },
                { label: "Bypassed", value: "off" },
              ]}
            />
          </div>

          <div className="control-row">
            <label>PLL multiplier</label>
            <FancySelect
              ariaLabel="PLL multiplier"
              value={pllMultiplier}
              onChange={(next) => setPllMultiplier(Number(next))}
              options={[2, 3, 4, 6].map((value) => ({ label: `x${value}`, value }))}
            />
          </div>

          <div className="control-row">
            <label>CPU divider</label>
            <FancySelect
              ariaLabel="CPU divider"
              value={cpuDivider}
              onChange={(next) => setCpuDivider(Number(next))}
              options={dividerOptions.map((value) => ({ label: `/ ${value}`, value }))}
            />
          </div>

          <div className="control-row">
            <label>Bus divider</label>
            <FancySelect
              ariaLabel="Bus divider"
              value={busDivider}
              onChange={(next) => setBusDivider(Number(next))}
              options={dividerOptions.map((value) => ({ label: `/ ${value}`, value }))}
            />
          </div>
        </div>

        <div className="clock-tree-grid">
          <ClockTreeCard label="Source" value={formatHz(tree.sourceFrequency)} note={source.analogy} accent="source" />
          <ClockTreeCard
            label="PLL output"
            value={formatHz(tree.pllFrequency)}
            note={pllEnabled ? `The PLL multiplies the source by x${pllMultiplier}.` : "The PLL is bypassed here."}
            accent="pll"
          />
          <ClockTreeCard
            label="CPU domain"
            value={formatHz(tree.cpuFrequency)}
            note={formatPeriodUs(tree.cpuFrequency)}
            accent="core"
          />
          <ClockTreeCard
            label="Bus domain"
            value={formatHz(tree.busFrequency)}
            note="Memory controllers and many peripherals often live on a divided bus clock."
            accent="bus"
          />
          <ClockTreeCard
            label="Timer tick"
            value={formatHz(tree.timerFrequency)}
            note={`One timer tick every ${tree.timerPeriodLabel}.`}
            accent="timer"
          />
          <ClockTreeCard
            label="Why it matters"
            value={`${(tree.cpuFrequency / tree.busFrequency).toFixed(1)}x ratio`}
            note="The CPU and bus can be related without being equal, which is why peripheral timing cannot be guessed from core speed alone."
            accent="uart"
          />
        </div>

        <div className="callout">
          <strong>{feel.title}</strong>
          <span>{feel.body}</span>
        </div>
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">Meaning of each block</p>
        <h3>What beginners usually miss about a clock tree</h3>

        <div className="teaching-step-grid compact">
          {anatomyCards.map((card) => (
            <article key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Correct mental model</strong>
          <span>
            The source gives you a raw rhythm, the PLL may speed that rhythm up, dividers shape it
            for different blocks, and each domain then runs according to that derived timing.
          </span>
        </div>
      </div>
    </div>
  );
}

function PicClockLab() {
  const [sourceId, setSourceId] = useState(picSources[0].id);
  const [profileId, setProfileId] = useState(picClockProfiles[6].id);

  const source = picSources.find((item) => item.id === sourceId) ?? picSources[0];
  const profile = picClockProfiles.find((item) => item.id === profileId) ?? picClockProfiles[0];
  const derived = computePicClock({ source: source.id, internalFrequency: profile.frequency });
  const codeLines = buildPicCodeLines({
    sourceLine: source.sourceLine,
    ircfBits: profile.ircf,
    frequencyLabel: profile.label,
    sourceLabel: source.label,
    sourceId: source.id,
  });
  const views = picDriverViews.map((view) => ({
    ...view,
    lines: codeLines[view.id],
  }));

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <p className="eyebrow">PIC16 clock thinking</p>
        <h3>Simple configuration, but be precise about instruction timing</h3>

        <div className="clock-control-grid">
          <div className="control-row">
            <label>Clock source</label>
            <FancySelect
              ariaLabel="PIC clock source"
              value={sourceId}
              onChange={setSourceId}
              options={picSources.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>Internal oscillator step</label>
            <FancySelect
              ariaLabel="PIC internal oscillator step"
              value={profileId}
              onChange={setProfileId}
              options={picClockProfiles.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>
        </div>

        <div className="clock-tree-grid compact">
          <ClockTreeCard
            label="Oscillator (Fosc)"
            value={formatHz(derived.oscillatorFrequency)}
            note={source.id === "internal" ? profile.explanation : source.detail}
            accent="source"
          />
          <ClockTreeCard
            label="Instruction clock"
            value={formatHz(derived.instructionFrequency)}
            note="For classic and enhanced mid-range PIC16 teaching models, instruction timing is based on Fosc / 4."
            accent="core"
          />
          <ClockTreeCard
            label="Instruction period"
            value={derived.instructionPeriodLabel}
            note="This is the time budget for one nominal instruction cycle."
            accent="timer"
          />
          <ClockTreeCard
            label="Cycles in 1 ms"
            value={formatCycles(derived.instructionCyclesPerMillisecond)}
            note="Delay loops and timer calculations only make sense if this relationship is correct."
            accent="bus"
          />
          <ClockTreeCard
            label="100 cycles take"
            value={derived.hundredCycleTimeLabel}
            note="A tiny firmware task can stretch dramatically when Fosc is reduced."
            accent="uart"
          />
          <ClockTreeCard
            label="Teaching point"
            value="Fosc / 4"
            note="The most important beginner rule in this PIC section is converting oscillator rate into actual CPU instruction timing."
            accent="pll"
          />
        </div>

        <div className="callout">
          <strong>Why this chapter needed a correction</strong>
          <span>
            Beginners often hear the oscillator frequency and assume the CPU executes one full
            instruction on every oscillator cycle. For this PIC teaching model, that is not true:
            the instruction cycle is derived from Fosc / 4.
          </span>
        </div>
      </div>

      <DriverSnippetViewer
        eyebrow="Device-driver reading"
        title="Educational PIC16 clock snippet"
        views={views}
      />
    </div>
  );
}

function StmClockLab() {
  const [sourceId, setSourceId] = useState(stmSources[1].id);
  const [pllEnabled, setPllEnabled] = useState(true);
  const [pllMultiplier, setPllMultiplier] = useState(9);
  const [ahbDivider, setAhbDivider] = useState(1);
  const [apb1Divider, setApb1Divider] = useState(2);
  const [apb2Divider, setApb2Divider] = useState(1);

  const source = stmSources.find((item) => item.id === sourceId) ?? stmSources[0];
  const derived = computeStmClock({
    sourceId,
    sourceFrequency: source.frequency,
    pllEnabled,
    pllMultiplier,
    ahbDivider,
    apb1Divider,
    apb2Divider,
  });
  const codeLines = buildStmCodeLines({
    sourceId,
    sourceCode: source.sourceCode,
    pllEnabled,
    pllMultiplier,
    ahbDivider,
    apb1Divider,
    apb2Divider,
  });
  const views = stmDriverViews.map((view) => ({
    ...view,
    lines: codeLines[view.id],
  }));

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <p className="eyebrow">STM32F1 clock tree</p>
        <h3>More flexible than PIC, so accuracy matters more</h3>

        <div className="clock-control-grid stm">
          <div className="control-row">
            <label>Source</label>
            <FancySelect
              ariaLabel="STM32 source"
              value={sourceId}
              onChange={setSourceId}
              options={stmSources.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>PLL path</label>
            <FancySelect
              ariaLabel="STM32 PLL path"
              value={pllEnabled ? "on" : "off"}
              onChange={(next) => setPllEnabled(next === "on")}
              options={[
                { label: "Enabled", value: "on" },
                { label: "Bypassed", value: "off" },
              ]}
            />
          </div>

          <div className="control-row">
            <label>PLL multiplier</label>
            <FancySelect
              ariaLabel="STM32 PLL multiplier"
              value={pllMultiplier}
              onChange={(next) => setPllMultiplier(Number(next))}
              options={stmPllMultipliers.map((value) => ({ label: `x${value}`, value }))}
            />
          </div>

          <div className="control-row">
            <label>AHB divider</label>
            <FancySelect
              ariaLabel="AHB divider"
              value={ahbDivider}
              onChange={(next) => setAhbDivider(Number(next))}
              options={stmBusDividers.map((value) => ({ label: `/ ${value}`, value }))}
            />
          </div>

          <div className="control-row">
            <label>APB1 divider</label>
            <FancySelect
              ariaLabel="APB1 divider"
              value={apb1Divider}
              onChange={(next) => setApb1Divider(Number(next))}
              options={stmBusDividers.map((value) => ({ label: `/ ${value}`, value }))}
            />
          </div>

          <div className="control-row">
            <label>APB2 divider</label>
            <FancySelect
              ariaLabel="APB2 divider"
              value={apb2Divider}
              onChange={(next) => setApb2Divider(Number(next))}
              options={stmBusDividers.map((value) => ({ label: `/ ${value}`, value }))}
            />
          </div>
        </div>

        <div className="clock-tree-grid">
          <ClockTreeCard
            label="PLL input"
            value={pllEnabled ? formatHz(derived.pllInput) : "not used"}
            note={
              pllEnabled
                ? sourceId === "hsi"
                  ? "Important correction: STM32F1 feeds HSI/2 into the PLL, not raw HSI."
                  : "With HSE selected, the crystal path feeds the PLL."
                : "When PLL is bypassed, SYSCLK follows the source directly."
            }
            accent="source"
          />
          <ClockTreeCard label="SYSCLK" value={formatHz(derived.sysclk)} note="The main system clock selected for the core clock tree." accent="core" />
          <ClockTreeCard label="HCLK" value={formatHz(derived.hclk)} note="AHB domain for the core, memory, and main bus fabric." accent="bus" />
          <ClockTreeCard label="PCLK1" value={formatHz(derived.pclk1)} note="Lower-speed APB domain. Common STM32F1 teaching limit: 36 MHz." accent="timer" />
          <ClockTreeCard label="PCLK2" value={formatHz(derived.pclk2)} note="Higher-speed APB domain for faster peripherals." accent="pll" />
          <ClockTreeCard
            label="TIMx clock on APB1"
            value={formatHz(derived.timerClock)}
            note="On STM32F1, timers on a prescaled APB can run at 2 x PCLK for that domain."
            accent="uart"
          />
        </div>

        <div className="clock-warning-grid">
          <article className="clock-warning-card safe">
            <span>Source note</span>
            <p>{source.detail}</p>
          </article>
          {derived.warnings.map((warning) => (
            <article key={warning} className="clock-warning-card warn">
              <span>Timing warning</span>
              <p>{warning}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>STM32F1 lesson to remember</strong>
          <span>
            STM32 clock setup is not just "pick a fast number." You are building a legal and stable
            tree where SYSCLK, AHB, APB1, APB2, and timer clocks all have to make sense together.
          </span>
        </div>
      </div>

      <DriverSnippetViewer
        eyebrow="Device-driver reading"
        title="Educational STM32F1 RCC snippet"
        views={views}
      />
    </div>
  );
}

function DataFlowLab() {
  const [scenarioId, setScenarioId] = useState(flowScenarios[0].id);
  const [playing, setPlaying] = useState(true);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    setBeat(0);
  }, [scenarioId]);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % 8);
    }, 900);

    return () => window.clearInterval(timer);
  }, [playing]);

  const scenario = flowScenarios.find((item) => item.id === scenarioId) ?? flowScenarios[0];
  const rows = useMemo(() => buildTimelineRows(beat, scenarioId), [beat, scenarioId]);
  const currentBeat = scenario.beats[beat];
  const pulses = useMemo(() => buildPulseSequence(8, beat), [beat]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <div className="panel-header stacked">
          <div>
            <p className="eyebrow">Timing story engine</p>
            <h3>Step through what the clock makes possible</h3>
            <p className="panel-copy">
              Pick a real situation and watch how the clock separates sampling, control decisions,
              data movement, and visible hardware effects.
            </p>
          </div>
        </div>

        <div className="button-row">
          {flowScenarios.map((item) => (
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

        <div className="button-row">
          <button type="button" className="chip-button" onClick={() => setBeat((current) => (current + 7) % 8)}>
            Previous beat
          </button>
          <button type="button" className="chip-button active" onClick={() => setPlaying((current) => !current)}>
            {playing ? "Pause autoplay" : "Play autoplay"}
          </button>
          <button type="button" className="chip-button" onClick={() => setBeat((current) => (current + 1) % 8)}>
            Next beat
          </button>
        </div>

        <PulseLane label="Clock edges driving the scenario" pulses={pulses} accent="clock" />
        <BeatTimeline tracks={timelineTracks} rows={rows} />
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">Current explanation</p>
        <h3>
          Beat {beat + 1}: {currentBeat.title}
        </h3>

        <div className="callout">
          <strong>{scenario.headline}</strong>
          <span>
            {currentBeat.detail} {scenario.detail}
          </span>
        </div>

        <div className="teaching-step-grid compact">
          {scenario.checkpoints.map((item) => (
            <article key={item} className="teaching-step-card">
              <span>Why this matters</span>
              <p>{item}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Most important correction</strong>
          <span>
            The clock does not "push data through the chip" by itself. It coordinates when state can
            change and when signals are sampled so that the whole path behaves predictably.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterTen({ chapterLabel = "Chapter 9", chapterNumber = "9" }) {
  return (
    <section className="chapter" id="chapter-9">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Clocks and timing from first principles to real MCU configuration</h2>
        <p>
          This version of the chapter starts from the true beginner question: what does a clock
          actually do inside a digital system? From there it builds toward oscillators, PLLs,
          prescalers, PIC16 instruction timing, STM32F1 clock trees, and finally the timed steps
          that turn software into visible hardware action.
        </p>
      </div>

      <ChapterPrimer
        title="Read this chapter with four definitions in mind"
        items={[
          {
            title: "Frequency",
            body: "Frequency tells you how many clock cycles happen every second. Example: 8 MHz means eight million cycles each second.",
          },
          {
            title: "Period",
            body: "Period is the length of one cycle. Faster frequency means shorter period, and shorter period means less time for logic to settle before the next edge.",
          },
          {
            title: "Clock domain",
            body: "A chip may have several related clocks. The CPU, buses, timers, and communication blocks do not always run at the same final frequency.",
          },
          {
            title: "Timing budget",
            body: "Every instruction fetch, memory access, bus transfer, timer tick, and serial bit uses part of a timing budget created by the clock tree.",
          },
        ]}
        callout={{
          title: "One sentence to remember",
          body: "The clock creates legal timing moments for digital state changes; everything else in this chapter is an application of that one idea.",
        }}
      />

      <section className="chapter-section" id="chapter-9-heartbeat">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Build the right mental model before the hardware details"
          description="Learn what a cycle, an edge, a period, and a timing window really mean so the rest of the chapter does not feel like memorizing jargon."
        />
        <InteractionGuide
          title="How to read the timing foundation lab"
          items={[
            {
              title: "Start with one beat",
              body: "Treat each beat as one legal chance for synchronous logic to update and settle.",
            },
            {
              title: "Then connect beat to workload",
              body: "Use the frequency and cycle counters to relate abstract timing words to real execution budgets.",
            },
            {
              title: "Replace the metaphor carefully",
              body: "The heartbeat analogy helps with intuition, but the real takeaway is synchronized state change in digital hardware.",
            },
          ]}
        />
        <ClockFoundationLab />
        <RecapCheckpoint
          title="Checkpoint: a clock is timing permission, not payload"
          items={[
            "Frequency and period are two ways of describing the same repeating timing source.",
            "The clock creates legal update moments for logic rather than carrying application data itself.",
            "Execution time is always tied to how many cycles the work needs and how fast those cycles arrive.",
          ]}
          question="Can you explain what a clock does without saying it 'moves the data'?"
        />
        <DeepDiveBlock
          title="Why the timing abstraction matters so much"
          summary="This is where the beginner metaphor turns into engineering language."
          points={[
            {
              title: "Settling and safety",
              body: "Digital blocks need enough time for signals to stabilize before the next edge captures new state.",
            },
            {
              title: "Budget thinking",
              body: "A workload is really a cycle budget. Faster clocks shorten each cycle, but they do not eliminate the work.",
            },
            {
              title: "System consequence",
              body: "UART timing, timer periods, bus rates, and control-loop deadlines all derive from this one foundation.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-9-anatomy">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="What a clock tree really contains"
          description="Explore how a source, a PLL, and dividers create related domains for the CPU, buses, and timers instead of one single universal speed."
        />
        <ClockAnatomyLab />
        <RecapCheckpoint
          title="Checkpoint: one source can become many related clocks"
          items={[
            "A raw source is not yet the whole chip's final timing story.",
            "PLL stages can multiply frequency, and dividers can slow it back down for specific domains.",
            "CPU, bus, timer, and peripheral clocks often relate to each other without being identical.",
          ]}
          question="If someone tells you the core runs at one frequency, do you know why the peripherals may still run at a different one?"
        />
        <DeepDiveBlock
          title="Why clock trees exist instead of one universal speed"
          summary="This is where timing becomes architecture."
          points={[
            {
              title: "Different blocks, different needs",
              body: "The CPU may want a high-speed domain while a bus or peripheral may need a safer, lower, or legally limited rate.",
            },
            {
              title: "Power and stability",
              body: "Reducing some domains saves power and helps keep interfaces within their reliable timing limits.",
            },
            {
              title: "Debugging payoff",
              body: "Many peripheral bugs are really clock-tree misunderstandings rather than code logic errors.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-9-pic16">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="PIC16: simple setup, but learn the Fosc to instruction-cycle conversion"
          description="Use a PIC-style example to understand why oscillator frequency is not automatically the same as CPU instruction timing."
        />
        <PicClockLab />
        <RecapCheckpoint
          title="Checkpoint: PIC oscillator rate is not the same as instruction rate"
          items={[
            "On the teaching PIC16 model, instruction timing is derived from `Fosc / 4`.",
            "Delay loops and timer calculations only make sense after that conversion is correct.",
            "Hearing the oscillator frequency alone is not enough to reason about execution speed honestly.",
          ]}
          question="If a PIC oscillator is 8 MHz, what extra reasoning do you still need before claiming the instruction rate?"
        />
      </section>

      <section className="chapter-section" id="chapter-9-stm32f1">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="STM32F1: a real clock tree with legal limits and derived buses"
          description="Build the STM32F1 RCC path honestly, including the important HSI/2-to-PLL rule and the APB timing relationships that beginners usually miss."
        />
        <StmClockLab />
        <RecapCheckpoint
          title="Checkpoint: STM32 clock setup is a legal tree, not a random speed choice"
          items={[
            "Source selection, PLL rules, AHB, APB1, and APB2 all have to make sense together.",
            "STM32F1 feeds `HSI/2` into the PLL rather than raw HSI.",
            "Peripheral timing cannot be guessed from core speed alone.",
          ]}
          question="Could you explain why two STM32 projects with the same SYSCLK might still behave differently on a peripheral?"
        />
        <DeepDiveBlock
          title="Why STM32 clock configuration feels more 'real-world'"
          summary="Open this to connect the RCC example to larger system design."
          points={[
            {
              title: "Clock legality",
              body: "Vendors publish limits because not every domain can safely run at every possible frequency combination.",
            },
            {
              title: "Peripheral side effects",
              body: "UART baud rate, timer tick rates, and bus access timing can all shift when one divider changes.",
            },
            {
              title: "Engineer mindset",
              body: "Clock setup is a system contract. Once it changes, downstream assumptions must be revalidated.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-9-data-flow">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="Watch clocked systems turn timing into action"
          description="Step manually through instruction fetch, GPIO reaction, and UART timing so software-to-hardware causality becomes visible and ordered."
        />
        <DataFlowLab />
        <RecapCheckpoint
          title="Checkpoint: timing shapes causality"
          items={[
            "The clock orders when instructions, sampling, and visible outputs can happen.",
            "Inputs, decisions, and outputs become understandable only when you place them on a timed sequence.",
            "Clock reasoning is what keeps later execution and bus chapters from feeling abstract.",
          ]}
          question="Can you narrate one hardware effect as an ordered sequence of timed machine events?"
        />
        <DeepDiveBlock
          title="Accuracy, jitter, and deadlines in real embedded products"
          summary="This is the bridge from classroom clocks to serious engineering."
          points={[
            {
              title: "Accuracy is not the same as frequency",
              body: "Two 8 MHz sources may not be equally useful if one is loose and drifting while the other is precise enough for serial communication, control loops, or timekeeping.",
            },
            {
              title: "Jitter changes confidence",
              body: "If timing edges wander, sampling and communication quality can degrade even when the average rate still looks correct on paper.",
            },
            {
              title: "Deadlines are system promises",
              body: "A control loop, interrupt response, or peripheral service path is only trustworthy if the whole timing chain meets its deadline repeatedly, not just occasionally.",
            },
          ]}
        />
      </section>
    </section>
  );
}

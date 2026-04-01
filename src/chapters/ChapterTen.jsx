import { useEffect, useMemo, useState } from "react";
import BeatTimeline from "../components/BeatTimeline";
import ClockTreeCard from "../components/ClockTreeCard";
import DriverSnippetViewer from "../components/DriverSnippetViewer";
import FancySelect from "../components/FancySelect";
import PulseLane from "../components/PulseLane";
import SectionHeading from "../components/SectionHeading";
import {
  anatomyCards,
  beatNarration,
  busModes,
  dividerOptions,
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
  computeGenericClockTree,
  computePicClock,
  computeStmClock,
  describeClockFeel,
  formatHz,
  formatPeriodUs,
} from "../utils/chapterClock";
import { formatSectionLabel } from "../utils/courseLabels";

const speedOptions = [
  { label: "Slow", value: 1100 },
  { label: "Medium", value: 700 },
  { label: "Fast", value: 420 },
];

function HeartbeatLab() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(700);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % 8);
    }, speed);

    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const pulses = useMemo(() => buildPulseSequence(8, beat), [beat]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Animated analogy</p>
            <h3>The heart sets rhythm. The clock sets timing.</h3>
          </div>

          <div className="button-row">
            <button type="button" className="chip-button active" onClick={() => setPlaying((current) => !current)}>
              {playing ? "Pause beat" : "Play beat"}
            </button>
          </div>
        </div>

        <div className="control-row">
          <label>Beat speed</label>
          <FancySelect
            ariaLabel="Heartbeat speed"
            value={speed}
            onChange={(next) => setSpeed(Number(next))}
            options={speedOptions}
          />
        </div>

        <div className="clock-analogy-grid">
          <PulseLane label="Human heartbeat" pulses={pulses} accent="heart" />
          <PulseLane label="MCU clock beat" pulses={pulses} accent="clock" />
        </div>

        <div className="callout">
          <strong>Core truth</strong>
          <span>
            The clock is not the data itself. It is the rhythm that tells digital hardware when a
            new action is allowed to happen.
          </span>
        </div>

        <div className="clock-role-grid">
          {heartbeatRoles.map((role) => (
            <article key={role.id} className="clock-role-card">
              <span>{role.label}</span>
              <p>{role.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">Plain-English anchors</p>
        <h3>Use the analogy, but keep the technical meaning honest</h3>
        <div className="teaching-step-grid compact">
          {heartbeatCards.map((card) => (
            <div key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClockAnatomyLab() {
  const [sourceId, setSourceId] = useState(genericClockSources[1].id);
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
        <h3>Source to PLL to core clock to bus clocks</h3>

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
              ariaLabel="PLL enabled"
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

        <div className="callout">
          <strong>Why the tree matters</strong>
          <span>
            One oscillator can feed many subsystems at related speeds. Designers often keep the CPU
            fast while dividing slower buses and peripherals down to safe rates.
          </span>
        </div>

        <div className="clock-tree-grid">
          <ClockTreeCard label="Source" value={formatHz(tree.sourceFrequency)} note={source.analogy} accent="source" />
          <ClockTreeCard
            label="After PLL"
            value={formatHz(tree.pllFrequency)}
            note={pllEnabled ? `Multiplier x${pllMultiplier} is active.` : "PLL is bypassed."}
            accent="pll"
          />
          <ClockTreeCard label="CPU / SYSCLK" value={formatHz(tree.cpuFrequency)} note={formatPeriodUs(tree.cpuFrequency)} accent="core" />
          <ClockTreeCard label="Peripheral bus" value={formatHz(tree.busFrequency)} note="Shared timing for memory and many peripherals." accent="bus" />
          <ClockTreeCard label="Timer view" value={formatHz(tree.timerFrequency)} note="Timers count using a derived clock, not magic." accent="timer" />
          <ClockTreeCard label="UART budget" value={formatHz(tree.uartFrequency)} note="Communication blocks depend on a known derived rate." accent="uart" />
        </div>
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">What each block means</p>
        <h3>Slow clock and fast clock feel different because timing opportunities change</h3>

        <div className="teaching-step-grid compact">
          {anatomyCards.map((card) => (
            <div key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </div>
          ))}
        </div>

        <div className="callout">
          <strong>{feel.title}</strong>
          <span>{feel.body}</span>
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
  });
  const views = picDriverViews.map((view) => ({
    ...view,
    lines: codeLines[view.id],
  }));

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <p className="eyebrow">PIC16 configuration lab</p>
        <h3>Compact, register-centric, and very direct</h3>

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
            <label>IRCF frequency</label>
            <FancySelect
              ariaLabel="PIC internal oscillator frequency"
              value={profileId}
              onChange={setProfileId}
              options={picClockProfiles.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>
        </div>

        <div className="clock-tree-grid compact">
          <ClockTreeCard label="Oscillator" value={formatHz(derived.oscillatorFrequency)} note={profile.explanation} accent="source" />
          <ClockTreeCard
            label="Instruction clock"
            value={formatHz(derived.instructionFrequency)}
            note="Classic PIC16 execution pace is Fosc / 4. One instruction cycle uses four oscillator ticks."
            accent="core"
          />
          <ClockTreeCard label="Instruction period" value={formatPeriodUs(derived.instructionFrequency)} note="A slower oscillator stretches the time between code actions." accent="timer" />
        </div>

        <div className="callout">
          <strong>PIC way of thinking</strong>
          <span>
            PIC clock configuration feels close to the hardware. A small set of bits chooses the
            source and internal rate, and then the CPU behavior follows from that setting.
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
        <p className="eyebrow">STM32F1 configuration lab</p>
        <h3>More layered: source selection, PLL shaping, then bus distribution</h3>

        <div className="clock-control-grid stm">
          <div className="control-row">
            <label>Source</label>
            <FancySelect
              ariaLabel="STM source"
              value={sourceId}
              onChange={setSourceId}
              options={stmSources.map((item) => ({ label: item.label, value: item.id }))}
            />
          </div>

          <div className="control-row">
            <label>PLL</label>
            <FancySelect
              ariaLabel="STM PLL enabled"
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
              ariaLabel="STM PLL multiplier"
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
          <ClockTreeCard label="SYSCLK" value={formatHz(derived.sysclk)} note={source.detail} accent="core" />
          <ClockTreeCard label="HCLK" value={formatHz(derived.hclk)} note="Core and memory backbone after AHB prescaling." accent="bus" />
          <ClockTreeCard label="PCLK1" value={formatHz(derived.pclk1)} note="Lower-speed peripheral domain on STM32F1." accent="timer" />
          <ClockTreeCard label="PCLK2" value={formatHz(derived.pclk2)} note="Higher-speed peripheral domain." accent="pll" />
          <ClockTreeCard label="Timer clock" value={formatHz(derived.timerClock)} note="Timers may double relative to APB1 when that bus is prescaled." accent="uart" />
        </div>

        <div className="callout">
          <strong>STM32 way of thinking</strong>
          <span>
            STM32F1 clocking is a tree, not a single knob. You shape SYSCLK first, then feed AHB,
            APB1, APB2, and peripheral enables from the RCC structure.
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
  const [busMode, setBusMode] = useState(busModes[0].id);
  const [playing, setPlaying] = useState(true);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % 8);
    }, 650);

    return () => window.clearInterval(timer);
  }, [playing]);

  const rows = useMemo(() => buildTimelineRows(beat, busMode), [beat, busMode]);
  const narrative = beatNarration[beat % beatNarration.length];
  const bus = busModes.find((item) => item.id === busMode) ?? busModes[0];
  const pulses = useMemo(() => buildPulseSequence(8, beat), [beat]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel clock-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Timed data movement</p>
            <h3>One clock, many synchronized actions</h3>
          </div>

          <div className="button-row">
            {busModes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip-button ${item.id === busMode ? "active" : ""}`}
                onClick={() => setBusMode(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button type="button" className="chip-button" onClick={() => setPlaying((current) => !current)}>
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>

        <PulseLane label="Clock edges driving the story" pulses={pulses} accent="clock" />
        <BeatTimeline tracks={timelineTracks} rows={rows} />
      </div>

      <div className="panel clock-panel-stack">
        <p className="eyebrow">Beat explanation</p>
        <h3>
          Beat {beat + 1}: {narrative.title}
        </h3>

        <div className="callout">
          <strong>{bus.headline}</strong>
          <span>
            {narrative.detail} {bus.detail}
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Instruction execution</span>
            <p>Fetch and execute steps happen on timed boundaries, not at random analog moments.</p>
          </div>
          <div className="teaching-step-card">
            <span>Memory movement</span>
            <p>Addresses, read strobes, data return, and write events are all synchronized by clocked logic.</p>
          </div>
          <div className="teaching-step-card">
            <span>Serial and parallel buses</span>
            <p>Serial links sample one bit across many edges, while parallel paths make many bits valid together on one shared beat.</p>
          </div>
          <div className="teaching-step-card">
            <span>Inputs and outputs</span>
            <p>Inputs are sampled when hardware says it is time, then outputs are updated after the logic path completes.</p>
          </div>
        </div>

        <div className="callout">
          <strong>Important wording</strong>
          <span>
            We sometimes say the clock powers the bus or memory in a beginner metaphor, but the
            accurate statement is that the clock synchronizes when these blocks move, sample, store,
            or present signals.
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
        <h2>Clocks, timing, and how software becomes action</h2>
        <p>
          This chapter teaches the clock in two layers. First, we make it intuitive: the clock is
          the heartbeat of the microcontroller. Then we make it technical: oscillators, PLL,
          prescalers, register configuration, device-driver reading, and how timed edges let data
          move through CPU, memory, buses, GPIO, and real hardware behavior.
        </p>
      </div>

      <section className="chapter-section" id="chapter-9-heartbeat">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="The clock as the heartbeat of the CPU"
          description="Start with the body analogy, then connect that rhythm to actual CPU work, memory access, and peripheral timing."
        />
        <HeartbeatLab />
      </section>

      <section className="chapter-section" id="chapter-9-anatomy">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="What a clock really is inside a microcontroller"
          description="Explore oscillator sources, PLL multiplication, dividers, and clock domains so the tree behind timing feels concrete."
        />
        <ClockAnatomyLab />
      </section>

      <section className="chapter-section" id="chapter-9-pic16">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Configure clock on PIC16 and learn to read the driver"
          description="See the compact PIC style where a few register bits directly choose the clock source and internal oscillator rate."
        />
        <PicClockLab />
      </section>

      <section className="chapter-section" id="chapter-9-stm32f1">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Configure clock on STM32F1 and read the RCC flow"
          description="Build the STM32 clock tree interactively and compare register-first reading with a more structured driver bring-up story."
        />
        <StmClockLab />
      </section>

      <section className="chapter-section" id="chapter-9-data-flow">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="How clocked systems move data and trigger action"
          description="Walk beat by beat through fetch, memory movement, bus timing, input sampling, and output updates so software-to-hardware causality feels visible."
        />
        <DataFlowLab />
      </section>
    </section>
  );
}

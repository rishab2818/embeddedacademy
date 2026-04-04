import { useEffect, useMemo, useState } from "react";
import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import SectionHeading from "../components/SectionHeading";
import {
  architectureChoiceOptions,
  architectureComparisonLenses,
  architectureDepthCards,
  architectureExamples,
  architectureFlowScenarios,
  architectureImportanceCards,
  architectureModels,
  architecturePrimerItems,
  architectureQuizScenarios,
  architectureTrapCards,
} from "../data/chapterSeven";
import { formatSectionLabel } from "../utils/courseLabels";

function ArchitectureMindsetPanel() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Why this topic matters</p>
        <h3>Architecture is the traffic plan of the computer</h3>

        <div className="teaching-step-grid compact">
          {architectureImportanceCards.map((card) => (
            <article key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Practical memory hook</strong>
          <span>
            If you know where instructions live, where data lives, and whether they travel on the
            same road or different roads, later topics like timing, flash, RAM, DMA, caches, and
            bus bottlenecks become much easier to reason about.
          </span>
        </div>
      </div>

      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Beginner traps</p>
        <h3>These confusions break the mental model early</h3>

        <div className="teaching-step-grid compact">
          {architectureTrapCards.map((card) => (
            <article key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Best way to read the rest of the chapter</strong>
          <span>
            Keep asking one question: when the CPU wants the next instruction and the next piece of
            data, do those requests cooperate easily or do they compete?
          </span>
        </div>
      </div>
    </div>
  );
}

function ArchitectureFlowLab({ architectureId }) {
  const [scenarioId, setScenarioId] = useState(architectureFlowScenarios[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const scenario = useMemo(
    () =>
      architectureFlowScenarios.find((item) => item.id === scenarioId) ??
      architectureFlowScenarios[0],
    [scenarioId]
  );
  const model = architectureModels[architectureId];
  const activeBeat = scenario.beats[stepIndex] ?? scenario.beats[0];
  const scene = activeBeat[architectureId];
  const metrics = scenario.metrics[architectureId];

  useEffect(() => {
    setStepIndex(0);
  }, [scenarioId]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % scenario.beats.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, [autoPlay, scenario.beats.length]);

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel architecture-panel-stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{model.label} machine movie</p>
            <h3>{model.headline}</h3>
            <p className="panel-copy">{model.analogy}</p>
          </div>
          <button
            type="button"
            className={`toggle-button ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? "Auto play" : "Manual"}
          </button>
        </div>

        <blockquote className="architecture-quote-card">
          <span>Requirement quote</span>
          <p>{scenario.requirementQuote}</p>
        </blockquote>

        <div className="button-row architecture-chip-row">
          {architectureFlowScenarios.map((item) => (
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

        <div className={`architecture-stage-shell architecture-${architectureId}`}>
          <article className="architecture-stage-card program active">
            <span>{architectureId === "von" ? "Unified memory side" : "Instruction side"}</span>
            <strong>{architectureId === "von" ? "Instruction traffic uses the shared road" : "Program memory feeds opcodes"}</strong>
            <p>{scene.programTask}</p>
          </article>

          <article className="architecture-stage-card cpu focus">
            <span>CPU core</span>
            <strong>{activeBeat.title}</strong>
            <p>{scene.cpuTask}</p>
          </article>

          <article className="architecture-stage-card data active">
            <span>{architectureId === "von" ? "Same shared memory road" : "Data side"}</span>
            <strong>{architectureId === "von" ? "Data must take turns" : "Data memory works independently"}</strong>
            <p>{scene.dataTask}</p>
          </article>
        </div>

        <div className="architecture-traffic-grid">
          <article className={`architecture-traffic-card ${architectureId === "von" ? "shared" : "split"} live`}>
            <span>Traffic view</span>
            <strong>{scene.traffic}</strong>
            <p>{scene.parallel}</p>
          </article>
          <article className="architecture-traffic-card">
            <span>Why this beat matters</span>
            <strong>{scene.takeaway}</strong>
            <p>{scenario.overview}</p>
          </article>
        </div>

        <div className="architecture-step-grid">
          {scenario.beats.map((beat, index) => (
            <button
              key={`${scenario.id}-${beat.id}`}
              type="button"
              className={`architecture-step-card ${index === stepIndex ? "active" : ""}`}
              onClick={() => setStepIndex(index)}
            >
              <span>Beat {index + 1}</span>
              <strong>{beat.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Interpret the animation</p>
        <h3>{model.shortLabel}</h3>
        <p className="panel-copy">{model.memoryShape}</p>

        <div className="architecture-metric-grid">
          <article className="architecture-metric-card">
            <span>Strength</span>
            <strong>{model.strength}</strong>
          </article>
          <article className="architecture-metric-card">
            <span>Weakness</span>
            <strong>{model.weakness}</strong>
          </article>
          <article className="architecture-metric-card">
            <span>Best fit</span>
            <strong>{model.bestFit}</strong>
          </article>
        </div>

        <div className="callout">
          <strong>In this scenario</strong>
          <span>
            {metrics.performance} {metrics.fit} Watch for this: {metrics.caution}
          </span>
        </div>

        <div className="teaching-step-grid compact">
          {scenario.whyItMatters.map((item) => (
            <article key={item} className="teaching-step-card">
              <span>What to notice</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArchitectureTradeoffLab() {
  const [lensId, setLensId] = useState(architectureComparisonLenses[0].id);
  const lens =
    architectureComparisonLenses.find((item) => item.id === lensId) ??
    architectureComparisonLenses[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Tradeoff studio</p>
        <h3>Compare the architectures through one engineering lens at a time</h3>

        <div className="button-row architecture-chip-row">
          {architectureComparisonLenses.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === lensId ? "active" : ""}`}
              onClick={() => setLensId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>{lens.label}</strong>
          <span>{lens.question}</span>
        </div>

        <div className="architecture-compare-grid">
          {architectureChoiceOptions.map((option) => (
            <article key={option.id} className="architecture-compare-card">
              <span>{option.label}</span>
              <strong>{lens.notes[option.id].title}</strong>
              <p>{lens.notes[option.id].body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Expert depth</p>
        <h3>Modern products are often hybrid for good reasons</h3>

        <div className="teaching-step-grid compact">
          {architectureDepthCards.map((card) => (
            <article key={card.title} className="teaching-step-card">
              <span>{card.title}</span>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="callout">
          <strong>Most important expert correction</strong>
          <span>
            In modern embedded design, the smartest answer is often not "Von Neumann always" or
            "Harvard always." The better answer is: which machine organization best matches the
            timing, flexibility, toolchain, and safety needs of this product?
          </span>
        </div>
      </div>
    </div>
  );
}

function RealWorldExamplesLab() {
  const [exampleId, setExampleId] = useState(architectureExamples[0].id);
  const example =
    architectureExamples.find((item) => item.id === exampleId) ?? architectureExamples[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Real product examples</p>
        <h3>See how this looks in actual device families</h3>

        <div className="button-row architecture-chip-row">
          {architectureExamples.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === exampleId ? "active" : ""}`}
              onClick={() => setExampleId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <blockquote className="architecture-quote-card">
          <span>Product-team quote</span>
          <p>{example.requirementQuote}</p>
        </blockquote>

        <div className="architecture-example-card">
          <span>{example.leaning}</span>
          <strong>{example.label}</strong>
          <p>{example.deviceStory}</p>
        </div>
      </div>

      <div className="panel architecture-panel-stack">
        <p className="eyebrow">Why it fits</p>
        <h3>Connect the architecture to the engineering goal</h3>

        <div className="teaching-step-grid compact">
          <article className="teaching-step-card">
            <span>Why this architecture makes sense</span>
            <p>{example.whyItFits}</p>
          </article>
          <article className="teaching-step-card">
            <span>What to watch out for</span>
            <p>{example.watchOut}</p>
          </article>
        </div>

        <div className="callout">
          <strong>Learn the pattern, not just the label</strong>
          <span>
            Device families matter because architecture is always serving a product goal: repeated
            control, streaming data, or a huge flexible software ecosystem.
          </span>
        </div>
      </div>
    </div>
  );
}

function ArchitectureDecisionQuiz() {
  const [answers, setAnswers] = useState({});
  const correctCount = architectureQuizScenarios.filter(
    (scenario) => answers[scenario.id] === scenario.correct
  ).length;

  return (
    <div className="panel architecture-panel-stack">
      <div className="panel-header stacked">
        <div>
          <p className="eyebrow">Architecture decision lab</p>
          <h3>Choose the best fit, then check the reasoning</h3>
          <p className="panel-copy">
            This is not about memorizing one winner. It is about matching an architecture to a
            product's real constraints.
          </p>
        </div>
      </div>

      <div className="architecture-score-card">
        <span>Current score</span>
        <strong>
          {correctCount} / {architectureQuizScenarios.length}
        </strong>
        <p>Read the explanation even when you are right. That is where the expert-level pattern lives.</p>
      </div>

      <div className="architecture-quiz-grid">
        {architectureQuizScenarios.map((scenario) => {
          const selected = answers[scenario.id];
          const isAnswered = Boolean(selected);

          return (
            <article key={scenario.id} className="architecture-quiz-card">
              <span>{scenario.title}</span>
              <strong>{scenario.prompt}</strong>
              <blockquote className="architecture-quiz-quote">{scenario.quote}</blockquote>

              <div className="architecture-option-row">
                {architectureChoiceOptions.map((option) => {
                  const isCorrect = option.id === scenario.correct;
                  const isSelected = option.id === selected;
                  const stateClass = !isAnswered
                    ? ""
                    : isCorrect
                      ? "correct"
                      : isSelected
                        ? "wrong"
                        : "";

                  return (
                    <button
                      key={`${scenario.id}-${option.id}`}
                      type="button"
                      className={`architecture-option-button ${isSelected ? "selected" : ""} ${stateClass}`}
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [scenario.id]: option.id }))
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {isAnswered ? (
                <>
                  <div className="callout">
                    <strong>
                      {selected === scenario.correct ? "Correct choice" : `Better answer: ${architectureModels[scenario.correct].label}`}
                    </strong>
                    <span>{scenario.why}</span>
                  </div>

                  <div className="teaching-step-grid compact">
                    {architectureChoiceOptions.map((option) => (
                      <article
                        key={`${scenario.id}-${option.id}-diagnostic`}
                        className="teaching-step-card"
                      >
                        <span>
                          {option.id === scenario.correct
                            ? `${option.label}: best fit`
                            : `${option.label}: why not ideal`}
                        </span>
                        <p>{scenario.diagnostics?.[option.id]}</p>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function ChapterSeven({ chapterLabel = "Chapter 15", chapterNumber = "15" }) {
  return (
    <section className="chapter" id="chapter-15">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Von Neumann and Harvard architecture</h2>
        <p>
          This chapter explains how a computer organizes the movement of instructions and data. We
          start with friendly mental models, then go all the way to throughput, bottlenecks,
          deterministic control loops, modern hybrid processors, and architecture choices for real
          products such as controllers, DSP systems, drones, and laptops.
        </p>
      </div>

      <ChapterPrimer
        title="Four ideas to lock in before the animation starts"
        items={architecturePrimerItems}
        callout={{
          title: "One sentence to remember",
          body: "Von Neumann and Harvard are two different answers to one question: when the CPU wants the next instruction and the next piece of data, how is the machine organized to supply them?",
        }}
      />

      <section className="chapter-section" id="chapter-15-why">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Why architecture matters before you ever write optimized code"
          description="Use this section to build the high-level picture first. Once you understand the traffic plan of the machine, performance and memory behavior stop feeling mysterious."
        />
        <ArchitectureMindsetPanel />
      </section>

      <section className="chapter-section" id="chapter-15-von-neumann">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Von Neumann architecture in motion"
          description="Watch one shared-memory road serve both instructions and data so the famous bottleneck becomes visual instead of just verbal."
        />
        <ArchitectureFlowLab architectureId="von" />
      </section>

      <section className="chapter-section" id="chapter-15-harvard">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="Harvard architecture in motion"
          description="Now watch the split-memory idea. Separate instruction and data paths make the CPU feel better fed, especially in control loops and stream-processing systems."
        />
        <ArchitectureFlowLab architectureId="harvard" />
      </section>

      <section className="chapter-section" id="chapter-15-tradeoffs">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 4)}
          title="Advantages, disadvantages, and modern hybrids"
          description="This is the expert bridge: compare the tradeoffs honestly, then connect them to real device families and modern modified-Harvard designs."
        />
        <ArchitectureTradeoffLab />
        <RealWorldExamplesLab />
        <DeepDiveBlock
          title="Why modern processors rarely stay pure"
          summary="Real products steal the best ideas from both schools."
          points={[
            {
              title: "Performance pressure",
              body: "Separate instruction and data paths, caches, and prefetch logic help keep the CPU fed even when the software view feels more unified.",
            },
            {
              title: "Programming pressure",
              body: "Developers, compilers, debuggers, and operating systems usually work more comfortably when the software-facing memory model is not painfully split into unrelated worlds.",
            },
            {
              title: "Safety and control pressure",
              body: "Embedded products may still deliberately separate code and data paths or permissions to make timing, integrity, or accidental-corruption risks easier to manage.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-15-quiz">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 5)}
          title="Architecture decision quiz for real applications"
          description="Choose the best architecture for each application and use the explanations to practice engineering judgment, not just recall."
        />
        <InteractionGuide
          title="How to use the architecture decision lab like an engineer"
          items={[
            {
              title: "Start with the product goal",
              body: "Ask what the product values most: flexible software, deterministic loops, high streaming throughput, or a modern compromise between them.",
            },
            {
              title: "Then ask what traffic dominates",
              body: "Is the machine constantly fetching instructions and data together, or is it trying to support a huge unified software ecosystem?",
            },
            {
              title: "Read the wrong-answer diagnostics too",
              body: "The fastest way to become expert here is to understand why each non-winning architecture is less appropriate for that scenario.",
            },
          ]}
        />
        <ArchitectureDecisionQuiz />
        <RecapCheckpoint
          title="Checkpoint: architecture choice is product reasoning, not slogan repetition"
          items={[
            "Von Neumann is powerful when a broad flexible software model matters most.",
            "Harvard shines when repeated instruction fetch and data movement need cleaner separation and steadier throughput.",
            "Modified Harvard often explains modern embedded reality because it balances performance with a friendlier programming model.",
          ]}
          question="Could you justify an architecture choice by product constraints and traffic patterns rather than by saying one school is always superior?"
        />
      </section>
    </section>
  );
}

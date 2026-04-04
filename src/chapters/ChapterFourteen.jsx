import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import RecapCheckpoint from "../components/RecapCheckpoint";
import RevisionGame from "../components/RevisionGame";
import SectionHeading from "../components/SectionHeading";
import {
  runtimeRescueConfig,
  runtimeRescueLore,
  runtimeRescueMissions,
} from "../data/runtimeRevisionGame";
import { formatSectionLabel } from "../utils/courseLabels";

function RuntimeRescueGuide() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <p className="eyebrow">How to approach runtime failures</p>
        <h3>Think in chains, budgets, and consequences</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Timing chain</span>
            <p>
              A peripheral usually depends on a derived clock. If the root clock, PLL, or divider
              changes, every timing-dependent block downstream may need new configuration.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Transport chain</span>
            <p>
              Address bus, data bus, flash, RAM, and registers each play different roles. Runtime bugs
              often come from assigning the right value to the wrong concept.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Execution chain</span>
            <p>
              Requirements become code, code becomes machine instructions, and those instructions become
              repeated fetch-decode-execute activity. Keep the chain intact while debugging.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Output chain</span>
            <p>
              If a real signal is wrong, reason backward from the final hardware effect toward the data,
              instruction, and timing assumptions that produced it.
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">What expert growth looks like</p>
        <h3>You are moving from topic recall to system reasoning</h3>

        <div className="callout">
          <strong>Engineering mindset</strong>
          <span>
            Experts do not memorize isolated facts and hope the right one appears. They build causal
            models and test those models against evidence from clocks, buses, memory maps, registers,
            compiled output, and observed hardware behavior.
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>What to listen for in yourself</span>
            <p>
              If your explanation starts sounding like a chain of "because this feeds that," you are
              learning the subject the right way.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>What to avoid</span>
            <p>
              Avoid patching symptoms with random setting changes. Embedded expertise grows when each
              fix is tied to a clear model of what the machine should be doing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuntimeRescueOutcomes() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <p className="eyebrow">Mastery check</p>
        <h3>What you should now be able to explain without hand-waving</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Clock-dependent peripherals</span>
            <p>
              Explain why UART, timers, PWM, and sampling logic must be rechecked when the clock tree
              or bus dividers change.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Address and data roles</span>
            <p>
              Explain one complete memory or peripheral transaction using the words address, data,
              register, read, write, and width correctly.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Compilation honesty</span>
            <p>
              Explain why the compiler is not doing word substitution, and how assembler and linker
              finish turning source into executable firmware.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Runtime execution</span>
            <p>
              Explain how instructions in flash, working state in RAM, and CPU cycles cooperate to
              create a real input or output effect.
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Course trajectory</p>
        <h3>This is the level where system design starts becoming realistic</h3>

        <div className="callout">
          <strong>Why this matters for advanced products</strong>
          <span>
            Phones, motor drives, drones, automotive controllers, and flight computers all depend on
            the same core reasoning: timing budgets, memory organization, instruction flow, hardware
            interfaces, and trustworthy causal debugging.
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Next step</span>
            <p>
              Revisit any mission that felt fuzzy and practice explaining the chain to an imaginary
              teammate who has never seen embedded systems before.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Long-term goal</span>
            <p>
              The real win is not finishing a chapter. It is becoming the engineer who can look at a
              failing system and calmly build the right mental model fast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterFourteen({ chapterLabel = "Chapter 14", chapterNumber = "14" }) {
  return (
    <section className="chapter" id="chapter-14">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Runtime Rescue</h2>
        <p>
          This game ties the later system chapters together. You will debug clocks, bus roles,
          compilation, flash, RAM, instruction execution, and GPIO flow as one connected runtime story
          rather than as isolated definitions. The aim is to make you reason like a systems engineer,
          not like someone memorizing chapter headings.
        </p>
      </div>

      <ChapterPrimer
        title="What this final checkpoint is really testing"
        items={[
          {
            title: "Timing literacy",
            body: "Can you trace how one clock decision affects downstream peripherals, software timing, and externally visible behavior?",
          },
          {
            title: "Machine pathways",
            body: "Can you explain how addresses, data, instructions, and working state move through memory and buses without mixing their roles?",
          },
          {
            title: "Toolchain realism",
            body: "Can you connect human source code to assembly, linking, stored firmware, and later runtime execution?",
          },
          {
            title: "Runtime causality",
            body: "Can you explain how a real input change eventually becomes a stored state update or an output pin transition?",
          },
        ]}
        callout={{
          title: "What makes this an expert checkpoint",
          body: "At this stage, the right answer is usually the one that preserves the full system chain. The wrong answers break the chain by confusing timing, memory, transport, or execution roles.",
        }}
      />

      <section className="chapter-section" id="chapter-14-guide">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="How to attack runtime problems scientifically"
          description="Read this field guide first so the rescue missions reinforce end-to-end system reasoning instead of one-off guesswork."
        />
        <RuntimeRescueGuide />
      </section>

      <section className="chapter-section" id="chapter-14-game">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Game Revision 2: Runtime Rescue"
          description="Work through progressively deeper rescue missions that connect clocks, buses, compilation, flash, RAM, fetch-decode-execute, and real input/output behavior."
        />
        <RevisionGame
          missions={runtimeRescueMissions}
          lore={runtimeRescueLore}
          config={runtimeRescueConfig}
        />
        <DeepDiveBlock
          title="How to use a wrong answer like a systems engineer"
          summary="This turns the game into a real debugging exercise."
          points={[
            {
              title: "Name the broken chain",
              body: "After every wrong answer, say exactly which link failed: clock assumption, bus role, compilation stage, memory role, execution stage, or I/O causality.",
            },
            {
              title: "Repair the model before retrying",
              body: "Do not click again immediately. First restate the correct machine story in your own words, then choose the better move from that repaired model.",
            },
            {
              title: "Transfer the lesson forward",
              body: "Each mission is a miniature post-mortem. Ask yourself where the same broken assumption would appear in a real board bring-up, driver bug, or field failure report.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-14-outcomes">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="What mastery should look like after the runtime rescue"
          description="Use this review panel to verify that you can now explain the whole runtime story coherently and at a much more technical level."
        />
        <RuntimeRescueOutcomes />
        <RecapCheckpoint
          title="Checkpoint: can you now debug by preserving the whole chain?"
          items={[
            "You should be able to reject answers that break causality, even before you know the final correct fix.",
            "You should be able to walk from clock setup to bus transfer to stored state to final output without skipping layers.",
            "You should be able to explain why a wrong answer fails, not only why the right answer works.",
          ]}
          question="If you saw a fresh embedded bug tomorrow, would your first move be to guess, or to rebuild the machine story scientifically?"
        />
      </section>
    </section>
  );
}

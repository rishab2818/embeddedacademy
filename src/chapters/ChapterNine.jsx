import ChapterPrimer from "../components/ChapterPrimer";
import DeepDiveBlock from "../components/DeepDiveBlock";
import InteractionGuide from "../components/InteractionGuide";
import RecapCheckpoint from "../components/RecapCheckpoint";
import RevisionGame from "../components/RevisionGame";
import SectionHeading from "../components/SectionHeading";
import { revisionLore, revisionMissions } from "../data/revisionGame";
import { formatSectionLabel } from "../utils/courseLabels";

function RevisionFieldGuide() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <p className="eyebrow">How to use this chapter well</p>
        <h3>Do not treat the game like trivia</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Name the physical thing</span>
            <p>
              Before choosing an answer, ask yourself what is physically moving or changing:
              bits in memory, bytes on a bus, a type interpretation, a pin voltage, or a CPU decision.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Separate where from what</span>
            <p>
              Many beginner mistakes come from mixing location with value. Address means where. Data
              means what. Type means how the same stored bits should be interpreted.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Trace the chain</span>
            <p>
              Embedded bugs are usually broken chains, not isolated facts. Follow the flow from input
              to memory to logic to output and identify the first wrong assumption in the chain.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Read the explanation slowly</span>
            <p>
              The learning happens after each move. Use the mission feedback to build a durable
              mental picture, not just to collect a correct answer.
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">What expert learners notice</p>
        <h3>The same few principles keep returning</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Bits are innocent</span>
            <p>
              The raw pattern in memory does not care whether you call it signed, unsigned, float,
              ASCII, or a packed register field. Meaning comes from interpretation.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Variables are software labels</span>
            <p>
              A variable may look like one thing in source code, but in memory it still occupies real
              bytes at real addresses with a real width and byte order.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Buses transport</span>
            <p>
              Buses do not permanently store values. They briefly carry location information and data
              between CPU, memory, and peripherals.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Control loops need order</span>
            <p>
              Fresh input must be captured, interpreted, processed, and only then used to drive an
              output. Skip one stage and the whole machine starts behaving like it has a ghost.
            </p>
          </div>
        </div>

        <div className="callout">
          <strong>Why this revision chapter matters</strong>
          <span>
            Real embedded work rarely asks, "Do you remember the definition?" It asks, "Can you
            diagnose which mental model is wrong?" This chapter is training that habit.
          </span>
        </div>
      </div>
    </div>
  );
}

function RevisionOutcomeMap() {
  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel">
        <p className="eyebrow">After-action review</p>
        <h3>What you should now be able to explain out loud</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>Signed and unsigned</span>
            <p>
              Explain how the same 8-bit pattern can mean two different numbers depending on whether
              the program interprets it as signed or unsigned.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Memory occupancy</span>
            <p>
              Explain why one 32-bit variable is still stored across four neighboring byte addresses
              on a byte-addressed machine.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Encoding vs text</span>
            <p>
              Explain why a float or integer normally moves through hardware as encoded bytes, not as
              human-readable decimal text.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>Pointers and grouping</span>
            <p>
              Explain how pointer type and endianness change the way the same memory bytes are grouped
              and read.
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Bridge forward</p>
        <h3>These basics are the price of entry for expert work</h3>

        <div className="callout">
          <strong>Why advanced systems still depend on these basics</strong>
          <span>
            Flight computers, phones, robots, and industrial controllers all grow from the same
            foundations: stable bit representations, correct memory models, disciplined data flow,
            and precise reasoning about how software touches hardware.
          </span>
        </div>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>If this still feels hard</span>
            <p>
              That is normal. Revisit the earlier chapters and use this game to test whether the
              machine picture in your head is getting sharper.
            </p>
          </div>
          <div className="teaching-step-card">
            <span>If this feels manageable</span>
            <p>
              You are ready to push into timing, toolchains, machine code, buses, and execution with
              much better intuition than most beginners have.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterNine({ chapterLabel = "Chapter 8", chapterNumber = "8" }) {
  return (
    <section className="chapter" id="chapter-8">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Revise the basics through an embedded rescue game</h2>
        <p>
          This lesson is a guided revision arena, not a quiz sheet. Each mission pulls from the
          earlier chapters and asks you to repair a believable technical failure using the right
          mental model of bits, signedness, memory layout, data encoding, pointers, input flow,
          and hardware-facing reasoning. The goal is to turn definitions into engineering judgment.
        </p>
      </div>

      <ChapterPrimer
        title="What this checkpoint is testing"
        items={[
          {
            title: "Bit pattern vs meaning",
            body: "Expert embedded engineers never confuse stored bits with the human interpretation layered on top of them.",
          },
          {
            title: "Address vs data",
            body: "You need a clean picture of where a value lives, how wide it is, and how it travels between memory, CPU, and peripherals.",
          },
          {
            title: "Representation matters",
            body: "Floats, integers, characters, and structured packets all become bytes, but they are not encoded the same way.",
          },
          {
            title: "Flow matters",
            body: "Good firmware is a disciplined chain: capture input, store state, process logic, then drive output with the right timing and order.",
          },
        ]}
        callout={{
          title: "How to think while playing",
          body: "For each mission, ask what the machine is storing, what it is transporting, and what the software is assuming. Most embedded bugs are mismatches between those three.",
        }}
      />

      <section className="chapter-section" id="chapter-8-guide">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="How to use the rescue missions like an engineer"
          description="Use this field guide before the game so each decision reinforces a correct machine-level mental model instead of becoming another memorized answer."
        />
        <RevisionFieldGuide />
        <RecapCheckpoint
          title="Checkpoint: revision is about repairing mental models"
          items={[
            "Ask what the machine is physically storing, moving, or interpreting before choosing an answer.",
            "Most wrong answers break causality somewhere in the input-memory-logic-output chain.",
            "The explanation after each mission matters more than getting lucky on the first guess.",
          ]}
          question="If you got a mission wrong, could you name the exact machine-level assumption that failed?"
        />
        <DeepDiveBlock
          title="How strong engineers use revision chapters"
          summary="This is how to turn a game into real embedded growth."
          points={[
            {
              title: "Narrate the failure",
              body: "Say the system story out loud: where the bytes came from, how they were interpreted, and where the behavior went wrong.",
            },
            {
              title: "Compare wrong models",
              body: "Do not only memorize the correct answer. Compare the tempting wrong model with the correct one so you can spot the same trap later in real work.",
            },
            {
              title: "Use it diagnostically",
              body: "If a mission feels fuzzy, it usually points to a foundation chapter that still needs one more pass.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-8-game">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 2)}
          title="Game Revision 1: Signal Rescue"
          description="Work through a chain of embedded rescue missions that move from moderate reasoning to highly technical debugging, with detailed explanations after every move."
        />
        <InteractionGuide
          title="How to play this revision arena well"
          items={[
            {
              title: "Read the scenario like a field bug",
              body: "Treat each mission as a real engineering failure report, not as a multiple-choice puzzle detached from hardware.",
            },
            {
              title: "Pause before answering",
              body: "Identify the physical source, the storage location, the interpretation rule, and the intended output before clicking.",
            },
            {
              title: "Study the explanation after each move",
              body: "That feedback is the real lesson because it tells you why the broken system story failed.",
            },
          ]}
        />
        <RevisionGame missions={revisionMissions} lore={revisionLore} />
        <DeepDiveBlock
          title="What this revision game is secretly training"
          summary="The missions are building debugging instincts, not only testing recall."
          points={[
            {
              title: "Chain reasoning",
              body: "You are learning to spot the first broken link in a system rather than only describing the final symptom.",
            },
            {
              title: "Vocabulary precision",
              body: "Terms like signed, address, value, pointer, and bus are useful only if you can apply them accurately to a real failure.",
            },
            {
              title: "Future payoff",
              body: "Later chapters on clocks, compilation, and execution become much easier when these fundamentals are sturdy.",
            },
          ]}
        />
      </section>

      <section className="chapter-section" id="chapter-8-outcomes">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 3)}
          title="What mastery should feel like after this checkpoint"
          description="Use this review map to confirm that the revision game improved your explanations, not just your answer accuracy."
        />
        <RevisionOutcomeMap />
        <RecapCheckpoint
          title="Checkpoint: are the basics now explainable, not just recognizable?"
          items={[
            "You should be able to explain bit meaning, memory occupancy, encoding, and pointer interpretation without hand-waving.",
            "You should be able to narrate failures as broken system stories rather than as isolated wrong facts.",
            "You should feel more ready for timing, buses, machine code, and runtime chapters because the base picture is sharper now.",
          ]}
          question="Could you teach one earlier mission to someone else from first principles instead of only repeating the answer?"
        />
      </section>
    </section>
  );
}

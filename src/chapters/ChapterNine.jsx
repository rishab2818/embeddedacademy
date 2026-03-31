import RevisionGame from "../components/RevisionGame";
import SectionHeading from "../components/SectionHeading";
import { revisionLore, revisionMissions } from "../data/revisionGame";

export default function ChapterNine({ chapterLabel = "Chapter 1.2" }) {
  return (
    <section className="chapter" id="chapter-9">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Revise the basics through an embedded rescue game</h2>
        <p>
          This lesson is a playable revision arena, not a quiz sheet. Each mission pulls from the
          earlier chapters and asks you to repair a technical failure using the right mental model
          of bits, memory, data types, pointers, input flow, real-time design, and bus-level
          voltage movement.
        </p>
      </div>

      <section className="chapter-section" id="chapter-9-game">
        <SectionHeading
          eyebrow="Revision arena"
          title="Game Revision 1: Signal Rescue"
          description="Work through a chain of embedded rescue missions that move from moderate reasoning to highly technical debugging, with detailed explanations after every move."
        />
        <RevisionGame missions={revisionMissions} lore={revisionLore} />
      </section>
    </section>
  );
}

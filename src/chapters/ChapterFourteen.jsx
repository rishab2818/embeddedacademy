import RevisionGame from "../components/RevisionGame";
import SectionHeading from "../components/SectionHeading";
import {
  runtimeRescueConfig,
  runtimeRescueLore,
  runtimeRescueMissions,
} from "../data/runtimeRevisionGame";
import { formatSectionLabel } from "../utils/courseLabels";

export default function ChapterFourteen({ chapterLabel = "Chapter 13", chapterNumber = "13" }) {
  return (
    <section className="chapter" id="chapter-13">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Runtime Rescue</h2>
        <p>
          This game ties the later system chapters together. You will debug clocks, bus roles, compilation,
          flash, RAM, instruction execution, and GPIO flow as one connected runtime story rather than as isolated
          definitions.
        </p>
      </div>

      <section className="chapter-section" id="chapter-13-game">
        <SectionHeading
          eyebrow={formatSectionLabel(chapterNumber, 1)}
          title="Game Revision 2: Runtime Rescue"
          description="Work through progressively deeper rescue missions that connect clocks, buses, compilation, flash, RAM, fetch-decode-execute, and real input/output behavior."
        />
        <RevisionGame
          missions={runtimeRescueMissions}
          lore={runtimeRescueLore}
          config={runtimeRescueConfig}
        />
      </section>
    </section>
  );
}

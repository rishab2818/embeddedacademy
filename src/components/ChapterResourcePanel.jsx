import PromptDownloadButton from "./PromptDownloadButton";

export default function ChapterResourcePanel({ chapter }) {
  return (
    <div className="panel chapter-resource-panel">
      <p className="eyebrow">Chapter Tools</p>
      <h3>Take this chapter outside the site</h3>
      <p className="panel-copy">
        Download a plain-text prompt pack for this chapter and use it with any LLM you prefer for
        deeper self-study, follow-up questions, or extra examples.
      </p>

      <PromptDownloadButton slug={chapter.slug} label="Download .txt Prompt Pack" className="primary-link chapter-download-button" />

      <div className="chapter-outline-list">
        {chapter.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="chapter-outline-link"
            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}

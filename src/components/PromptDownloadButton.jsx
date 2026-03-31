import { getChapterPrompt } from "../data/chapterPrompts";
import { downloadTextFile } from "../utils/downloadTextFile";

export default function PromptDownloadButton({ slug, label = "Download Chapter Prompt", className = "secondary-link" }) {
  const prompt = getChapterPrompt(slug);

  if (!prompt) {
    return null;
  }

  function handleDownload() {
    downloadTextFile(prompt.fileName, prompt.content);
  }

  return (
    <button type="button" className={className} onClick={handleDownload}>
      {label}
    </button>
  );
}

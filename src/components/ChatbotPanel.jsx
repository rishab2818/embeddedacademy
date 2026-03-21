import { useMemo, useState } from "react";
import { useAIConfig } from "../context/AIConfigContext";
import { requestChapterChat } from "../utils/chatProviders";

export default function ChatbotPanel({ lesson }) {
  const { config, isConfigured } = useAIConfig();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const systemPrompt = useMemo(
    () =>
      [
        "You are a patient embedded systems tutor.",
        `Current lesson: ${lesson.chapterLabel} ${lesson.title}.`,
        `Lesson context: ${lesson.chatbotContext}`,
        "Explain for a novice using analogies, short steps, and memory/hardware intuition when helpful.",
        "Stay focused on this chapter unless the learner explicitly asks to connect it to another chapter.",
      ].join("\n"),
    [lesson]
  );

  async function handleSend(event) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    if (!isConfigured) {
      setStatus("Set up a provider, API key, and model on the home page or in the setup panel before chatting.");
      return;
    }

    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setStatus("Thinking...");

    try {
      const reply = await requestChapterChat({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
        systemPrompt,
        messages: nextMessages,
      });

      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      setStatus(`Reply received from ${config.provider}.`);
    } catch (error) {
      setStatus(
        `${error.message || "Request failed."} If the key is invalid, expired, out of credits/tokens, or the provider blocks this browser request, update the session config and try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel chatbot-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Chapter Chatbot</p>
          <h3>Ask questions about {lesson.chapterLabel}</h3>
        </div>
      </div>

      <p className="panel-copy">
        Ask for clarification, analogies, examples, or a simpler explanation. The bot will stay
        focused on this lesson.
      </p>

      <div className="chat-history">
        {messages.length === 0 ? (
          <div className="chat-empty">
            Try: "Explain this chapter like I am 12" or "Give me one more analogy for this concept."
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              <strong>{message.role === "assistant" ? "Tutor" : "You"}</strong>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about this chapter..."
          rows={4}
        />
        <button type="submit" className="primary-link chat-send-button" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      <div className="callout">
        <strong>Status</strong>
        <span>{status || "No messages yet."}</span>
      </div>
    </div>
  );
}

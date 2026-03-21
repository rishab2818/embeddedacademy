const providerDefaults = {
  openai: "gpt-4.1-mini",
  gemini: "gemini-2.5-flash",
  claude: "claude-sonnet-4-20250514",
};

export const providerOptions = [
  { id: "openai", label: "OpenAI", defaultModel: providerDefaults.openai },
  { id: "gemini", label: "Gemini", defaultModel: providerDefaults.gemini },
  { id: "claude", label: "Claude", defaultModel: providerDefaults.claude },
];

export function getDefaultModel(provider) {
  return providerDefaults[provider] ?? "";
}

function normalizeError(provider, response, payload) {
  const message =
    payload?.error?.message ||
    payload?.error?.status ||
    payload?.message ||
    "The provider returned an error.";

  if (response.status === 401 || response.status === 403) {
    return `${provider} rejected the API key. Please check whether the key is correct, still active, and allowed to use this model.`;
  }

  if (response.status === 429) {
    return `${provider} rate-limited the request or your credits/tokens may be exhausted. Try again or use another model/key.`;
  }

  return `${provider} error (${response.status}): ${message}`;
}

export async function requestChapterChat({ provider, apiKey, model, systemPrompt, messages }) {
  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(normalizeError("OpenAI", response, payload));
    }

    return payload.choices?.[0]?.message?.content?.trim() || "No response returned.";
  }

  if (provider === "gemini") {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
        }),
      }
    );
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(normalizeError("Gemini", response, payload));
    }

    return payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response returned.";
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      system: systemPrompt,
      messages: messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      })),
    }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(normalizeError("Claude", response, payload));
  }

  return payload.content?.[0]?.text?.trim() || "No response returned.";
}

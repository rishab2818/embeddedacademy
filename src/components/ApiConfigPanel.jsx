import { useEffect, useState } from "react";
import { useAIConfig } from "../context/AIConfigContext";
import { getDefaultModel, providerOptions } from "../utils/chatProviders";

export default function ApiConfigPanel({ compact = false }) {
  const { config, setConfig, clearConfig, isConfigured } = useAIConfig();
  const [draft, setDraft] = useState(config);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  function handleProviderChange(provider) {
    setDraft((current) => ({
      ...current,
      provider,
      model:
        current.provider === provider && current.model
          ? current.model
          : getDefaultModel(provider),
    }));
  }

  return (
    <div className={`panel ai-config-panel ${compact ? "compact" : ""}`}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">Chapter Chat Setup</p>
          <h3>Bring your own API key</h3>
        </div>
      </div>

      <p className="panel-copy">
        The key is stored only for this browser session so you can move between chapter pages
        without re-entering it. When all tabs close, the setup is cleared.
      </p>

      <div className="control-row">
        <label htmlFor="provider">Provider</label>
        <select
          id="provider"
          value={draft.provider}
          onChange={(event) => handleProviderChange(event.target.value)}
        >
          {providerOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-row">
        <label htmlFor="apiKey">API key</label>
        <input
          id="apiKey"
          className="number-input wide-input"
          type="password"
          value={draft.apiKey}
          onChange={(event) => setDraft((current) => ({ ...current, apiKey: event.target.value }))}
          placeholder="Paste your API key"
        />
      </div>

      <div className="control-row">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          className="number-input wide-input"
          type="text"
          value={draft.model}
          onChange={(event) => setDraft((current) => ({ ...current, model: event.target.value }))}
          placeholder="Model name"
        />
      </div>

      <div className="button-row">
        <button type="button" className="primary-link" onClick={() => setConfig(draft)}>
          Save Session Config
        </button>
        <button type="button" className="secondary-link" onClick={clearConfig}>
          Clear
        </button>
      </div>

      <div className="callout">
        <strong>Status</strong>
        <span>
          {isConfigured
            ? `Ready: ${config.provider} / ${config.model}`
            : "No active AI config yet. Save a provider, key, and model to use the chapter chatbot."}
        </span>
      </div>
    </div>
  );
}

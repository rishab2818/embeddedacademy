import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "embedded-ai-config";

const defaultConfig = {
  provider: "openai",
  apiKey: "",
  model: "gpt-4.1-mini",
};

const AIConfigContext = createContext(null);

export function AIConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultConfig;
  });

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const value = useMemo(
    () => ({
      config,
      setConfig,
      clearConfig: () => setConfig(defaultConfig),
      isConfigured: Boolean(config.apiKey && config.model),
    }),
    [config]
  );

  return <AIConfigContext.Provider value={value}>{children}</AIConfigContext.Provider>;
}

export function useAIConfig() {
  const context = useContext(AIConfigContext);

  if (!context) {
    throw new Error("useAIConfig must be used inside AIConfigProvider");
  }

  return context;
}

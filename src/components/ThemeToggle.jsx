export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className={`theme-toggle ${theme === "light" ? "light" : "dark"}`}
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
      <strong>{theme === "light" ? "Sun" : "Moon"}</strong>
    </button>
  );
}

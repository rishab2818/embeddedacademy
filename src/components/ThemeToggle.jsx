export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className={`theme-toggle ${theme === "light" ? "light" : "dark"}`}
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="theme-toggle-label">Theme</span>
      <strong>{theme === "light" ? "Light" : "Dark"}</strong>
    </button>
  );
}

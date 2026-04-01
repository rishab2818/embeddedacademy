import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function SiteTopBar({ theme, onToggleTheme }) {
  return (
    <div className="site-topbar">
      <div className="site-topbar-brand">
        <Link className="site-topbar-home" to="/">
          Embedded Academy
        </Link>
        <span className="site-topbar-tag">Interactive embedded learning</span>
      </div>

      <div className="site-topbar-actions">
        <nav className="site-topbar-nav" aria-label="Primary">
          <NavLink className={({ isActive }) => `site-topbar-link ${isActive ? "active" : ""}`} to="/">
            Chapters
          </NavLink>
          <NavLink className={({ isActive }) => `site-topbar-link ${isActive ? "active" : ""}`} to="/abbreviations">
            Abbreviations
          </NavLink>
        </nav>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}

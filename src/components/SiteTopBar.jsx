import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function SiteTopBar({ theme, onToggleTheme }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-topbar ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="site-topbar-row">
        <Link className="site-topbar-home" to="/">
          Embedded Academy
        </Link>

        <button
          type="button"
          className="site-topbar-menu"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="site-topbar-panel"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
        </button>

        <div className="site-topbar-panel" id="site-topbar-panel">
          <nav className="site-topbar-nav" aria-label="Primary">
            <NavLink className={({ isActive }) => `site-topbar-link ${isActive ? "active" : ""}`} to="/">
              Chapters
            </NavLink>
            <NavLink className={({ isActive }) => `site-topbar-link ${isActive ? "active" : ""}`} to="/abbreviations">
              Glossary
            </NavLink>
          </nav>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function SiteTopBar({ theme, onToggleTheme }) {
  return (
    <div className="site-topbar">
      <Link className="site-topbar-home" to="/">
        Embedded Academy
      </Link>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

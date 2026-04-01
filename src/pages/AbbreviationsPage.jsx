import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FancySelect from "../components/FancySelect";
import { abbreviationGroups } from "../data/abbreviations";

export default function AbbreviationsPage() {
  const [groupId, setGroupId] = useState(abbreviationGroups[0].id);
  const [query, setQuery] = useState("");
  const activeGroup = useMemo(
    () => abbreviationGroups.find((group) => group.id === groupId) ?? abbreviationGroups[0],
    [groupId]
  );
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return activeGroup.items;
    }

    return activeGroup.items.filter(
      (item) =>
        item.short.toLowerCase().includes(normalizedQuery) ||
        item.full.toLowerCase().includes(normalizedQuery) ||
        item.easy.toLowerCase().includes(normalizedQuery)
    );
  }, [activeGroup.items, query]);

  return (
    <div className="glossary-page">
      <section className="panel glossary-hero">
        <div className="glossary-hero-copy">
          <p className="eyebrow">Reference page</p>
          <h1>Embedded abbreviations made easy</h1>
          <p className="hero-text">
            This page collects the short forms used across the whole site and explains them in plain language.
            Use it whenever a chapter feels dense or a hardware term shows up before it feels familiar.
          </p>
          <div className="button-row">
            <Link className="primary-link" to="/">
              Back to chapters
            </Link>
            <Link className="secondary-link" to="/lesson/microcontroller-clocks-and-timing">
              Jump to clocks
            </Link>
          </div>
        </div>

        <div className="glossary-hero-card">
          <span>How to use this page</span>
          <strong>Pick a category, then scan the short form, the full form, and the easy explanation.</strong>
          <p>
            If you are ever unsure whether a term is about memory, timing, buses, or CPU internals, this page is
            meant to be the calm reset point.
          </p>
        </div>
      </section>

      <section className="chapter-grid chapter-grid-wide">
        <div className="panel glossary-panel-stack">
          <p className="eyebrow">Categories</p>
          <h3>Find the right type of term quickly</h3>

          <div className="control-row">
            <label>Category</label>
            <FancySelect
              ariaLabel="Select abbreviation category"
              value={groupId}
              onChange={setGroupId}
              options={abbreviationGroups.map((group) => ({ label: group.title, value: group.id }))}
            />
          </div>

          <div className="control-row">
            <label htmlFor="abbreviation-search">Search inside this category</label>
            <input
              id="abbreviation-search"
              className="glossary-search-input"
              type="text"
              placeholder="Try CPU, clock, RAM, GPIO..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="glossary-group-grid">
            {abbreviationGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`glossary-group-card ${group.id === groupId ? "active" : ""}`}
                onClick={() => setGroupId(group.id)}
              >
                <span>{group.title}</span>
                <strong>{group.items.length} terms</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="panel glossary-panel-stack">
          <p className="eyebrow">Terms</p>
          <h3>{activeGroup.title}</h3>

          <div className="glossary-card-grid">
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <article key={item.short} className="glossary-entry-card">
                  <span>{item.short}</span>
                  <strong>{item.full}</strong>
                  <p>{item.easy}</p>
                </article>
              ))
            ) : (
              <article className="glossary-entry-card glossary-empty-state">
                <span>No match</span>
                <strong>Try a broader word</strong>
                <p>
                  Search by the short form, the full form, or a plain-language idea like "memory", "clock", or "input".
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

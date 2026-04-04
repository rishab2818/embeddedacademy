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
  const totalTerms = useMemo(
    () => abbreviationGroups.reduce((sum, group) => sum + group.items.length, 0),
    []
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
          <h1>Embedded abbreviations made easier to scan and search</h1>
          <p className="hero-text">
            This page collects the short forms used across the site and explains them in plain
            language. It now works better as a quick reference on smaller screens too.
          </p>
          <div className="button-row">
            <Link className="primary-link" to="/">
              Back to chapters
            </Link>
            <Link className="secondary-link" to="/lesson/microcontroller-clocks-and-timing">
              Open clocks chapter
            </Link>
          </div>
        </div>

        <div className="glossary-hero-card">
          <span>Reference snapshot</span>
          <strong>
            {abbreviationGroups.length} categories and {totalTerms} terms in one searchable place.
          </strong>
          <p>
            Pick a category when you want focus, or search by short form, full form, or a plain
            idea like memory, clock, input, bus, or CPU.
          </p>
        </div>
      </section>

      <section className="glossary-shell">
        <aside className="panel glossary-filter-panel">
          <div className="glossary-panel-stack">
            <div>
              <p className="eyebrow">Filters</p>
              <h2>Find the right term quickly</h2>
              <p className="panel-copy">
                Use the dropdown for quick switching, then tap a category card if you want to browse.
              </p>
            </div>

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
              <label htmlFor="abbreviation-search">Search within the active category</label>
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
        </aside>

        <section className="panel glossary-results-panel">
          <div className="glossary-results-head">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{activeGroup.title}</h2>
              <p className="panel-copy">
                {filteredItems.length} {filteredItems.length === 1 ? "term" : "terms"} showing in this category.
              </p>
            </div>

            <div className="glossary-results-stat">
              <strong>{filteredItems.length}</strong>
              <span>visible items</span>
            </div>
          </div>

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
                  Search by the short form, the full form, or a plain-language idea like memory,
                  clock, bus, output, or timing.
                </p>
              </article>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

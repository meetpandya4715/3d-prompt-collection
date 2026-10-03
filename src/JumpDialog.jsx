import { useState } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import { prompts, sections } from "./data";
import Modal from "./Modal";
export default function JumpDialog({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const filtered = prompts.filter((p) =>
    (p.number + " " + p.title + " " + p.shortTitle)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Modal className="jump-dialog" label="Jump to prompt" onClose={onClose}>
      <header className="jump-header">
        <h2>Jump to prompt</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close jump list"
        >
          <X />
        </button>
      </header>
      <label className="jump-search">
        <Search size={19} />
        <input
          autoFocus
          placeholder="Search by title or number…"
          aria-label="Search jump list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="jump-list">
        {sections.map((s) => {
          const rows = filtered.filter((p) => p.section.id === s.id);
          return rows.length ? (
            <section key={s.id}>
              <h3>{s.label}</h3>
              {rows.map((p) => (
                <button
                  key={p.id}
                  className="jump-row"
                  onClick={() => onSelect(p)}
                >
                  <span className="prompt-number">{p.number}</span>
                  <span>{p.title}</span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </section>
          ) : null;
        })}
        {!filtered.length && (
          <p className="empty-jump">No prompts match “{query}”.</p>
        )}
      </div>
    </Modal>
  );
}

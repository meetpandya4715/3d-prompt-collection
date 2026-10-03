import {
  Search,
  Layers,
  Landmark,
  Gamepad2,
  Leaf,
  Mountain,
  Waves,
  Orbit,
  X,
} from "lucide-react";
import { sections } from "./data";
const icons = { Landmark, Gamepad2, Leaf, Mountain, Waves, Orbit };
export default function Sidebar({
  active,
  onSection,
  query,
  setQuery,
  open,
  onClose,
}) {
  return (
    <>
      <div
        className={"sidebar-shade " + (open ? "shown" : "")}
        onClick={onClose}
      />
      <aside
        className={"sidebar " + (open ? "open" : "")}
        aria-label="Prompt collection navigation"
      >
        <div className="brand">
          <svg
            width="39"
            height="39"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="8" ry="17" />
            <path d="M3 20h34M5 12h30M5 28h30" />
          </svg>
          <div>
            <span>Worlds</span>
            <p>Prompt Atlas</p>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            aria-label="Find a prompt"
            placeholder="Find a prompt…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </label>
        <nav className="section-nav">
          <button
            className={"nav-item " + (active === "all" ? "active" : "")}
            aria-current={active === "all" ? "page" : undefined}
            onClick={() => onSection("all")}
          >
            <Layers size={21} />
            <span>All prompts</span>
          </button>
          {sections.map((s) => {
            const Icon = icons[s.icon];
            return (
              <button
                key={s.id}
                className={"nav-item " + (active === s.id ? "active" : "")}
                aria-current={active === s.id ? "page" : undefined}
                onClick={() => onSection(s.id)}
              >
                <Icon size={21} />
                <span>{s.nav}</span>
                <span className="nav-count">{s.end - s.start + 1}</span>
              </button>
            );
          })}
        </nav>
        <p className="sidebar-foot">
          63 prompts <span>·</span> 252 previews
        </p>
      </aside>
    </>
  );
}

import { useState, useEffect, useDeferredValue, lazy, Suspense } from "react";
import { ArrowUpRight, Menu, X, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import PromptCard from "./PromptCard";
import JumpDialog from "./JumpDialog";
import { prompts, sections, getPromptFromHash } from "./data";
const PromptReader = lazy(() => import("./PromptReader"));
const ImageViewer = lazy(() => import("./ImageViewer"));
export default function App() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [reader, setReader] = useState(getPromptFromHash);
  const [viewer, setViewer] = useState(null);
  const [jump, setJump] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    const onHash = () => setReader(getPromptFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.body.style.overflow =
      reader || viewer || jump || navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [reader, viewer, jump, navOpen]);
  useEffect(() => {
    const listener = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setJump(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  const openPrompt = (p) => {
    setViewer(null);
    setJump(false);
    setNavOpen(false);
    setReader(p);
    window.history.pushState(null, "", "#prompt-" + p.number);
  };
  const closeReader = () => {
    setReader(null);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  };
  const chooseSection = (id) => {
    setActive(id);
    setQuery("");
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const words = deferredQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = prompts.filter(
    (p) =>
      (active === "all" || p.section.id === active) &&
      words.every((w) => p.searchText.includes(w)),
  );
  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        onSection={chooseSection}
        query={query}
        setQuery={setQuery}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <main className="main-content">
        <header className="main-header">
          <button
            className="icon-button mobile-menu"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <div>
            <h1>Explore the possibilities.</h1>
            <p>A visual companion to the 3D Prompt Collection.</p>
          </div>
          <button className="button jump-button" onClick={() => setJump(true)}>
            Jump to prompt <ArrowUpRight size={18} />
          </button>
        </header>
        {query && (
          <div className="search-summary">
            <p>
              {filtered.length} {filtered.length === 1 ? "prompt" : "prompts"}{" "}
              matching “{query}”
            </p>
            <button className="text-button" onClick={() => setQuery("")}>
              Clear search <X size={16} />
            </button>
          </div>
        )}
        {sections.map((s) => {
          const rows = filtered.filter((p) => p.section.id === s.id);
          return rows.length ? (
            <section
              className="gallery-section"
              key={s.id}
              aria-labelledby={"section-" + s.id}
            >
              <div className="section-heading">
                <h2 id={"section-" + s.id}>{s.label}</h2>
                <p>
                  {rows.length} {rows.length === 1 ? "prompt" : "prompts"}
                </p>
              </div>
              <div className="prompt-grid">
                {rows.map((p) => (
                  <PromptCard
                    key={p.id}
                    prompt={p}
                    onOpen={openPrompt}
                    onImage={(prompt, sample) => setViewer({ prompt, sample })}
                  />
                ))}
              </div>
            </section>
          ) : null;
        })}
        {!filtered.length && (
          <div className="empty-state">
            <Search size={30} />
            <h2>No prompts found.</h2>
            <p>Try a place, a scene, or a prompt number.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setActive("all");
              }}
            >
              Show all prompts
            </button>
          </div>
        )}
        <footer className="main-footer">
          Conceptual previews generated with ImageGen. Actual builds will vary.
        </footer>
      </main>
      {jump && (
        <JumpDialog onClose={() => setJump(false)} onSelect={openPrompt} />
      )}
      <Suspense fallback={null}>
        {reader && (
          <PromptReader
            prompt={reader}
            onClose={closeReader}
            onPrompt={openPrompt}
            onImage={(prompt, sample) => setViewer({ prompt, sample })}
          />
        )}
        {viewer && (
          <ImageViewer
            prompt={viewer.prompt}
            initialSample={viewer.sample}
            onClose={() => setViewer(null)}
            onPrompt={() => openPrompt(viewer.prompt)}
          />
        )}
      </Suspense>
    </div>
  );
}

import { useEffect, useState } from "react";

const storageKey = "meet-letter-theme";
function preferredTheme() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* Theme switching still works without storage. */ }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || preferredTheme());
  function apply(next) {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#111318" : "#fafafc");
    setTheme(next);
  }
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => apply(preferredTheme());
    const storage = (event) => { if (event.key === storageKey || event.key === null) sync(); };
    media.addEventListener("change", sync);
    window.addEventListener("storage", storage);
    sync();
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", storage);
    };
  }, []);
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  return (
    <button className="theme-toggle" type="button" aria-label={label} title={label} onClick={() => {
      const next = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, next); } catch { /* Keep this visit usable. */ }
      apply(next);
    }}>
      <svg className="theme-icon-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z" /></svg>
      <svg className="theme-icon-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
    </button>
  );
}

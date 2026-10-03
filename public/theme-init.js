// Apply the shared portfolio preference before the page paints.
(() => {
  let theme;
  try { theme = localStorage.getItem("meet-letter-theme"); } catch {}
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#111318" : "#fafafc");
})();

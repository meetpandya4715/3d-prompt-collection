import { useState, useEffect, useRef } from "react";
import {
  X,
  Expand,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Modal from "./Modal";
import Preview from "./Preview";
import { samples } from "./data";
export default function ImageViewer({
  prompt,
  initialSample,
  onClose,
  onPrompt,
}) {
  const [sample, setSample] = useState(initialSample);
  const [fullscreen, setFullscreen] = useState(false);
  const wrapper = useRef(null);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSample((s) => (s + 3) % 4);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSample((s) => (s + 1) % 4);
      }
    };
    const change = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("keydown", key);
    document.addEventListener("fullscreenchange", change);
    return () => {
      window.removeEventListener("keydown", key);
      document.removeEventListener("fullscreenchange", change);
    };
  }, []);
  async function close() {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
    onClose();
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (wrapper.current?.requestFullscreen)
        await wrapper.current.requestFullscreen();
    } catch {
      /* The viewer already fills the viewport when browser fullscreen is unavailable. */
    }
  }
  async function viewPrompt() {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
    onPrompt();
  }
  return (
    <Modal
      className="image-viewer"
      label={prompt.shortTitle + " image viewer"}
      onClose={close}
    >
      <div className="viewer-shell" ref={wrapper}>
        <header className="viewer-header">
          <div>
            <p>
              Prompt {prompt.number} · {prompt.section.nav}
            </p>
            <h2>{prompt.shortTitle}</h2>
          </div>
          <div className="viewer-actions">
            <button className="button" onClick={viewPrompt}>
              View prompt <ArrowUpRight size={17} />
            </button>
            {document.fullscreenEnabled && (
              <button
                className="icon-button"
                onClick={toggleFullscreen}
                aria-label={
                  fullscreen
                    ? "Exit browser fullscreen"
                    : "Enter browser fullscreen"
                }
              >
                {fullscreen ? <Minimize size={22} /> : <Expand size={22} />}
              </button>
            )}
            <button
              className="icon-button"
              onClick={close}
              aria-label="Close image viewer"
            >
              <X size={25} />
            </button>
          </div>
        </header>
        <div className="viewer-stage">
          <button
            className="slide-arrow previous"
            onClick={() => setSample((s) => (s + 3) % 4)}
            aria-label="Previous sample"
          >
            <ChevronLeft size={26} />
          </button>
          <Preview prompt={prompt} sample={sample} fit="meet" eager />
          <button
            className="slide-arrow next"
            onClick={() => setSample((s) => (s + 1) % 4)}
            aria-label="Next sample"
          >
            <ChevronRight size={26} />
          </button>
        </div>
        <footer className="viewer-footer">
          <p className="preview-caption" aria-live="polite">
            {samples[sample]} · Sample {sample + 1} of 4
          </p>
          <div className="thumbnails">
            {samples.map((name, index) => (
              <button
                key={name}
                className={"thumbnail " + (sample === index ? "selected" : "")}
                onClick={() => setSample(index)}
                aria-label={"Sample " + (index + 1) + ": " + name}
                aria-pressed={sample === index}
              >
                <Preview prompt={prompt} sample={index} eager />
              </button>
            ))}
          </div>
          <p className="viewer-help">← → to browse · Esc to close</p>
        </footer>
      </div>
    </Modal>
  );
}

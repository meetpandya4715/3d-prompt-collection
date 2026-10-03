import { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";
import {
  X,
  Maximize2 as Expand,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import Modal from "./Modal";
import Preview from "./Preview";
import { prompts, samples } from "./data";
export default function PromptReader({ prompt, onClose, onPrompt, onImage }) {
  const [sample, setSample] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    setSample(0);
    setCopied(false);
    setCopyError(false);
    textRef.current?.scrollTo(0, 0);
  }, [prompt.id]);
  const previous = prompts[prompt.id - 2];
  const next = prompts[prompt.id];
  useEffect(() => {
    const onKey = (e) => {
      if (
        document.querySelector(".image-viewer") ||
        ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) ||
        window.getSelection()?.toString()
      )
        return;
      if (e.key === "ArrowLeft" && previous) {
        e.preventDefault();
        onPrompt(previous);
      }
      if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        onPrompt(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next, onPrompt]);
  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.prompt);
      } else {
        const el = document.createElement("textarea");
        el.value = prompt.prompt;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.append(el);
        el.select();
        const ok = document.execCommand("copy");
        el.remove();
        if (!ok) throw Error("Copy unavailable");
      }
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <Modal
      className="reader-dialog"
      label={"Prompt " + prompt.number + ": " + prompt.title}
      onClose={onClose}
    >
      <header className="reader-header">
        <div>
          <p>{prompt.number} / 63</p>
          <h2>{prompt.title}</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close prompt"
        >
          <X size={24} />
        </button>
      </header>
      <div className="reader-body">
        <div className="reader-visual">
          <button
            className="reader-image"
            onClick={() => onImage(prompt, sample)}
            aria-label={"Enlarge sample " + (sample + 1)}
          >
            <Preview prompt={prompt} sample={sample} eager />
            <span className="expand-mark">
              <Expand size={20} />
            </span>
          </button>
          <div className="thumbnails">
            {samples.map((name, index) => (
              <button
                key={name}
                className={"thumbnail " + (sample === index ? "selected" : "")}
                onClick={() => setSample(index)}
                aria-label={name}
                aria-pressed={sample === index}
                title={name}
              >
                <Preview prompt={prompt} sample={index} eager />
              </button>
            ))}
          </div>
          <p className="preview-caption">
            Conceptual preview · {sample + 1} of 4
          </p>
          <div className="reader-pagination">
            <button
              className="button"
              disabled={!previous}
              onClick={() => onPrompt(previous)}
            >
              <ArrowLeft size={19} /> Previous prompt
            </button>
            <button
              className="button"
              disabled={!next}
              onClick={() => onPrompt(next)}
            >
              Next prompt <ArrowRight size={19} />
            </button>
          </div>
        </div>
        <div className="reader-text" ref={textRef}>
          <div className="reader-copy">
            <button className="button" onClick={copyPrompt}>
              {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
              {copied ? "Copied!" : "Copy prompt"}
            </button>
          </div>
          <div className="copy-status" role="status">
            {copyError
              ? "Copy unavailable here. Select the prompt text to copy it."
              : ""}
          </div>
          <div className="prompt-prose">
            <Markdown>{prompt.prompt}</Markdown>
          </div>
        </div>
      </div>
    </Modal>
  );
}

import { ArrowRight } from "lucide-react";
import Preview from "./Preview";
export default function PromptCard({ prompt, onOpen }) {
  return (
    <article className="prompt-card" id={"card-" + prompt.number}>
      <button
        className="card-image"
        onClick={() => onOpen(prompt)}
        aria-label={"Open prompt: " + prompt.shortTitle}
      >
        <Preview prompt={prompt} eager={prompt.id < 3} />
      </button>
      <div className="card-caption">
        <span className="prompt-number">{prompt.number}</span>
        <div className="card-title">
          <h3>
            <button onClick={() => onOpen(prompt)} title={prompt.title}>
              {prompt.shortTitle}
            </button>
          </h3>
          <p>{prompt.section.nav}</p>
        </div>
        <button className="button view-prompt" onClick={() => onOpen(prompt)}>
          View prompt <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

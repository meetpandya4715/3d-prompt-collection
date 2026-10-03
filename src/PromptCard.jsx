import { useState } from "react";
import { ArrowRight, Maximize2 as Expand } from "lucide-react";
import Preview from "./Preview";
import { samples } from "./data";
export default function PromptCard({ prompt, onOpen, onImage }) {
  const [sample, setSample] = useState(0);
  return (
    <article className="prompt-card" id={"card-" + prompt.number}>
      <button
        className="card-image"
        onClick={() => onImage(prompt, sample)}
        aria-label={"Enlarge " + prompt.shortTitle + " sample " + (sample + 1)}
      >
        <Preview prompt={prompt} sample={sample} eager={prompt.id < 3} />
        <span className="expand-mark">
          <Expand size={17} />
        </span>
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
      <div
        className="thumbnails"
        role="group"
        aria-label={prompt.shortTitle + " samples"}
      >
        {samples.map((name, index) => (
          <button
            key={name}
            className={"thumbnail " + (sample === index ? "selected" : "")}
            onClick={() => setSample(index)}
            aria-label={prompt.shortTitle + ": " + name}
            aria-pressed={sample === index}
            title={name}
          >
            <Preview prompt={prompt} sample={index} />
          </button>
        ))}
      </div>
    </article>
  );
}

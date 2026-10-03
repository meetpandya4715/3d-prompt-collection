import { useId, useState, useEffect, useRef } from "react";
import { samples } from "./data";
import imageSizes from "./image-sizes.json";
// Four independent ImageGen compositions share a lossless source sheet.
// An SVG viewBox isolates one frame, keeping the source pixels intact.
export default function Preview({
  prompt,
  sample = 0,
  fit = "slice",
  className = "",
  eager = false,
}) {
  const [width, height] = imageSizes[prompt.number] || [1536, 1024];
  const frameWidth = width / 2,
    frameHeight = height / 2;
  const id = useId();
  const ref = useRef(null);
  const [visible, setVisible] = useState(eager);
  useEffect(() => {
    if (visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <svg
      ref={ref}
      className={"preview " + className}
      viewBox={
        (sample % 2) * frameWidth +
        " " +
        Math.floor(sample / 2) * frameHeight +
        " " +
        frameWidth +
        " " +
        frameHeight
      }
      preserveAspectRatio={"xMidYMid " + fit}
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>
        {prompt.shortTitle} — {samples[sample]}
      </title>
      {visible && (
        <g>
          <defs>
            <clipPath id={id + "-clip"}>
              <rect
                x={(sample % 2) * frameWidth}
                y={Math.floor(sample / 2) * frameHeight}
                width={frameWidth}
                height={frameHeight}
              />
            </clipPath>
          </defs>
          <image
            href={prompt.image}
            width={width}
            height={height}
            clipPath={"url(#" + id + "-clip)"}
          />
        </g>
      )}
    </svg>
  );
}

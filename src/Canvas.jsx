import { useRef, useEffect, useState } from "react";
import ImageBlock from "./ImageBlock";

export default function Canvas({
  currentLayout,
  aspectRatio,
  images,
  onUpload,
  onRemove,
  onTransform,
  gap,
  bgColor,
  borderRadius,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const padded = { w: rect.width - 64, h: rect.height - 64 };
      const ratio = aspectRatio.width / aspectRatio.height;

      let w, h;
      if (padded.w / padded.h > ratio) {
        h = padded.h;
        w = h * ratio;
      } else {
        w = padded.w;
        h = w / ratio;
      }
      setSize({ width: Math.round(w), height: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspectRatio]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden min-w-0"
    >
      <div
        className="relative shadow-2xl"
        style={{
          width: size.width,
          height: size.height,
          backgroundColor: bgColor,
          borderRadius: borderRadius > 0 ? borderRadius + 4 : 0,
          transition: "width 0.2s, height 0.2s",
        }}
      >
        {currentLayout.blocks.map((block, i) => (
          <ImageBlock
            key={i}
            index={i}
            image={images[i]}
            onUpload={onUpload}
            onRemove={onRemove}
            onTransform={onTransform}
            style={{
              left: `calc(${block.x * 100}% + ${gap.value / 2}px)`,
              top: `calc(${block.y * 100}% + ${gap.value / 2}px)`,
              width: `calc(${block.w * 100}% - ${gap.value}px)`,
              height: `calc(${block.h * 100}% - ${gap.value}px)`,
              borderRadius: borderRadius,
              backgroundColor: "#1a1a2e",
            }}
          />
        ))}
      </div>
    </div>
  );
}

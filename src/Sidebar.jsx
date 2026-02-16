import {
  IMAGE_COUNTS,
  ASPECT_RATIOS,
  GAP_OPTIONS,
  EXPORT_SIZES,
} from "./layouts";
import LayoutPreview from "./LayoutPreview";

export default function Sidebar({
  imageCount,
  setImageCount,
  aspectRatio,
  setAspectRatio,
  layoutIndex,
  setLayoutIndex,
  layouts,
  gap,
  setGap,
  exportSize,
  setExportSize,
  bgColor,
  setBgColor,
  borderRadius,
  setBorderRadius,
  exportImage,
  images,
}) {
  const allFilled =
    Object.keys(images).length === imageCount &&
    Object.values(images).every(Boolean);

  return (
    <aside className="w-72 flex-shrink-0 bg-[#111] border-r border-gray-800 overflow-y-auto p-2 flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold tracking-tight">Image Grid</h1>
        <p className="text-xs text-gray-500 mt-1">
          Combine multiple images into one
        </p>
      </div>

      {/* Image count */}
      <Section title="Images">
        <div className="flex gap-1.5">
          {IMAGE_COUNTS.map((c) => (
            <button
              key={c}
              onClick={() => setImageCount(c)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${imageCount === c
                ? "bg-indigo-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* Aspect ratio */}
      <Section title="Aspect Ratio">
        <div className="flex gap-1.5">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              onClick={() => setAspectRatio(ar)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${aspectRatio.value === ar.value
                ? "bg-indigo-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Layout */}
      <Section title="Layout">
        <div className="flex gap-2 flex-wrap">
          {layouts.map((layout, i) => (
            <LayoutPreview
              key={i}
              layout={layout}
              isActive={layoutIndex === i}
              onClick={() => setLayoutIndex(i)}
              aspectRatio={aspectRatio}
            />
          ))}
        </div>
      </Section>

      {/* Gap */}
      <Section title="Gap">
        <div className="flex gap-1.5">
          {GAP_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGap(g)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${gap.value === g.value
                ? "bg-indigo-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Border radius */}
      <Section title={`Radius: ${borderRadius}px`}>
        <input
          type="range"
          min={0}
          max={32}
          value={borderRadius}
          onChange={(e) => setBorderRadius(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </Section>

      {/* Background color */}
      <Section title="Background">
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
          />
          <span className="text-sm text-gray-400 font-mono">{bgColor}</span>
        </div>
      </Section>

      {/* Export size */}
      <Section title="Export Size">
        <div className="flex gap-1.5">
          {EXPORT_SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setExportSize(s)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${exportSize.value === s.value
                ? "bg-indigo-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Export button */}
      <button
        onClick={exportImage}
        disabled={!allFilled}
        className={`mt-auto w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${allFilled
          ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25"
          : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
      >
        Export Image
      </button>
    </aside>
  );
}

function Section({ title, children }) {
  return (
    <div >
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function LayoutPreview({ layout, isActive, onClick, aspectRatio }) {
  const w = 48;
  const h = Math.round(w * (aspectRatio.height / aspectRatio.width));

  return (
    <button
      onClick={onClick}
      className={`relative border-2 rounded-lg overflow-hidden transition-all cursor-pointer flex-shrink-0 ${
        isActive
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-gray-700 bg-gray-900 hover:border-gray-500"
      }`}
      style={{ width: w, height: h }}
      title={layout.name}
    >
      {layout.blocks.map((block, i) => (
        <div
          key={i}
          className="absolute bg-gray-600"
          style={{
            left: `${block.x * 100}%`,
            top: `${block.y * 100}%`,
            width: `${block.w * 100 - 4}%`,
            height: `${block.h * 100 - 4}%`,
            margin: "2%",
            borderRadius: 2,
          }}
        />
      ))}
    </button>
  );
}

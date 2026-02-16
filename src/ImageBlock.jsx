import { useRef, useState, useCallback, useEffect } from "react";

export default function ImageBlock({ index, image, onUpload, onRemove, onTransform, style }) {
  const inputRef = useRef(null);
  const blockRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const [naturalSize, setNaturalSize] = useState(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(index, file);
    },
    [index, onUpload]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!image) inputRef.current?.click();
  }, [image]);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) onUpload(index, file);
      e.target.value = "";
    },
    [index, onUpload]
  );

  const handleImgLoad = useCallback((e) => {
    setNaturalSize({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  }, []);

  // Compute the displayed image size to fill the block (cover behavior)
  const getImgStyle = () => {
    if (!image || !naturalSize || !blockRef.current) return {};
    const block = blockRef.current.getBoundingClientRect();
    const bw = block.width;
    const bh = block.height;
    if (bw === 0 || bh === 0) return {};

    const imgRatio = naturalSize.width / naturalSize.height;
    const boxRatio = bw / bh;

    // Base cover dimensions
    let baseW, baseH;
    if (imgRatio > boxRatio) {
      baseH = bh;
      baseW = bh * imgRatio;
    } else {
      baseW = bw;
      baseH = bw / imgRatio;
    }

    const scale = image.scale || 1;
    const w = baseW * scale;
    const h = baseH * scale;

    // offsetX/offsetY are in [-1, 1] range representing fraction of max pan
    const maxPanX = (w - bw) / 2;
    const maxPanY = (h - bh) / 2;
    const ox = (image.offsetX || 0) * maxPanX;
    const oy = (image.offsetY || 0) * maxPanY;

    return {
      width: w,
      height: h,
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
      maxWidth: "none",
      pointerEvents: "none",
    };
  };

  // Wheel → zoom
  const handleWheel = useCallback(
    (e) => {
      if (!image || !onTransform) return;
      e.preventDefault();
      const scale = image.scale || 1;
      const delta = -e.deltaY * 0.002;
      const newScale = Math.min(5, Math.max(1, scale + delta));

      // When zooming out, clamp offsets so image still covers
      let offsetX = image.offsetX || 0;
      let offsetY = image.offsetY || 0;
      if (newScale < scale) {
        offsetX = Math.min(1, Math.max(-1, offsetX));
        offsetY = Math.min(1, Math.max(-1, offsetY));
      }

      onTransform(index, { scale: newScale, offsetX, offsetY });
    },
    [image, index, onTransform]
  );

  // Mouse drag → pan
  const handleMouseDown = useCallback(
    (e) => {
      if (!image || !onTransform) return;
      // Don't start drag on buttons
      if (e.target.tagName === "BUTTON") return;
      e.preventDefault();
      setDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: image.offsetX || 0,
        offsetY: image.offsetY || 0,
      };
    },
    [image, onTransform]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      if (!dragStart.current || !blockRef.current || !naturalSize) return;
      const block = blockRef.current.getBoundingClientRect();
      const bw = block.width;
      const bh = block.height;
      const imgRatio = naturalSize.width / naturalSize.height;
      const boxRatio = bw / bh;

      let baseW, baseH;
      if (imgRatio > boxRatio) {
        baseH = bh;
        baseW = bh * imgRatio;
      } else {
        baseW = bw;
        baseH = bw / imgRatio;
      }

      const scale = image?.scale || 1;
      const w = baseW * scale;
      const h = baseH * scale;
      const maxPanX = (w - bw) / 2;
      const maxPanY = (h - bh) / 2;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      // Convert pixel movement to offset fraction
      const newOffsetX = maxPanX > 0
        ? Math.min(1, Math.max(-1, dragStart.current.offsetX + dx / maxPanX))
        : 0;
      const newOffsetY = maxPanY > 0
        ? Math.min(1, Math.max(-1, dragStart.current.offsetY + dy / maxPanY))
        : 0;

      onTransform(index, { scale, offsetX: newOffsetX, offsetY: newOffsetY });
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragStart.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, image, index, naturalSize, onTransform]);

  // Attach wheel with passive: false for preventDefault
  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div
      ref={blockRef}
      className={`image-block flex items-center justify-center ${dragOver ? "drag-over" : ""
        } ${image ? (dragging ? "img-grabbing" : "img-grab") : ""}`}
      style={style}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onMouseDown={image ? handleMouseDown : undefined}
    >
      {image ? (
        <>
          <img
            src={image.url}
            alt={`Block ${index + 1}`}
            draggable={false}
            onLoad={handleImgLoad}
            style={getImgStyle()}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="bg-white/50 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/80 transition-colors cursor-pointer"
              >
                Replace
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="bg-red-500/50 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/80 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="flex gap-1 items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const scale = image.scale || 1;
                  const newScale = Math.max(1, scale - 0.25);
                  onTransform(index, { scale: newScale, offsetX: image.offsetX || 0, offsetY: image.offsetY || 0 });
                }}
                className="bg-white/50 text-gray-900 w-8 h-8 rounded-lg text-lg font-bold hover:bg-white/80 transition-colors cursor-pointer flex items-center justify-center "
              >
                −
              </button>
              <span className="text-white text-xs font-medium min-w-[3rem] text-center">
                {Math.round((image.scale || 1) * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const scale = image.scale || 1;
                  const newScale = Math.min(5, scale + 0.25);
                  onTransform(index, { scale: newScale, offsetX: image.offsetX || 0, offsetY: image.offsetY || 0 });
                }}
                className="bg-white/50 text-gray-900 w-8 h-8 rounded-lg text-lg font-bold hover:bg-white/80 transition-colors cursor-pointer flex items-center justify-center "
              >
                +
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-500 pointer-events-none">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xs font-medium">Click or drop</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

import { useState, useCallback, useRef } from "react";
import { ASPECT_RATIOS, getLayouts, GAP_OPTIONS, EXPORT_SIZES } from "./layouts";

export function useImageCombiner() {
  const [imageCount, setImageCount] = useState(2);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [images, setImages] = useState({});
  const [gap, setGap] = useState(GAP_OPTIONS[0]);
  const [exportSize, setExportSize] = useState(EXPORT_SIZES[0]);
  const [bgColor, setBgColor] = useState("#000000");
  const [borderRadius, setBorderRadius] = useState(0);
  const canvasRef = useRef(null);

  const layouts = getLayouts(imageCount);
  const currentLayout = layouts[layoutIndex] || layouts[0];

  const handleImageCountChange = useCallback((count) => {
    setImageCount(count);
    setLayoutIndex(0);
    setImages({});
  }, []);

  const handleImageUpload = useCallback((blockIndex, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => ({
      ...prev,
      [blockIndex]: { url, file, scale: 1, offsetX: 0, offsetY: 0 },
    }));
  }, []);

  const handleImageTransform = useCallback((blockIndex, transform) => {
    setImages((prev) => {
      if (!prev[blockIndex]) return prev;
      return {
        ...prev,
        [blockIndex]: { ...prev[blockIndex], ...transform },
      };
    });
  }, []);

  const handleRemoveImage = useCallback((blockIndex) => {
    setImages((prev) => {
      const next = { ...prev };
      if (next[blockIndex]) {
        URL.revokeObjectURL(next[blockIndex].url);
        delete next[blockIndex];
      }
      return next;
    });
  }, []);

  const handleSwapImages = useCallback((fromIndex, toIndex) => {
    setImages((prev) => {
      const next = { ...prev };
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      // Clean up undefined entries
      if (!next[fromIndex]) delete next[fromIndex];
      if (!next[toIndex]) delete next[toIndex];
      return next;
    });
  }, []);

  const exportImage = useCallback(async () => {
    const baseSize = exportSize.value;
    const canvasWidth =
      aspectRatio.width >= aspectRatio.height
        ? baseSize
        : Math.round(baseSize * (aspectRatio.width / aspectRatio.height));
    const canvasHeight =
      aspectRatio.height >= aspectRatio.width
        ? baseSize
        : Math.round(baseSize * (aspectRatio.height / aspectRatio.width));

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gapPx = Math.round((gap.value / 600) * baseSize);
    const radiusPx = Math.round((borderRadius / 600) * baseSize);

    // Draw each block
    const blocks = currentLayout.blocks;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const bx = Math.round(block.x * canvasWidth + gapPx / 2);
      const by = Math.round(block.y * canvasHeight + gapPx / 2);
      const bw = Math.round(block.w * canvasWidth - gapPx);
      const bh = Math.round(block.h * canvasHeight - gapPx);

      if (images[i]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = images[i].url;
        });

        ctx.save();
        if (radiusPx > 0) {
          roundRect(ctx, bx, by, bw, bh, radiusPx);
          ctx.clip();
        }
        const imgData = images[i];
        drawCover(ctx, img, bx, by, bw, bh, imgData.scale || 1, imgData.offsetX || 0, imgData.offsetY || 0);
        ctx.restore();
      } else {
        ctx.save();
        if (radiusPx > 0) {
          roundRect(ctx, bx, by, bw, bh, radiusPx);
          ctx.clip();
        }
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(bx, by, bw, bh);
        ctx.restore();
      }
    }

    // Download
    const link = document.createElement("a");
    link.download = `combined-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [aspectRatio, currentLayout, images, gap, exportSize, bgColor, borderRadius]);

  return {
    imageCount,
    setImageCount: handleImageCountChange,
    aspectRatio,
    setAspectRatio,
    layoutIndex,
    setLayoutIndex,
    layouts,
    currentLayout,
    images,
    handleImageUpload,
    handleRemoveImage,
    handleSwapImages,
    handleImageTransform,
    gap,
    setGap,
    exportSize,
    setExportSize,
    bgColor,
    setBgColor,
    borderRadius,
    setBorderRadius,
    exportImage,
    canvasRef,
  };
}

function drawCover(ctx, img, x, y, w, h, scale = 1, offsetX = 0, offsetY = 0) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;

  // Base cover: the source region that exactly covers the box at scale=1
  let baseSw, baseSh;
  if (imgRatio > boxRatio) {
    baseSh = img.naturalHeight;
    baseSw = baseSh * boxRatio;
  } else {
    baseSw = img.naturalWidth;
    baseSh = baseSw / boxRatio;
  }

  // At higher scale, we crop a smaller source region
  const sw = baseSw / scale;
  const sh = baseSh / scale;

  // Center the crop, then apply offset (offset is in fraction of the available pan range)
  const maxPanX = img.naturalWidth - sw;
  const maxPanY = img.naturalHeight - sh;
  const sx = maxPanX / 2 - offsetX * (maxPanX / 2);
  const sy = maxPanY / 2 - offsetY * (maxPanY / 2);

  ctx.drawImage(
    img,
    Math.max(0, Math.min(sx, img.naturalWidth - sw)),
    Math.max(0, Math.min(sy, img.naturalHeight - sh)),
    sw, sh,
    x, y, w, h
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

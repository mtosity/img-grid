import { useImageCombiner } from "./useImageCombiner";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";

export default function App() {
  const combiner = useImageCombiner();

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        imageCount={combiner.imageCount}
        setImageCount={combiner.setImageCount}
        aspectRatio={combiner.aspectRatio}
        setAspectRatio={combiner.setAspectRatio}
        layoutIndex={combiner.layoutIndex}
        setLayoutIndex={combiner.setLayoutIndex}
        layouts={combiner.layouts}
        gap={combiner.gap}
        setGap={combiner.setGap}
        exportSize={combiner.exportSize}
        setExportSize={combiner.setExportSize}
        bgColor={combiner.bgColor}
        setBgColor={combiner.setBgColor}
        borderRadius={combiner.borderRadius}
        setBorderRadius={combiner.setBorderRadius}
        exportImage={combiner.exportImage}
        images={combiner.images}
      />
      <Canvas
        currentLayout={combiner.currentLayout}
        aspectRatio={combiner.aspectRatio}
        images={combiner.images}
        onUpload={combiner.handleImageUpload}
        onRemove={combiner.handleRemoveImage}
        onTransform={combiner.handleImageTransform}
        gap={combiner.gap}
        bgColor={combiner.bgColor}
        borderRadius={combiner.borderRadius}
      />
    </div>
  );
}

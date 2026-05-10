import React, { useState } from "react";
import type { Background } from "../types";

interface BackgroundLayerProps {
  background: Background;
  setBackground: React.Dispatch<React.SetStateAction<Background>>;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BackgroundLayer({
  background,
  setBackground,
}: BackgroundLayerProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!background.draggable || !isDragging) return;

    setBackground((prev) => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  if (!background.image) return null;

  return (
    <img
      src={background.image}
      alt=""
      className="background"
      style={{
        transform: `
          translate(${background.x}px, ${background.y}px)
          scale(${background.scale})
          rotate(${background.rotation}deg)
        `,
        opacity: background.opacity,
      }}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
    />
  );
}

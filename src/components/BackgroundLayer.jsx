import React, { useState } from "react";

export default function BackgroundLayer({ background, setBackground }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!background.draggable || !isDragging) return;

    setBackground((prev) => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  if (!background.image) return null;

  return (
    <>
      <img
        src={background.image}
        alt=""
        className="background"
        style={{
          transform: `translate(${background.x}px, ${background.y}px) scale(${background.scale})`,
          opacity: background.opacity,
        }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      />
    </>
  );
}
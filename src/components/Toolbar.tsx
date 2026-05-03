import React from "react";

import type { Tool } from "../types";

interface ToolbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  undo: () => void;
  redo: () => void;
  clearGrid: () => void;
  resizeGrid: (width: number, height: number) => void;
  copySelection: () => void;
  pasteSelection: (x: number, y: number) => void;
  deleteSelection: () => void;
  rotateSelection: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  setSelectedTool,
  brushSize,
  setBrushSize,
  selectedSymbol,
  setSelectedSymbol,
  undo,
  redo,
  clearGrid,
  resizeGrid,
  copySelection,
  pasteSelection,
  deleteSelection,
  rotateSelection,
}) => {
  const toolButton = (tool: Tool, icon: string) => (
    <button
      onClick={() => setSelectedTool(tool)}
      style={{
        background: selectedTool === tool ? "#ddd" : "transparent",
      }}
    >
      {icon}
    </button>
  );

  return (
    <div className="toolbar">
      {toolButton("pencil", "✏️")}
      {toolButton("picker", "🎯")}
      {toolButton("brush", "🖌")}
      {toolButton("fill", "🪣")}
      {toolButton("select", "▢")}

      <button onClick={undo}>↩</button>
      <button onClick={redo}>↪</button>

      <button onClick={clearGrid}>🧽</button>

      <button onClick={copySelection}>📋</button>
      <button onClick={() => pasteSelection(0, 0)}>📥</button>
      <button onClick={deleteSelection}>❌</button>
      <button onClick={rotateSelection}>🔄</button>

      <label>
        Размер:
        <input
          type="number"
          min={1}
          max={5}
          value={brushSize}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBrushSize(+e.target.value)
          }
        />
      </label>

      <button onClick={() => resizeGrid(20, 10)}>20×10</button>
      <button onClick={() => resizeGrid(40, 20)}>40×20</button>

      {/* Используем setSelectedSymbol */}
      <input
        type="text"
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
        maxLength={1}
        style={{ width: 30, marginLeft: 10 }}
      />

      <div className="symbol-preview">{selectedSymbol}</div>
    </div>
  );
};

export default Toolbar;
import React from "react";

import type { Tool } from "../types";

import BrailleEditorModal from "./BrailleEditorModal";
import { useState } from "react";

interface ToolbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  undo: () => void;
  redo: () => void;
  resizeGrid: (width: number, height: number) => void;
  copySelection: () => void;
  width: number;
  height: number;
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
  resizeGrid,
  copySelection,
  width,
  height,
}) => {
    const [showModal, setShowModal] = useState(false);
    const toolButton = (tool: Tool, icon: string) => (
    <button
      onClick={() => setSelectedTool(tool)}
      className={selectedTool === tool ? "tool active" : "tool"}
    >
      {icon}
    </button>
  );

  return (
    <div className="toolbar">
        <div className="group">
      {toolButton("pencil", "✏️")}
            {toolButton("eraser", "🧽")}
      {toolButton("picker", "🎯")}
      {toolButton("fill", "🪣")}
        </div>

        <div className="group">
      {toolButton("select", "▢")}
        <button onClick={copySelection}>📋</button>
            {toolButton("paste", "📥")}
        </div>

        <div className="group">
            <button onClick={undo}>↩</button>
            <button onClick={redo}>↪</button>
        </div>

        {showModal && (
            <BrailleEditorModal
                initial={selectedSymbol}
                onApply={(value) => {
                    setSelectedSymbol(value);
                    setShowModal(false);
                }}
                onClose={() => setShowModal(false)}
            />
        )}

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
        <button onClick={() => setShowModal(true)}>⚙️</button>
        <div className="grid-size-controls">
            <div className="control">
                <button onClick={() => resizeGrid(width - 1, height)}>-</button>
                <input type="number" value={width} readOnly />
                <button onClick={() => resizeGrid(width + 1, height)}>+</button>
                <span>Cols</span>
            </div>

            <div className="control">
                <button onClick={() => resizeGrid(width, height - 1)}>-</button>
                <input type="number" value={height} readOnly />
                <button onClick={() => resizeGrid(width, height + 1)}>+</button>
                <span>Rows</span>
            </div>
        </div>
    </div>
  );
};

export default Toolbar;


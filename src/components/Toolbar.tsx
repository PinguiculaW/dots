import React from "react";

import BrailleEditorModal from "./BrailleEditorModal";
import {useState} from "react";
import type {Tool, Selection} from "../types";
import Button from '@mui/material/Button';


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
  setSelection: (selection: Selection) => void;
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
                                           setSelection,
                                         }) => {
  const [showModal, setShowModal] = useState(false);
  const toolButton = (tool: Tool, icon: string) => (
    <Button
      variant='outlined'
      onClick={() => {
        setSelectedTool(tool);
        setSelection(null); // 🔥 вот это ключ
      }}
      className={selectedTool === tool ? "tool active" : "tool"}
    >
      {icon}
    </Button>
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
        <input
            type="text"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            maxLength={1}
            style={{width: 20}}
        />
        <button onClick={() => setShowModal(true)}>⚙️</button>
      </div>


      <div className="group">
        {toolButton("select", "▢")}
        <button onClick={copySelection}>📋</button>
        {toolButton("paste", "📥")}
      </div>

      <div className="group">
        <Button sx={{p:0}} variant='outlined'  onClick={undo}>↩</Button>
        <Button sx={{p:0}} variant='outlined'  onClick={redo}>↪</Button>
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
      <div className="group">
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
      </div>

      <div className="group">
        <Button sx={{p:0}} variant='outlined' onClick={() => resizeGrid(20, 10)}>20×10</Button>
        <Button sx={{p:0}} variant='outlined' onClick={() => resizeGrid(40, 20)}>40×20</Button>
      </div>
      {/* Используем setSelectedSymbol */}

      <div className="grid-size-controls">
        <div className="control">
          <label>Столбцы</label>
          <button onClick={() => resizeGrid(width + 1, height)}>+</button>
          <input type="number" value={width} readOnly/>
          <button onClick={() => resizeGrid(width - 1, height)}>-</button>
        </div>

        <div className="control">
          <label>Строки</label>
          <button onClick={() => resizeGrid(width, height + 1)}>+</button>
          <input type="number" value={height} readOnly/>
          <button onClick={() => resizeGrid(width, height - 1)}>-</button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;


import React from "react";

import BrailleEditorModal from "./BrailleEditorModal";
import {useState} from "react";
import type {Tool, Selection} from "../types";
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";


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
  tooltipsEnabled: boolean;
  setTooltipsEnabled: (value: boolean) => void;
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
    tooltipsEnabled,
    setTooltipsEnabled,
    }) => {

    const tt = (text: string) =>
        tooltipsEnabled ? text : "";

    const tooltipProps = {
        arrow: true,
        slotProps: {
            tooltip: {
                sx: {
                    backgroundColor: "#3c7ccf",
                    color: "#fff",
                    fontSize: 13,
                    borderRadius: "8px",
                    border: "1px solid #444",
                },
            },
            arrow: {
                sx: {
                    color: "#2e479e",
                },
            },
        },
    };

  const [showModal, setShowModal] = useState(false);
  const toolButton = (tool: Tool, icon: string, tooltip: string) => (
      <Tooltip
        title={tooltipsEnabled ? tooltip : ""}
        arrow
        slotProps={{
            tooltip: {
                sx: {
                    backgroundColor: "#3c7dd1",
                    color: "#ffffff",
                    fontSize: 13,
                    border: "1px solid #444",
                },
            },
            arrow: {
                sx: {
                    color: "#2e489f",
                },
            },
        }}
      >
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
    </Tooltip>
  );

  return (
    <div className="toolbar">
      <div className="group">
        {toolButton("pencil", "✏️", "Карандаш")}
        {toolButton("eraser", "🧽", "Ластик")}
        {toolButton("picker", "🎯", "Пипетка")}
        {toolButton("fill", "🪣", "Заливка")}
      </div>

      <div className="group">
        <input
            type="text"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            maxLength={1}
            style={{width: 20}}
        />
          <Tooltip title={tt("Настройка символа")} {...tooltipProps} arrow>
        <button onClick={() => setShowModal(true)}>⚙️</button>
          </Tooltip>
      </div>


      <div className="group">
        {toolButton("select", "▢", "Выделение")}
        <Tooltip title={tt("Копировать выделенное")} {...tooltipProps} arrow>
        <button onClick={copySelection}>📋</button>
        </Tooltip>
        {toolButton("paste", "📥", "Вставка")}
      </div>

      <div className="group">
          <Tooltip title={tt("Отменить")} {...tooltipProps} arrow>
        <Button sx={{p:0}} variant='outlined'  onClick={undo}>↩</Button>
          </Tooltip>
          <Tooltip title={tt("Повторить")} {...tooltipProps} arrow>
        <Button sx={{p:0}} variant='outlined'  onClick={redo}>↪</Button>
          </Tooltip>
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

      <div className="group">
        <label
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                userSelect: "none",
                cursor: "pointer",
            }}
        >
            <input
                type="checkbox"
                checked={tooltipsEnabled}
                onChange={(e) =>
                    setTooltipsEnabled(e.target.checked)
                }
            />
                Подсказки
        </label>
      </div>
    </div>
  );
};

export default Toolbar;


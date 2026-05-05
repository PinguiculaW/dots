import React, { useState } from "react";
import { BRAILLE_BLANK } from "../utils/braille";

type Cell = string;
type Grid = Cell[][];

type Tool = "pencil" | "picker" | "fill" | "select" | "eraser";

interface Selection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Point {
  x: number;
  y: number;
}

interface GridEditorProps {
  grid: Grid;
  pushHistory: (grid: Grid) => void;
  selectedTool: Tool;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  brushSize: number;
  floodFill: (x: number, y: number) => void;
  selection: Selection | null;
  setSelection: (selection: Selection | null) => void;
}

const GridEditor: React.FC<GridEditorProps> = ({
  grid,
  pushHistory,
  selectedTool,
  selectedSymbol,
  setSelectedSymbol,
  brushSize,
  floodFill,
  selection,
  setSelection,
}) => {
  console.log(
      "SYMBOL:",
      selectedSymbol === BRAILLE_BLANK ? "EMPTY" : selectedSymbol
  );
  const [hoverCell, setHoverCell] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<Point | null>(null);

  const toggleCell = (value: Cell): Cell => {
    return value === selectedSymbol ? BRAILLE_BLANK : selectedSymbol;
  };

  const handleAction = (x: number, y: number) => {

    if (selectedTool === "eraser") {
      const newGrid = grid.map((row) => [...row]);
      newGrid[y][x] = BRAILLE_BLANK;
      pushHistory(newGrid);
    }
    // ✏️ Pencil
    if (selectedTool === "pencil") {
      const newGrid = grid.map((row) => [...row]);
      newGrid[y][x] = toggleCell(newGrid[y][x]);
      pushHistory(newGrid);
    }

    // 🎯 Picker
    if (selectedTool === "picker") {
      setSelectedSymbol(grid[y][x]);
    }

    // 🪣 Fill
    if (selectedTool === "fill") {
      floodFill(x, y);
    }

    // ▢ Selection
    if (selectedTool === "select") {
      if (!selectionStart) {
        setSelectionStart({ x, y });
      } else {
        setSelection({
          x1: Math.min(selectionStart.x, x),
          y1: Math.min(selectionStart.y, y),
          x2: Math.max(selectionStart.x, x),
          y2: Math.max(selectionStart.y, y),
        });
        setSelectionStart(null);
      }
    }
  };

  return (
    <div
      className="grid"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {grid.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => {
            const isHover =
              hoverCell &&
              Math.abs(hoverCell.x - x) < brushSize &&
              Math.abs(hoverCell.y - y) < brushSize;

            const isSelected =
              selection &&
              x >= selection.x1 &&
              x <= selection.x2 &&
              y >= selection.y1 &&
              y <= selection.y2;

            return (
              <div
                key={x}
                className={`cell 
                  ${isHover ? "hover" : ""} 
                  ${isSelected ? "selected" : ""}
                `}
                onMouseDown={() => {
                  setIsDrawing(true);
                  handleAction(x, y);
                }}
                onMouseEnter={() => {
                  setHoverCell({ x, y });
                  if (isDrawing) handleAction(x, y);
                }}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GridEditor;
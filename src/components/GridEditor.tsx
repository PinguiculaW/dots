import { BRAILLE_BLANK } from "../utils/braille";
import React, { useState, useRef, useLayoutEffect } from "react";
import type { Tool, Selection } from "../types";

type Cell = string;
type Grid = Cell[][];


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
  pasteSelection: (x: number, y: number) => void;
  setSelectedTool: (tool: Tool) => void;
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
  pasteSelection,
  setSelectedTool,
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [boxStyle, setBoxStyle] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!selection || !gridRef.current) {
      setBoxStyle(null);
      return;
    }

    const start = gridRef.current.querySelector(
        `[data-x="${selection.x1}"][data-y="${selection.y1}"]`
    ) as HTMLElement | null;

    const end = gridRef.current.querySelector(
        `[data-x="${selection.x2}"][data-y="${selection.y2}"]`
    ) as HTMLElement | null;

    if (!start || !end) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    const BORDER = 1;
    const CELL_BORDER = 1;

    setBoxStyle({
      left: startRect.left - gridRect.left - BORDER - CELL_BORDER + "px",
      top: startRect.top - gridRect.top - BORDER - CELL_BORDER + "px",
      width: endRect.right - startRect.left + (BORDER + CELL_BORDER) * 2 + "px",
      height: endRect.bottom - startRect.top + (BORDER + CELL_BORDER) * 2 + "px",
    });
  }, [selection, grid]);

  console.log("SELECTION:", selection);
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

    if (selectedTool === "paste") {
      pasteSelection(x, y);
      setSelectedTool("pencil"); // или "select", если хочешь
    }

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
          ref={gridRef}
          className="grid"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {boxStyle && (
          <div
              className="selection-box"
              style={boxStyle}
          />
      )}

      {grid.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => {
            const isHover =
              hoverCell &&
              Math.abs(hoverCell.x - x) < brushSize &&
              Math.abs(hoverCell.y - y) < brushSize;

            return (
              <div
                key={x}
                data-x={x}
                data-y={y}
                className={`cell 
                  ${isHover ? "hover" : ""}
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
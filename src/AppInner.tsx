import React, { useState } from "react";
import GridEditor from "./components/GridEditor";
import Toolbar from "./components/Toolbar";
import OutputPanel from "./components/OutputPanel";
import BackgroundLayer from "./components/BackgroundLayer";
import { BRAILLE_BLANK } from "./utils/braille";
import "./styles.css";

import type { Tool, Background } from "./types";

// ====== TYPES ======
type Grid = string[][];

type FillMode = "color" | "empty";

type Selection = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} | null;

type ClipboardData = string[][] | null;

// ====== HELPERS ======
const createGrid = (w: number, h: number): Grid =>
  Array.from({ length: h }, () =>
    Array.from({ length: w }, () => BRAILLE_BLANK)
  );

export default function AppInner(): React.ReactElement {
  const [width, setWidth] = useState<number>(40);
  const [height, setHeight] = useState<number>(20);

  const [grid, setGrid] = useState<Grid>(createGrid(width, height));
  const [history, setHistory] = useState<Grid[]>([]);
  const [redoStack, setRedoStack] = useState<Grid[]>([]);

  const [selectedTool, setSelectedTool] = useState<Tool>("brush");
  const [selectedSymbol, setSelectedSymbol] =
    useState<string>(BRAILLE_BLANK);
  const [brushSize, setBrushSize] = useState<number>(1);
  const [fillMode] = useState<FillMode>("color");

  const [background, setBackground] = useState<Background>({
    image: null,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0.5,
    draggable: false,
  });

  const handleBackgroundUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBackground({
        image: reader.result as string,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.5,
        draggable: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const [selection, setSelection] = useState<Selection>(null);
  const [clipboard, setClipboard] = useState<ClipboardData>(null);

  const pushHistory = (newGrid: Grid): void => {
    setHistory((prev) => [...prev.slice(-50), grid]);
    setRedoStack([]);
    setGrid(newGrid);
  };

  const undo = (): void => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [grid, ...r]);
    setHistory((h) => h.slice(0, -1));
    setGrid(prev);
  };

  const redo = (): void => {
    if (!redoStack.length) return;
    const next = redoStack[0];
    setHistory((h) => [...h, grid]);
    setRedoStack((r) => r.slice(1));
    setGrid(next);
  };

  const clearGrid = (): void => {
    pushHistory(createGrid(width, height));
  };

  const resizeGrid = (newW: number, newH: number): void => {
    if (newW < width || newH < height) {
      alert("Уменьшение поля обрезает символы");
    }

    const newGrid: Grid = Array.from({ length: newH }, (_, y) =>
      Array.from({ length: newW }, (_, x) =>
        grid[y] && grid[y][x] ? grid[y][x] : BRAILLE_BLANK
      )
    );

    setWidth(newW);
    setHeight(newH);
    pushHistory(newGrid);
  };

  const floodFill = (x: number, y: number, mode: FillMode = "color"): void => {
    const target = grid[y]?.[x];
    if (target === undefined) return;

    const newGrid = grid.map((r) => [...r]);
    const stack: [number, number][] = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop() as [number, number];

      if (!newGrid[cy] || newGrid[cy][cx] === undefined) continue;

      if (mode === "empty" && newGrid[cy][cx] !== BRAILLE_BLANK) continue;
      if (mode === "color" && newGrid[cy][cx] !== target) continue;

      newGrid[cy][cx] = selectedSymbol;

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    pushHistory(newGrid);
  };

  const copySelection = (): void => {
    if (!selection) return;

    const data: string[][] = [];

    for (let y = selection.y1; y <= selection.y2; y++) {
      const row: string[] = [];
      for (let x = selection.x1; x <= selection.x2; x++) {
        row.push(grid[y][x]);
      }
      data.push(row);
    }

    setClipboard(data);
  };

  const pasteSelection = (x: number, y: number): void => {
    if (!clipboard) return;

    const newGrid = grid.map((row) => [...row]);

    for (let dy = 0; dy < clipboard.length; dy++) {
      for (let dx = 0; dx < clipboard[0].length; dx++) {
        if (newGrid[y + dy]?.[x + dx] !== undefined) {
          newGrid[y + dy][x + dx] = clipboard[dy][dx];
        }
      }
    }

    pushHistory(newGrid);
  };

  const deleteSelection = (): void => {
    if (!selection) return;

    const newGrid = grid.map((row) => [...row]);

    for (let y = selection.y1; y <= selection.y2; y++) {
      for (let x = selection.x1; x <= selection.x2; x++) {
        newGrid[y][x] = BRAILLE_BLANK;
      }
    }

    pushHistory(newGrid);
  };

  const rotateSelection = (): void => {
    if (!selection) return;

    const selectionWidth = selection.x2 - selection.x1 + 1;
    const selectionHeight = selection.y2 - selection.y1 + 1;

    const temp: string[][] = [];

    for (let y = 0; y < selectionHeight; y++) {
      temp[y] = [];
      for (let x = 0; x < selectionWidth; x++) {
        temp[y][x] = grid[selection.y1 + y][selection.x1 + x];
      }
    }

    const rotated: string[][] = Array.from(
      { length: selectionWidth },
      () => Array(selectionHeight).fill(BRAILLE_BLANK)
    );

    for (let y = 0; y < selectionHeight; y++) {
      for (let x = 0; x < selectionWidth; x++) {
        rotated[x][selectionHeight - y - 1] = temp[y][x];
      }
    }

    const newGrid = grid.map((row) => [...row]);

    for (let y = 0; y < rotated.length; y++) {
      for (let x = 0; x < rotated[0].length; x++) {
        if (newGrid[selection.y1 + y]?.[selection.x1 + x] !== undefined) {
          newGrid[selection.y1 + y][selection.x1 + x] = rotated[y][x];
        }
      }
    }

    pushHistory(newGrid);
  };

  return (
    <div className="app">
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={(tool: Tool) => setSelectedTool(tool)}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        undo={undo}
        redo={redo}
        clearGrid={clearGrid}
        resizeGrid={resizeGrid}
        copySelection={copySelection}
        pasteSelection={pasteSelection}
        deleteSelection={deleteSelection}
        rotateSelection={rotateSelection}
      />

      <BackgroundLayer
        background={background}
        setBackground={setBackground}
        handleBackgroundUpload={handleBackgroundUpload}
      />

      <GridEditor
        grid={grid}
        pushHistory={pushHistory}
        selectedTool={selectedTool}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        brushSize={brushSize}
        floodFill={(x: number, y: number) =>
          floodFill(x, y, fillMode)
        }
        selection={selection}
        setSelection={setSelection}
      />

      <OutputPanel grid={grid} />
    </div>
  );
}


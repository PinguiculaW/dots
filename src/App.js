import React, { useState } from "react";
import GridEditor from "./components/GridEditor";
import Toolbar from "./components/Toolbar";
import OutputPanel from "./components/OutputPanel";
import BackgroundLayer from "./components/BackgroundLayer";
import { BRAILLE_BLANK } from "./utils/braille";
import "./styles.css";

const createGrid = (w, h) =>
  Array.from({ length: h }, () =>
    Array.from({ length: w }, () => BRAILLE_BLANK)
  );

export default function App() {
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(20);

  const [grid, setGrid] = useState(createGrid(width, height));
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedSymbol, setSelectedSymbol] = useState(BRAILLE_BLANK);
  const [brushSize, setBrushSize] = useState(1);
  const [fillMode, setFillMode] = useState("color");

  const [background, setBackground] = useState({
  image: null,
  x: 0,
  y: 0,
  scale: 1,
  opacity: 0.5,
  draggable: false,
});

const handleBackgroundUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setBackground({
      image: reader.result,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0.5,
      draggable: true,
    });
  };
  reader.readAsDataURL(file);
};

  const [selection, setSelection] = useState(null);
  const [clipboard, setClipboard] = useState(null);

  const pushHistory = (newGrid) => {
    setHistory((prev) => [...prev.slice(-50), grid]);
    setRedoStack([]);
    setGrid(newGrid);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [grid, ...r]);
    setHistory((h) => h.slice(0, -1));
    setGrid(prev);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const next = redoStack[0];
    setHistory((h) => [...h, grid]);
    setRedoStack((r) => r.slice(1));
    setGrid(next);
  };

  const clearGrid = () => {
    pushHistory(createGrid(width, height));
  };

  const resizeGrid = (newW, newH) => {
    if (newW < width || newH < height) {
      alert("Уменьшение поля обрезает символы");
    }

    const newGrid = Array.from({ length: newH }, (_, y) =>
      Array.from({ length: newW }, (_, x) =>
        grid[y] && grid[y][x] ? grid[y][x] : BRAILLE_BLANK
      )
    );

    setWidth(newW);
    setHeight(newH);
    pushHistory(newGrid);
  };

  const floodFill = (x, y, mode = "color") => {
    const target = grid[y][x];
    if (target === undefined) return;

    const newGrid = grid.map((r) => [...r]);
    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop();

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

  const copySelection = () => {
    if (!selection) return;

    const data = [];
    for (let y = selection.y1; y <= selection.y2; y++) {
      const row = [];
      for (let x = selection.x1; x <= selection.x2; x++) {
        row.push(grid[y][x]);
      }
      data.push(row);
    }

    setClipboard(data);
  };

  const pasteSelection = (x, y) => {
    if (!clipboard) return;

    const newGrid = grid.map((row) => [...row]);

    for (let dy = 0; dy < clipboard.length; dy++) {
      for (let dx = 0; dx < clipboard[0].length; dx++) {
        if (newGrid[y + dy] && newGrid[y + dy][x + dx] !== undefined) {
          newGrid[y + dy][x + dx] = clipboard[dy][dx];
        }
      }
    }

    pushHistory(newGrid);
  };

  const deleteSelection = () => {
    if (!selection) return;

    const newGrid = grid.map((row) => [...row]);

    for (let y = selection.y1; y <= selection.y2; y++) {
      for (let x = selection.x1; x <= selection.x2; x++) {
        newGrid[y][x] = BRAILLE_BLANK;
      }
    }

    pushHistory(newGrid);
  };

  const rotateSelection = () => {
    if (!selection) return;

    const selectionWidth = selection.x2 - selection.x1 + 1;
    const selectionHeight = selection.y2 - selection.y1 + 1;

    const temp = [];

    for (let y = 0; y < selectionHeight; y++) {
      temp[y] = [];
      for (let x = 0; x < selectionWidth; x++) {
        temp[y][x] = grid[selection.y1 + y][selection.x1 + x];
      }
    }

    const rotated = Array.from({ length: selectionWidth }, () =>
      Array(selectionHeight).fill(BRAILLE_BLANK)
    );

    for (let y = 0; y < selectionHeight; y++) {
      for (let x = 0; x < selectionWidth; x++) {
        rotated[x][selectionHeight - y - 1] = temp[y][x];
      }
    }

    const newGrid = grid.map((row) => [...row]);

    for (let y = 0; y < rotated.length; y++) {
      for (let x = 0; x < rotated[0].length; x++) {
        if (
          newGrid[selection.y1 + y] &&
          newGrid[selection.y1 + y][selection.x1 + x] !== undefined
        ) {
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
        setSelectedTool={setSelectedTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        undo={undo}
        redo={redo}
        clearGrid={clearGrid}
        resizeGrid={resizeGrid}
      />

      <BackgroundLayer background={background} setBackground={setBackground} />

      <GridEditor
        grid={grid}
        pushHistory={pushHistory}
        selectedTool={selectedTool}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        brushSize={brushSize}
        floodFill={(x, y) => floodFill(x, y, fillMode)}
        selection={selection}
        setSelection={setSelection}
      />

      <OutputPanel grid={grid} />
    </div>
  );
}
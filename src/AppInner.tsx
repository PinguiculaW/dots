import React, { useState } from "react";
import GridEditor from "./components/GridEditor";
import Toolbar from "./components/Toolbar";
import OutputPanel from "./components/OutputPanel";
import BackgroundLayer from "./components/BackgroundLayer";
import { BRAILLE_BLANK } from "./utils/braille";
import "./styles.css";
import "./responsive.css";
import type { Tool, Background, Selection } from "./types";
import { trimGrid } from "./utils/trimGrid";


// ====== TYPES ======
type Grid = string[][];

type FillMode = "color" | "empty";

type ClipboardData = string[][] | null;

// ====== HELPERS ======
const createGrid = (w: number, h: number): Grid =>
  Array.from({ length: h }, () =>
    Array.from({ length: w }, () => BRAILLE_BLANK)
  );

type Props = {
  onOpenFeedback: () => void;
};

export default function AppInner({
                                   onOpenFeedback,
                                 }: Props): React.ReactElement {
  const isMobile = window.innerWidth <= 768;

  const [width, setWidth] = useState<number>(
      isMobile ? 20 : 40
  );

  const [height, setHeight] = useState<number>(
      isMobile ? 10 : 20
  );

  const [grid, setGrid] = useState<Grid>(createGrid(width, height));
  const [history, setHistory] = useState<Grid[]>([]);
  const [redoStack, setRedoStack] = useState<Grid[]>([]);

  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);

  const [trimTop, setTrimTop] = useState<boolean>(true);
  const [trimBottom, setTrimBottom] = useState<boolean>(true);
  const [trimRight, setTrimRight] = useState<boolean>(true);
  const [trimLeft, setTrimLeft] = useState<boolean>(true);

  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [selectedSymbol, setSelectedSymbol] =
    useState<string>(BRAILLE_BLANK);
  const [brushSize, setBrushSize] = useState<number>(1);
  const [fillMode] = useState<FillMode>("color");

  const [background, setBackground] = useState<Background>({
    image: null,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
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
      const img = new Image();
      img.onload = () => {
        const canvas = document.querySelector(".grid-wrapper") as HTMLElement;
        const canvasW = canvas?.offsetWidth ?? 600;
        const canvasH = canvas?.offsetHeight ?? 400;

        const scale = Math.min(canvasW / img.naturalWidth, canvasH / img.naturalHeight);

        // При transform-origin: top left — translate идёт до scale,
        // поэтому центрируем просто как обычный div
        const x = (canvasW - img.naturalWidth * scale) / 2;
        const y = (canvasH - img.naturalHeight * scale) / 2;

        setBackground({
          image: reader.result as string,
          x,
          y,
          scale,
          rotation: 0,
          opacity: 0.5,
          draggable: true,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [selection, setSelection] = useState<Selection>(null);
  const [clipboard, setClipboard] = useState<ClipboardData>(null);

  const processedGrid = trimGrid(grid, {
    trimTop,
    trimBottom,
    trimRight,
    trimLeft,
  });

  const textForCount = processedGrid
      .map(row => row.join(""))
      .join("\n");

  const charCount = textForCount.length;

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

  /*const clearGrid = (): void => {
    pushHistory(createGrid(width, height));
  };*/

  const resizeGrid = (newW: number, newH: number): void => {
    // защита от некорректных значений
    if (newW < 1 || newH < 1) return;

    // 🔍 проверяем, будут ли обрезаны НЕпустые клетки
    const willCrop = (() => {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const isOutside = x >= newW || y >= newH;

          if (isOutside && grid[y][x] !== BRAILLE_BLANK) {
            return true;
          }
        }
      }
      return false;
    })();

    // ⚠️ предупреждаем только если реально есть что терять
    if (willCrop) {
      const confirmed = window.confirm(
          "Уменьшение поля обрежет символы. Продолжить?"
      );
      if (!confirmed) return;
    }

    // 🧱 создаём новую сетку
    const newGrid: Grid = Array.from({ length: newH }, (_, y) =>
        Array.from({ length: newW }, (_, x) =>
            grid[y] && grid[y][x] ? grid[y][x] : BRAILLE_BLANK
        )
    );

    // обновляем состояние
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

  const cutSelection = (): void => {
    if (!selection) return;

    const data: string[][] = [];
    const newGrid = grid.map((row) => [...row]);

    for (let y = selection.y1; y <= selection.y2; y++) {
      const row: string[] = [];

      for (let x = selection.x1; x <= selection.x2; x++) {
        row.push(grid[y][x]);

        // удаляем символ после копирования
        newGrid[y][x] = BRAILLE_BLANK;
      }

      data.push(row);
    }

    setClipboard(data);
    pushHistory(newGrid);
    setSelection(null);
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
        resizeGrid={resizeGrid}
        copySelection={copySelection}
        width={width}
        height={height}
        setSelection={setSelection}
        tooltipsEnabled={tooltipsEnabled}
        setTooltipsEnabled={setTooltipsEnabled}
        cutSelection={cutSelection}
      />

      <div className="workspace">
        <div className="canvas-area">
          <div className="grid-wrapper">
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
              pasteSelection={pasteSelection}
              setSelectedTool={setSelectedTool}
          />
        </div>
        </div>

        <div className="bg-controls">
          <h3>Параметры фоновой картинки</h3>

          <input type="file" onChange={handleBackgroundUpload}
                 style={{marginBottom: 20}}/>

          <div className="control">
            <label>Прозрачность</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={background.opacity}
                onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      opacity: Number(e.target.value),
                    }))
                }
            />
          </div>

          <div className="control">
            <label>Размер</label>
            <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={background.scale}
                onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      scale: Number(e.target.value),
                    }))
                }
            />
          </div>

          <div className="control">
            <label>Вращение</label>
            <input
                type="range"
                min={-180}
                max={180}
                step="1"
                value={background.rotation}
                onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      rotation: Number(e.target.value),
                    }))
                }
            />
          </div>

          <div className="control">
            <label>Движение по горизонтали</label>
            <input
                type="range"
                min={-2000}
                max={2000}
                step="1"
                value={background.x}
                onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      x: Number(e.target.value),
                    }))
                }
            />
          </div>

          <div className="control">
            <label>Движение по вертикали</label>
            <input
                type="range"
                min={-2000}
                max={2000}
                step="1"
                value={background.y}
                onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      y: Number(e.target.value),
                    }))
                }
            />
          </div>

          <div className="stats-box">
            <div className="stats-title">Статистика</div>

            <div className="stat-row">
              <span>Символов:</span>
              <strong>{charCount}</strong>
            </div>
          </div>

          <div className="settings-box">
            <div className="settings-title">Настройки</div>

            <label className="setting-row">
              <input
                  type="checkbox"
                  checked={tooltipsEnabled}
                  onChange={(e) =>
                      setTooltipsEnabled(e.target.checked)
                  }
              />
              Подсказки
            </label>

            <div className="settings-subtitle">
              Обрезка пустых символов
            </div>

            <label className="setting-row">
              <input
                  type="checkbox"
                  checked={trimTop}
                  onChange={(e) =>
                      setTrimTop(e.target.checked)
                  }
              />
              Обрезать пустые строки сверху
            </label>

            <label className="setting-row">
              <input
                  type="checkbox"
                  checked={trimBottom}
                  onChange={(e) =>
                      setTrimBottom(e.target.checked)
                  }
              />
              Обрезать пустые строки снизу
            </label>

            <label className="setting-row">
              <input
                  type="checkbox"
                  checked={trimRight}
                  onChange={(e) =>
                      setTrimRight(e.target.checked)
                  }
              />
              Обрезать пустые символы справа
            </label>

            <label className="setting-row">
              <input
                  type="checkbox"
                  checked={trimLeft}
                  onChange={(e) =>
                      setTrimLeft(e.target.checked)
                  }
              />
              Обрезать пустые символы слева
            </label>

          </div>

        </div>
      </div>

      <OutputPanel
          grid={grid}
          trimTop={trimTop}
          trimBottom={trimBottom}
          trimRight={trimRight}
          trimLeft={trimLeft}
      />

      <div style={{ marginBottom: 20, marginLeft: 20, textAlign: "left" }}>
        <button
            onClick={onOpenFeedback}
            className="feedback-button"
        >
          Обратная связь
        </button>
      </div>

    </div>
  );
}


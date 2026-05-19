import React from "react";

import BrailleEditorModal from "./BrailleEditorModal";
import {useState} from "react";
import type {Tool, Selection} from "../types";
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import pencilIcon from "../assets/tools/pencil.svg";
import eraserIcon from "../assets/tools/eraser.svg";
import copyIcon from "../assets/tools/copy.svg";
import cutIcon from "../assets/tools/cut.svg";
import fillIcon from "../assets/tools/fill.svg";
import infoIcon from "../assets/tools/info.svg";
import pasteIcon from "../assets/tools/paste.svg";
import pipetteIcon from "../assets/tools/pipette.svg";
import settingsIcon from "../assets/tools/setting.svg";
import undoIcon from "../assets/tools/undo.svg";
import redoIcon from "../assets/tools/redo.svg";
import selectIcon from "../assets/tools/select.svg";

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
    cutSelection: () => void;
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
        cutSelection,
    width,
    height,
    setSelection,
    tooltipsEnabled,
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
  const [showHelp, setShowHelp] = useState(false);

    const toolDescriptions = [
        {
            icon: "✏️",
            title: "Карандаш",
            description:
                "Рисование выбранным символом по сетке.",
        },

        {
            icon: "🧽",
            title: "Ластик",
            description:
                "Удаление символов с сетки.",
        },

        {
            icon: "🎯",
            title: "Пипетка",
            description:
                "Выбор символа с холста.",
        },

        {
            icon: "🪣",
            title: "Заливка",
            description:
                "Заливка области одинаковых символов.",
        },

        {
            icon: "️️⚙️",
            title: "Настройка символа",
            description:
                "Открывает меню отрисовки символа.",
        },

        {
            icon: "▢",
            title: "Выделение",
            description:
                "Выделение области для копирования.",
        },

        {
            icon: "📋",
            title: "Копировать",
            description:
                "Копирует выделенную область.",
        },

        {
            icon: "✂️",
            title: "Вырезать",
            description:
                "Вырезает выделенную область.",
        },

        {
            icon: "📥",
            title: "Вставка",
            description:
                "Вставка скопированного блока.",
        },

        {
            icon: "ℹ️",
            title: "Краткая инструкция",
            description:
                "• Выберите инструмент\n" +
                "• Рисуйте нажатием или перетаскиванием\n" +
                "• Для копирования сначала выделите область\n" +
                "• Для вставки нажмите на 📥 и выберите место для вставки (верхний левый угол)",
        },

    ];

    const toolButton = (
        tool: Tool,
        icon: string,
        tooltip: string
    ) => (
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
          <img
              src={icon}
              alt={tooltip}
              className="tool-icon"
          />
    </Button>
    </Tooltip>
  );

  return (
    <div className="toolbar">
      <div className="group">
          {toolButton("pencil", pencilIcon, "Карандаш")}
          {toolButton("eraser", eraserIcon, "Ластик")}
          {toolButton("picker", pipetteIcon, "Пипетка")}
          {toolButton("fill", fillIcon, "Заливка")}
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
              <button onClick={() => setShowModal(true)}>
                  <img
                      src={settingsIcon}
                      alt="Настройки"
                      className="tool-icon"
                  />
              </button>
          </Tooltip>
      </div>


      <div className="group">
          {toolButton("select", selectIcon, "Выделение")}
        <Tooltip title={tt("Копировать выделенное")} {...tooltipProps} arrow>
            <button onClick={copySelection}>
                <img
                    src={copyIcon}
                    alt="Копировать"
                    className="tool-icon"
                />
            </button>
        </Tooltip>
          <Tooltip title={tt("Вырезать выделенное")} {...tooltipProps} arrow>
              <button onClick={cutSelection}>
                  <img
                      src={cutIcon}
                      alt="Вырезать"
                      className="tool-icon"
                  />
              </button>
          </Tooltip>
          {toolButton("paste", pasteIcon, "Вставка")}
      </div>

        <Tooltip title={tt("Информация")} {...tooltipProps} arrow>
        <Button
            variant="outlined"
            onClick={() => setShowHelp(true)}
            sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                padding: 0,

                borderWidth: 3,

                "&:hover": {
                    borderWidth: 3,
                },
            }}
        >
            <img
                src={infoIcon}
                alt="Информация"
                className="tool-icon"
            />
        </Button>
        </Tooltip>

        {showHelp && (
            <div className="modal">
                <div
                    className="modal-content"
                    style={{
                        maxWidth: 500,
                    }}
                >
                    <h2 style={{ marginTop: 0 }}>
                        Инструменты редактора
                    </h2>

                    {toolDescriptions.map((tool) => (
                        <div
                            key={tool.title}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            <strong>
                                {tool.icon} — {tool.title}
                            </strong>

                            <div
                                style={{
                                    marginTop: 4,
                                    opacity: 0.8,
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {tool.description}
                            </div>
                        </div>
                    ))}

                    <button onClick={() => setShowHelp(false)}>
                        Закрыть
                    </button>
                </div>
            </div>
        )}

      <div className="group">
          <Tooltip title={tt("Отменить")} {...tooltipProps} arrow>
              <Button sx={{p:0}} variant="outlined" onClick={undo}>
                  <img
                      src={undoIcon}
                      alt="Отменить"
                      className="tool-icon"
                  />
              </Button>
          </Tooltip>
          <Tooltip title={tt("Повторить")} {...tooltipProps} arrow>
              <Button sx={{p:0}} variant="outlined" onClick={redo}>
                  <img
                      src={redoIcon}
                      alt="Повторить"
                      className="tool-icon"
                  />
              </Button>
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



    </div>
  );
};

export default Toolbar;


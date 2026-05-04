import React, { useState } from "react";

type OutputPanelProps = {
    grid: string[][];
};

const OutputPanel: React.FC<OutputPanelProps> = ({ grid }) => {
    const [copied, setCopied] = useState<boolean>(false);
    console.log(grid)
    //const EMPTY = "⠀"; // U+2800
    // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: НЕ удаляем ничего!
    const text: string = grid
        .map(row => row.join("")) // Просто соединяем без изменений
        .join("\n");

    const copy = async (): Promise<void> => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div className="output">
            <textarea
                value={text}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                spellCheck={false} // Отключаем проверку орфографии
            />
            <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={copy}
            >
                {copied ? "Скопировано!" : "Скопировать"}
            </button>
        </div>
    );
};

export default OutputPanel;
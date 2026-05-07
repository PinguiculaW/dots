import React, { useState } from "react";

type OutputPanelProps = {
    grid: string[][];
};

const OutputPanel: React.FC<OutputPanelProps> = ({ grid }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const text: string = grid
        .map(row => row.join(""))
        .join("\n");

    // если нужно без переносов строк:
    // const charCount = text.replace(/\n/g, "").length;

    const BRAILLE_BLANK = "⠀";

    const trimmedRows = grid
        // убираем пустые строки снизу
        .slice(0)
        .reverse()
        .reduce<string[][]>((acc, row) => {
            if (
                acc.length > 0 ||
                row.some(cell => cell !== BRAILLE_BLANK)
            ) {
                acc.push(row);
            }
            return acc;
        }, [])
        .reverse();

    const charCount = trimmedRows.reduce((total, row) => {
        // ищем последний НЕпустой символ в строке
        let lastNonEmpty = -1;

        for (let i = row.length - 1; i >= 0; i--) {
            if (row[i] !== BRAILLE_BLANK) {
                lastNonEmpty = i;
                break;
            }
        }

        // если строка полностью пустая
        if (lastNonEmpty === -1) return total;

        // считаем символы до последнего значимого
        return total + lastNonEmpty + 1;
    }, 0);

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
                spellCheck={false}
            />

            <div className="char-counter">
                Символов: {charCount}
            </div>

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
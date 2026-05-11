import React, { useState } from "react";

type OutputPanelProps = {
    grid: string[][];
    trimBottom: boolean;
    trimRight: boolean;
    trimLeft: boolean;
};

const OutputPanel: React.FC<OutputPanelProps> = ({
    grid,
    trimBottom,
    trimRight,
    trimLeft,
    }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const BRAILLE_BLANK = "⠀";

    let processedGrid = grid.map(row => [...row]);

// =====================
// trim bottom
// =====================
    if (trimBottom) {
        while (
            processedGrid.length > 0 &&
            processedGrid[processedGrid.length - 1].every(
                cell => cell === BRAILLE_BLANK
            )
            ) {
            processedGrid.pop();
        }
    }

// =====================
// trim right
// =====================
    if (trimRight) {
        let maxRight = -1;

        processedGrid.forEach(row => {
            for (let i = row.length - 1; i >= 0; i--) {
                if (row[i] !== BRAILLE_BLANK) {
                    maxRight = Math.max(maxRight, i);
                    break;
                }
            }
        });

        if (maxRight >= 0) {
            processedGrid = processedGrid.map(row =>
                row.slice(0, maxRight + 1)
            );
        }
    }

// =====================
// trim left
// =====================
    if (trimLeft) {
        let minLeft: number | null = null;

        processedGrid.forEach(row => {
            const first = row.findIndex(
                cell => cell !== BRAILLE_BLANK
            );

            if (first !== -1) {
                if (minLeft === null) {
                    minLeft = first;
                } else {
                    minLeft = Math.min(minLeft, first);
                }
            }
        });

        if (minLeft !== null && minLeft > 0) {
            processedGrid = processedGrid.map(row =>
                row.slice(minLeft!)
            );
        }
    }

    const text: string = processedGrid
        .map(row => row.join(""))
        .join("\n");

    const copy = async (): Promise<void> => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div className="output">

            <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={copy}
            >
                {copied ? "Скопировано!" : "Скопировать"}
            </button>

            <textarea
                value={text}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                spellCheck={false}
            />
        </div>
    );
};

export default OutputPanel;
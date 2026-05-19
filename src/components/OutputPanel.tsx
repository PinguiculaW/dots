import React, { useState } from "react";
import { trimGrid } from "../utils/trimGrid";

type OutputPanelProps = {
    grid: string[][];
    trimTop: boolean;
    trimBottom: boolean;
    trimRight: boolean;
    trimLeft: boolean;
};

const OutputPanel: React.FC<OutputPanelProps> = ({
    grid,
    trimTop,
    trimBottom,
    trimRight,
    trimLeft,
    }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const processedGrid = trimGrid(grid, {
        trimTop,
        trimBottom,
        trimRight,
        trimLeft,
    });

    const text: string = processedGrid
        .map(row => row.join(""))
        .join("\n");

    const copy = async (): Promise<void> => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = text;

                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";

                document.body.appendChild(textarea);

                textarea.focus();
                textarea.select();

                document.execCommand("copy");

                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (error) {
            console.error("Ошибка копирования:", error);
        }
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
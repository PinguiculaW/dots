import React, { useState } from "react";
import { trimGrid } from "../utils/trimGrid";

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

    const processedGrid = trimGrid(grid, {
        trimBottom,
        trimRight,
        trimLeft,
    });

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
import React, { useState } from "react";

type OutputPanelProps = {
    grid: string[][];
};

const OutputPanel: React.FC<OutputPanelProps> = ({ grid }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const text: string = grid
        .map(row => row.join(""))
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
                spellCheck={false}
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
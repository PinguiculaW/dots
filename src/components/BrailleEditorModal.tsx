import { useState } from "react";
import { dotsToBraille, brailleToDots } from "../utils/braille";
import type { BrailleDots } from "../utils/braille";

type Props = {
  onClose: () => void;
  onApply: (value: string) => void;
  initial: string;
};

export default function BrailleEditorModal({
  onClose,
  onApply,
  initial,
}: Props) {
  const [dots, setDots] = useState<BrailleDots>(
    brailleToDots(initial) as BrailleDots
  );

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);

  const setDotValue = (i: number, value: boolean) => {
    const newDots = [...dots] as BrailleDots;
    newDots[i] = value;
    setDots(newDots);
  };

  const renderDot = (i: number) => (
      <div
          key={i}
          className={`dot ${dots[i] ? "active" : ""}`}

          onMouseDown={() => {
            const nextValue = !dots[i];

            setIsMouseDown(true);
            setDragValue(nextValue);

            setDotValue(i, nextValue);
          }}

          onMouseEnter={() => {
            if (!isMouseDown || dragValue === null) return;

            setDotValue(i, dragValue);
          }}

          onMouseUp={() => {
            setIsMouseDown(false);
            setDragValue(null);
          }}
      />
  );

  return (
      <div
          className="modal"
          onMouseUp={() => {
            setIsMouseDown(false);
            setDragValue(null);
          }}
      >
      <div className="modal-content">
        <div className="braille-grid">
          {[
            [0, 3],
            [1, 4],
            [2, 5],
            [6, 7],
          ].map((row, y) => (
            <div key={y} className="row">
              {row.map(renderDot)}
            </div>
          ))}
        </div>

        <button
            onClick={() => {
              const symbol = dotsToBraille(dots);
              console.log("APPLY SYMBOL:", symbol);
              onApply(symbol);
            }}
        >
          Применить
        </button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}
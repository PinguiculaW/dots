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
          data-dot={i}
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

          onTouchStart={(e) => {
              e.preventDefault();

              const nextValue = !dots[i];

              setIsMouseDown(true);
              setDragValue(nextValue);

              setDotValue(i, nextValue);
          }}

          onTouchMove={(e) => {
              e.preventDefault();

              if (!isMouseDown || dragValue === null) return;

              const touch = e.touches[0];

              const element = document.elementFromPoint(
                  touch.clientX,
                  touch.clientY
              ) as HTMLElement | null;

              if (!element) return;

              const dotIndex = element.dataset.dot;

              if (dotIndex === undefined) return;

              setDotValue(Number(dotIndex), dragValue);
          }}

          onTouchEnd={() => {
              setIsMouseDown(false);
              setDragValue(null);
          }}

          onClick={() => {
              if (isMouseDown) return;

              setDotValue(i, !dots[i]);
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
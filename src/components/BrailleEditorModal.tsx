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

  const toggleDot = (i: number) => {
    const newDots = [...dots] as BrailleDots;
    newDots[i] = !newDots[i];
    setDots(newDots);
  };

  const renderDot = (i: number) => (
    <div
      key={i}
      className={`dot ${dots[i] ? "active" : ""}`}
      onClick={() => toggleDot(i)}
    />
  );

  return (
    <div className="modal">
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
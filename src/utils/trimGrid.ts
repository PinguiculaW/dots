const BRAILLE_BLANK = "⠀";

type Grid = string[][];

type TrimOptions = {
    trimTop: boolean;
    trimBottom: boolean;
    trimRight: boolean;
    trimLeft: boolean;
};

export function trimGrid(
    grid: Grid,
    options: TrimOptions
): Grid {
    const {
        trimTop,
        trimBottom,
        trimRight,
        trimLeft,
    } = options;

    let processedGrid = grid.map(row => [...row]);

    // =====================
    // trim top
    // =====================
    if (trimTop) {
        while (
            processedGrid.length > 0 &&
            processedGrid[0].every(
                cell => cell === BRAILLE_BLANK
            )
            ) {
            processedGrid.shift();
        }
    }

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

    return processedGrid;
}
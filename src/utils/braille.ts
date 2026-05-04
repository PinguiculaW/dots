export const BRAILLE_BLANK: string = "\u2800";

export type BrailleDots = [
  boolean, boolean, boolean, boolean,
  boolean, boolean, boolean, boolean
];

export function dotsToBraille(dots: BrailleDots): string {
  if (dots.length !== 8) {
    throw new Error("dots must have length 8");
  }

  let value = 0;

  for (let i = 0; i < 8; i++) {
    if (dots[i]) value |= 1 << i;
  }

  return String.fromCharCode(0x2800 + value);
}

export function brailleToDots(char: string): BrailleDots {
  const code = char.charCodeAt(0) - 0x2800;

  const dots: BrailleDots = [
    false, false, false, false,
    false, false, false, false
  ];

  for (let i = 0; i < 8; i++) {
    dots[i] = (code & (1 << i)) !== 0;
  }

  return dots;
}
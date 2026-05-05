export type Background = {
  image: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  draggable: boolean;
};

export type Selection = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} | null;

export type Tool =
  | "paste"
  | "eraser"
  | "fill"
  | "select"
  | "pencil"
  | "picker";
export type Background = {
  image: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  draggable: boolean;
};

export type Tool =
  | "fill"
  | "select"
  | "pencil"
  | "picker";
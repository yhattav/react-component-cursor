export interface Point2D {
  x: number;
  y: number;
}

export interface GravityPoint extends Point2D {
  label: string;
  mass: number;
  color: string;
}

export interface Force {
  fx: number;
  fy: number;
}

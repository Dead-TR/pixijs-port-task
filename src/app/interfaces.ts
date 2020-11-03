export interface Pier {
  graphic: PIXI.Graphics;
  full: boolean;
  free: boolean;
  y: number;
}

export interface Piers {
  [name: string]: Pier;
};

export interface Ship {
  id: number;
  graphic?: PIXI.Graphics;
  type?: string;
}

export interface Ships {
  lastId: number;
  redShips: Ship[];
  greenShips: Ship[];
}

export interface Lines {
  redLine: Ship[];
  greenLine: Ship[];
}

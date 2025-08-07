export interface Addin {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  category: string;
  isDateComponent?: boolean;
}

export interface Widget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface Capacity_Data {
  [key: string]: number;
}

export interface Item {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}
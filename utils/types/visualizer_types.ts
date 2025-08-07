export type Action =
  | { type: "TOGGLE_OPTION"; payload: number }
  | { type: "RESET_OPTIONS" };

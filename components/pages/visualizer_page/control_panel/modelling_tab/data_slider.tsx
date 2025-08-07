import React from "react";

type Props = {
  min: number;
  max: number;
  value: number;
  type: string;
  handleChange: (new_value: number) => void;
};

function DataSlider({ min, max, value, type, handleChange }: Props) {
  return (
    <div className="flex flex-col items-center justify-between">
      <span>{type === "temp" ? "Temperature" : "Load"}</span>
      <input
        type="range"
        min={min}
        max={max}
        className="range range-xs range-secondary"
        step="5"
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <div>{value}</div>
    </div>
  );
}

export default DataSlider;

import React from "react";

type Props = {
  handleToggle: () => void; //function passed in toggle external component
  toggleState: boolean;
  h: number;
  w: number;
};

function ToggleButton({ handleToggle, toggleState, h, w }: Props) {
  return (
    <div onClick={() => handleToggle()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-${w} h-${h} stroke stroke-accent fill-primary/0 stroke-2`}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={
            toggleState
              ? "M19.5 8.25l-7.5 7.5-7.5-7.5"
              : "M4.5 15.75l7.5-7.5 7.5 7.5"
          }
        />
      </svg>
    </div>
  );
}

export default ToggleButton;

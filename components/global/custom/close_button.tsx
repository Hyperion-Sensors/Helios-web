import React from "react";

type Props = {
  handleClose: () => void;
  h: number;
  w: number;
};

function CloseButton({ handleClose, h, w }: Props) {
  return (
    <button
      className={`absolute right-1 top-1 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-error bg-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent hover:bg-accent/20`}
      onClick={() => {
        handleClose();
      }}
    >
      <span className="sr-only">Close menu</span>
      <svg
        className={`h-${h} w-${w} stroke-2 stroke-round `}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export default CloseButton;

import HeliosIcon from "@/Global/icons";
import React from "react";

type Props = {};

function ResetView({}: Props) {
  return (
    <button
      className="flex flex-row border border-neutral hover:border-secondary 
    hover:shadow-lg rounded-md justify-center items-center gap-2 text-md w-full font-bold"
    >
      <div>Reset View</div>
      <div className="h-6 w-6">
        <HeliosIcon
          icon_class="arrows"
          icon_type="refresh"
          color={"stroke-secondary"}
          stroke={"stroke-2"}
        />
      </div>
    </button>
  );
}

export default ResetView;

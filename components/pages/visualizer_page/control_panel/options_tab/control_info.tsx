import HeliosIcon from "@/Global/icons";
import React from "react";

function ControlInfo() {
  return (
    <div className="grid grid-flow-col content-center text-secondary gap-2">
      <div className="flex flex-col items-center ">
        <div className="h-6 w-6">
          <HeliosIcon
            icon_class={"mouse"}
            icon_type={"scroll"}
            color={"stroke-secondary"}
            stroke={"stroke-2"}
          />
        </div>
        <span>Zoom</span>
      </div>
      <div className="flex flex-col items-center ">
        <div className="h-6 w-6">
          <HeliosIcon
            icon_class={"mouse"}
            icon_type={"right"}
            color={"stroke-secondary"}
            stroke={"stroke-2"}
          />
        </div>
        <span>Pan</span>
      </div>
      <div className="flex flex-col items-center ">
        <div className="h-6 w-6">
          <HeliosIcon
            icon_class={"mouse"}
            icon_type={"left"}
            color={"stroke-secondary"}
            stroke={"stroke-2"}
          />
        </div>
        <span>Tilt</span>
      </div>
    </div>
  );
}

export default ControlInfo;

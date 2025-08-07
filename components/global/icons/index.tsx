import React from "react";

import icons from "./icon_config.json";

type Props = {
  icon_class: string;
  icon_type: string;
  color: string;
  stroke: string;
  fill?: string;
};

function HeliosIcon({ icon_class, icon_type, color, stroke, fill }: Props) {
  return (
    <svg
      id={`helios-icon-${icon_class} `}
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ? fill : "none"}
      viewBox={icon_class == "mouse" ? "0 0 30 30 " : "0 0 24 24"}
      className={`w-full  h-full ${color} ${stroke}  `}
    >
      {/* Checks if the icon path is an array for icons that need multiple paths */}
      <path
        d={
          Array.isArray(icons[icon_class][icon_type])
            ? icons[icon_class][icon_type].join("")
            : icons[icon_class][icon_type]
        }
      />
    </svg>
  );
}

export default HeliosIcon;

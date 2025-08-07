import React from "react";
import tailwindConfig from "tailwind.config";
import HeliosIcon from "@/Global/icons";

type Props = {
  text: string | null;
  color: string;
  icon: string;
  iconType: string | null;
  iconColor: string | null;
  value: number | null;
  valueSize: string | null;
};

const colorConfig = tailwindConfig.theme.colors;
//takes an icon, text, and color, and creates a chip with the given data
function Chip({
  text,
  color,
  icon,
  iconType,
  iconColor,
  value,
  valueSize,
}: Props) {
  // const textSize = text.length > 20 ? "xs" : "sm";
  let bg = `bg-${color}`;

  return (
    <div
      className={`transition-all ease-in-out delay-100 group origin-left border-accent-light rounded-full overflow-x-hidden hover:shadow-lg hover:ring-2 ring-accent-light`}
    >
      <div
        id="chip"
        className={`transition-all ease-in-out delay-100 origin-left grid grid-cols-6 justify-around items-center group-hover:shadow-lg group-hover:bg-accent-focus `}
        style={{ backgroundColor: colorConfig["color"] }}
      >
        {icon ? (
          <div className="col-start-1 col-span-1 ">
            <div className="w-5/6 m-1">
              <HeliosIcon
                stroke={"stroke-1"}
                icon_class={icon}
                icon_type={iconType}
                color={iconColor}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        {value != null && text ? (
          <div className="origin-left col-start-2 col-span-1 text-center ">
            {" "}
            <span className={`text-xl font-bold`}>{value}</span>
          </div>
        ) : (
          <></>
        )}
        {text ? (
          <div className="origin-left col-start-3 col-span-4 text-left ">
            <span className={` text-sm font-light whitespace-nowrap`}>
              {text}
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Chip;

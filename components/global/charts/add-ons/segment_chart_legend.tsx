import React, { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

type Props = {
  itemText: string;
  maxTemp: number;
  colour: string;
  handleClick: (e: any, index: number) => void;
  index: number;
};

function SegmentChartLegendItem({
  itemText = "",
  maxTemp = 0,
  colour,
  handleClick,
  index,
}: Props) {
  const [checked, setChecked] = React.useState(true);
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);

  useEffect(() => {
    // This prevents persistent strikethroughs when the chart is re-rendered
    setChecked(true);
  }, [itemText]);

  return (
    <>
      <li
        className={`flex flex-row gap-1 justify-between items-start my-1`}
        onClick={(e) => {
          handleClick(e, index), setChecked(!checked);
        }}
        key={index}
      >
        <div className="flex flex-row">
          <div
            className={`w-5 h-4 mr-2 border-secondary/50 border-2 rounded-sm`}
            style={{ backgroundColor: colour }}
          ></div>
          <span
            className={`justify-center font-light text-sm select-none ${
              checked ? "" : "line-through"
            }`}
          >
            {itemText.replace("CABLE-", "")}
          </span>
        </div>

        {/* <span className="justify-center font-light text-sm select-none">
          {settingsData.data_options.Unit_System == "imperial"
            ? convertToFahrenheit(maxTemp).toFixed(2)
            : maxTemp.toFixed(2)}
          {settingsData.data_options.Unit_System == "imperial" ? "°F" : "°C"}
        </span> */}
      </li>
    </>
  );
}

export default SegmentChartLegendItem;

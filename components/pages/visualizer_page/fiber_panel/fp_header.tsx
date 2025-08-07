import HeliosIcon from "@/Global/icons";
import { NumericDictionary } from "lodash";
import React from "react";

type Props = {
  fiber_name: string;
  alerts: number;
  start: number;
  end: number;
};

function FPHeader({ fiber_name, alerts, start, end }: Props) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        id="fiber-segment-detail-panel"
        className="inline-flex gap-1 items-center"
      >
        <h1 className="text-lg font-bold">
          {fiber_name.replace("CABLE-", "")}
        </h1>
      </div>

      <div
        id="segment-alert-badge"
        className="flex gap-2 rounded-full bg-primary border border-neutral flex-row items-center justify-center w-full"
      >
        <div className="h-[1rem] w-[1rem] ">
          <HeliosIcon
            icon_class={"bell"}
            icon_type={"basic"}
            color={"stroke-secondary"}
            stroke={"stroke-1"}
          />
        </div>
        <p className="text-sm">{alerts} alerts in past month</p>
      </div>
    </div>
  );
}

export default FPHeader;

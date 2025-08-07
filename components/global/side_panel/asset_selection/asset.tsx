import React, { useContext, useEffect, useRef } from "react";

import Image from "next/legacy/image";

/*--------------------------Context-------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*--------------------------Components-------------------------- */
import classNames from "classnames";
import CapacityBar from "./capacity_bar";
import StatusIndicator from "@/Global/custom/status_icon";
// import Tooltip from "../../custom/tooltip";

type Props = {
  assetName: string;
  capacity: number;
  notifications_amt: number;
  id: number;
  status: boolean;
};

function Asset({ assetName, capacity, notifications_amt, id, status }: Props) {
  const { currentAsset } = useContext(AssetContext);
  const titleRef = useRef();
  const ref = React.useRef();

  let highlight_color =
    //multi-level coloring needed below
    currentAsset.id == id
      ? "bg-secondary/20 hover:border-accent/50 shadow-lg font-extrabold "
      : "bg-primary hover:bg-secondary/20 font-bold";

  return (
    <div
      className={classNames(
        " flex flex-1 justify-center py-1 px-3",
        highlight_color
      )}
    >
      <div ref={titleRef} className="w-full flex flex-col ">
        <div className="flex flex-row">
          <div className="flex flex-row ml-1">
            <StatusIndicator value={status} />
          </div>
          <p className=" flex pt-1 font-sans  text-[0.6rem] 2xl:text-sm opacity-70 break-normal text-secondary ">
            {assetName}
          </p>
        </div>
        {/* Commented out capacity bar as it was not needed */}
        {/* <div className="flex flex-row items-center justify-between w-full">
          <CapacityBar capacity={capacity} />
          <span className=" ml-2 font-bold text-xs opacity-80 self-center text-secondary">
            {Math.round(capacity)}%
          </span>
        </div> */}
        {/**Removed notification number from here as data was inaccurate */}
      </div>
    </div>
  );
}

export default Asset;

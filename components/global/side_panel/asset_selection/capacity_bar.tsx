import React, { useState, useEffect } from "react";

/*--------------------------Libraries-------------------------- */
import classnames from "classnames";

/*--------------------------Components-------------------------- */
// import Tooltip from "../../custom/tooltip";

type Props = {
  capacity: number;
};

interface Size {
  width: number | undefined;
  height: number | undefined;
}

function CapacityBar({ capacity }: Props) {
  let color = "#56F448";
  let size = capacity > 100 ? capacity - 100 : capacity;
  switch (true) {
    case size >= 30 && size <= 69:
      color = "warning";
      break;
    case size >= 70:
      color = "problem";
      break;
    default:
      color = "success";
  }

  const bar_colors = {
    success: "bg-success/50 border-2 border-success",
    warning: "bg-warning/40 border-2 border-warning",
    problem: "bg-error/50 border-2 border-error",
  };

  return (
    <div
      data-tip
      data-for="capacity-tooltip"
      className=" w-full bg-secondary/10 rounded-full h-2.5 "
    >
      <div
        className={classnames(
          " h-2.5 rounded-full opacity-75",
          bar_colors[color]
        )}
        // className={`h-2.5 rounded-full opacity-75 ${bars_colors[]}/80`}
        style={{ width: `${size <= 100 ? size : 100}%` }}
      />
      {/* <Tooltip id="capacity-tooltip" orient="bottom" content="capacity" /> */}
    </div>
  );
}

export default CapacityBar;

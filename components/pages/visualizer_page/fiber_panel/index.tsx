/*--------------------------Libraries--------------------------- */
import React, { useContext } from "react";

/*---------------------------Context------------------------ */
import { VisualizerContext } from "@/Context/visualizer_context";
import { AssetContext } from "@/Context/asset_context";

/*---------------------------Components-------------------------*/
import LastDaySegmentChart from "@/Global/charts/last_day_segment";
import FPHeader from "./fp_header";

/*--------------------Comments-------------------- */
// [1] -> these sections were commented out due to removing fiber panel opening and locking sequences from cotnext. Now only hovering will trigger a change in the current fiber context and content in the discliusre labeled 'Fiber Segment Details'

type Props = {};

function FiberPanel({}: Props) {
  const { currentAsset } = useContext(AssetContext);
  const { currentFiber } = useContext(VisualizerContext);
  const data = [20, 15, 14, 27];
  const last = data[data.length - 1];
  return (
    <div
      className={`flex flex-col justify-between bg-primary shadow-lg rounded-md relative h-full`}
    >
      <div className="bg-primrary text-secondary text-center">
        <FPHeader fiber_name={currentFiber} start={0} end={78} alerts={0} />
      </div>
      <div className="bg-primrary h-[10rem] w-full text-secondary text-center">
        <LastDaySegmentChart />
      </div>
    </div>
  );
}

export default FiberPanel;

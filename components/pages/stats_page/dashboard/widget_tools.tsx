/*--------------------------Widgets------------------------- */
// import SegmentFiberChart from "@/Global/charts/segment_temp_v_length";
import ThresholdDetail from "../widgets/threshold_detail";
import AssetDetail from "../widgets/asset_detail";
import LoadWidget from "../widgets/load";
import { HalfDayCapacity } from "@/Global/charts/avg_capacity_v_time";
import BreakerStatusChart from "@/Global/charts/breaker_status";
import RecentCapacityWidget from "../widgets/recent_capacity";
import SegmentAggregateWidget from "../widgets/segment_aggregate";
import AggregateSummaryWidget from "../widgets/historical_aggregate";

/*------------------------Components------------------------ */
import InfoCard from "@/Global/custom/info_card";
import HeliosIcon from "@/Global/icons";

/*---------------------------Types-------------------------- */
import { Widget } from "@/Types/stats_types";

/*--------------------------Libraries------------------------- */
import { format } from "date-fns";
import dynamic from "next/dynamic";

//In-order to use zoom, must import component dynamically on client-side or will error due to no window defineddddddddddddddd
const SegmentFiberChart = dynamic(
  () => import("@/Global/charts/segment_temp_v_length"),
  { ssr: false }
);

// layout, layoutItem, _event
const components = {
  Load: <LoadWidget />,
  "Breaker Status": <BreakerStatusChart />,
  "Full Dataset": <SegmentFiberChart />,
  "Threshold Detail": <ThresholdDetail />,
  // "Asset Detail": <AssetDetail />, temporarily removed, needs a redesign
  "Average Thermal Rating": <HalfDayCapacity />,
  "Recent Thermal Rating": <RecentCapacityWidget />,
};

const dateComponents = (name: string, id: number) => {
  let components = {
    "Segment Aggregate": <SegmentAggregateWidget id={id} />,
    "Aggregate Summary": <AggregateSummaryWidget id={id} />,
  };

  return components[name] ? components[name] : undefined;
};

function componentExists(name: string) {
  let inDateComponents = dateComponents(name, 0);
  return name in components || inDateComponents != undefined;
}

function isDateComponent(name: string) {
  if (dateComponents(name, 0) != undefined) {
    return true;
  }
  return false;
}

/*
 create_widget
 
 Returns a JSX element housing a sepcific component based on the item name or index (item.i) value.
*/

function create_widget(
  widget: Widget,
  onRemoveItem: (item: string) => void,
  widgetsDraggable: boolean
) {
  let formattedItem = widget.i.replace(/\s\d+$/, "");
  let id = Number(widget.i.split("").pop());

  return (
    <div
      key={widget.i}
      id={widget.i}
      data-grid={{
        x: widget.x,
        y: widget.y,
        w: widget.w,
        h: widget.h,
        minW: widget.minW ? widget.minW : 1,
        minH: widget.minH ? widget.minH : 1,
        maxW: widget.maxW ? widget.maxW : Infinity,
        maxH: widget.maxH ? widget.maxH : Infinity,
      }}
      className="relative group/parent rounded-lg bg-primary flex flex-col justify-center shadow-lg"
    >
      {widgetsDraggable && (
        <div className="w-6 h-6 place-self-center absolute top-0 left-0 bg-secondary drag-handle cursor-move rounded-tl-lg z-[11]">
          <HeliosIcon
            icon_class={"bars"}
            icon_type={"2"}
            color={"stroke-primary"}
            stroke={"stroke-2"}
          />
        </div>
      )}

      {true && (
        <div
          className={`flex flex-row w-full h-6 bg-secondary rounded-t-lg ${
            widgetsDraggable ? "cursor-move drag-handle" : ""
          }`}
        >
          <text className="text-center w-full text-primary">
            {isDateComponent(formattedItem) ? widget.i : formattedItem}
          </text>

          <div className="flex flex-row absolute right-1 top-[0.125rem] cursor-default group-hover/parent:opacity-100 opacity-0 transition-all duration-200">
            <div className="flex h-4 w-4 group/info place-self-center">
              <InfoCard
                title={formattedItem || widget.i}
                description={"Placeholder for description of element"}
                card_styles={
                  "top-5 right-0 hidden group-hover/info:flex-grow text-center group-hover:block absolute z-10 p-2 shadow-md bg-primary border border-neutral rounded-md divide-accent-semi-light"
                }
              />
            </div>
            <div className="h-5 w-5" onClick={() => onRemoveItem(widget.i)}>
              <HeliosIcon
                icon_class={"x"}
                icon_type={""}
                color={"stroke-primary hover:stroke-error"}
                stroke={"stroke-2"}
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-1 w-full h-full">
        {isDateComponent(formattedItem)
          ? dateComponents(formattedItem, id)
          : components[formattedItem]}
      </div>
    </div>
  );
}

export { create_widget, isDateComponent, componentExists };

import { useState } from "react";

/*---------------------------Types Imports-------------------------- */
import { Widget, Item } from "@/Types/stats_types";
import _ from "lodash";

/*------------Custom Components-------------*/
import WidgetTabs from "../tabs/tab";
import HeliosIcons from "@/Global/icons";
import InfoCard from "@/Global/custom/info_card";

/*---------------------------DEFAULT LAYOUT-------------------------- */
const defaultLayout = [
  { i: "Fiber Aggregate", x: 0, y: 0, w: 3, h: 1 },
  { i: "Threshold Status", x: 3, y: 0, w: 2, h: 1 },
  { i: "Fiber Segment", x: 0, y: 1, w: 4, h: 1 },
  { i: "Highest Fiber", x: 4, y: 1, w: 1, h: 1 },
];

/*-----------------------------PROPS-------------------------------- */
type Props = {
  setSelectedWidget: (widget: Item) => void;
};

/*---------------------------MAIN FUNCTION-------------------------- */
const WidgetBar = ({ setSelectedWidget }: Props) => {
  const [widgetsVisible, setWidgetsVisible] = useState(true);

  const toggleWidgetsVisible = () => {
    setWidgetsVisible(!widgetsVisible);
  };

  return (
    <div className="flex flex-row relative w-full">
      <div className="flex w-full items-center gap-2 pt-3 pb-2 px-4 justify-between">
        <div className="flex place-self-start w-5 h-5 xl:w-6 xl:h-6">
          <InfoCard
            title={"Asset Analysis Dashboard"}
            description={
              "Drag widgets onto the dashboard for data visualization. Use the tools on the left side to select specific date ranges for a detailed asset analysis. Remember to save your current layout for consistent insights on future visits."
            }
            card_styles={
              "p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-10  bg-primary rounded-md shadow-lg top-0 left-10"
            }
          />
        </div>
        <WidgetTabs
          addOption={(widget) => {
            setSelectedWidget(widget);
          }}
          toggleWidgetsVisible={toggleWidgetsVisible}
          widgetsVisible={widgetsVisible}
        />

        <div
          className={`flex place-self-start mt-[0.2rem] w-6 h-6`}
          onClick={() => toggleWidgetsVisible()}
        >
          <HeliosIcons
            icon_class={widgetsVisible ? "chevron" : "chevron"}
            icon_type={widgetsVisible ? "up" : "down"}
            color={
              widgetsVisible
                ? "stroke-accent"
                : "stroke-secondary hover:stroke-accent"
            }
            stroke={"stroke-2 stroke-linecap-round"}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetBar;

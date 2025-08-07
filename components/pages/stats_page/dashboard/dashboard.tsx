import React, { useEffect, useState, useContext } from "react";

/*---------------------------Types Imports-------------------------- */
import { Item, Widget } from "@/Types/stats_types";

/*-----------------------Custom Components---------------------------*/
import DashboardHeader from "./header";
import WidgetBar from "./widget_bar";
import WidgetGrid from "./widget_grid";
import { isDateComponent } from "./widget_tools";
import { StatsContext } from "@/Context/stats_context";

/*---------------------------LOCAL STORAGE MANAGEMENT-------------------------- */
function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key));
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls != null ? ls["layout"] : defaultLayout;
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      key,
      JSON.stringify({
        layout: value,
      })
    );
  }
}

/*---------------------------DEFAULT LAYOUT-------------------------- */
const defaultLayout = [
  { i: "Full Dataset", x: 0, y: 0, w: 4, h: 1, minW: 4 },
  { i: "Threshold Detail", x: 4, y: 0, w: 4, h: 1, minW: 4 },
  { i: "Segment Aggregate", x: 0, y: 1, w: 5, h: 1, minW: 5 },
  {
    i: "Aggregate Summary",
    x: 5,
    y: 1,
    w: 3,
    h: 1,
    minW: 3,
    minH: 1,
  },
];

const Dashboard = () => {
  const { dateLockedWidgets, setDateLockedWidgets, selectedDateRange } =
    useContext(StatsContext);
  const [selectedWidget, setSelectedWidget] = useState<Item>({
    i: "",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const [widgets, setWidgets] = useState<Array<Widget>>([]); // This is the actual layout state
  const [count, setCount] = useState<number>(0);

  // This useEffect loads and processes the layout from local storage
  // into a format useable by RGL.
  useEffect(() => {
    try {
      let layout;
      if (global.localStorage.getItem("current_layout") != null) {
        layout = getFromLS("current_layout")["lg"];
      } else if (global.localStorage.getItem("saved_layout") != null) {
        layout = getFromLS("saved_layout")["lg"];
      } else {
        throw new Error("No layout found in local storage");
      }

      parseLayoutFromLocalStorage(layout);
    } catch (error) {
      setWidgets(defaultLayout);
    }
  }, []);

  function parseLayoutFromLocalStorage(layout) {
    let onStartCount = -1;
    let newDateLockedWidgets: any = {};

    // Resets the id and count of the loaded layout
    if (layout) {
      layout = layout.map((widget) => {
        onStartCount += 1;
        let widgetName: string = widget.i.replace(/\s\d+$/, "");

        //Add comments here...
        if (isDateComponent(widgetName)) {
          let latestWidget = {
            [`${onStartCount}`]: {
              widgetName: widgetName,
              locked: false,
              dateRange: selectedDateRange,
            },
          };

          newDateLockedWidgets = {
            ...newDateLockedWidgets,
            ...latestWidget,
          };
        }

        return {
          ...widget,
          i: widgetName + " " + onStartCount,
        };
      });
      setWidgets([...layout]);
    } else {
      setWidgets(defaultLayout);
    }

    setDateLockedWidgets(newDateLockedWidgets);
    setCount(onStartCount + 1);
  }

  return (
    <div className="flex flex-col relative w-full min-h-full h-full">
      <div className="flex flex-row sticky top-0 items-start w-full z-10 bg-primary pr-2 pl-3 rounded-lg shadow-lg">
        <DashboardHeader getFromLS={getFromLS} saveToLS={saveToLS} />

        <WidgetBar setSelectedWidget={setSelectedWidget} />
      </div>

      <WidgetGrid
        selectedWidget={selectedWidget}
        setSelectedWidget={setSelectedWidget}
        widgets={widgets}
        setWidgets={setWidgets}
        count={count}
        setCount={setCount}
        getFromLS={getFromLS}
        saveToLS={saveToLS}
      />
    </div>
  );
};

export default Dashboard;

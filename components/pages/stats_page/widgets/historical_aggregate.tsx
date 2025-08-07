/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect } from "react";
import "chartjs-adapter-luxon";
import { lightFormat } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------API---------------------------- */
import { StatsContext } from "@/Context/stats_context";
import AggregateSummaryChart from "@/Global/charts/aggregate_temperature_v_time";


function AggregateSummaryWidget(widgetId: any) {
  const { selectedDateRange, dateLockedWidgets, setDateLockedWidgets } = useContext(StatsContext);
  const { currentAsset } = useContext(AssetContext);

  const [savedDateRange, setSavedDateRange] = useState({start: selectedDateRange.startDate, end: selectedDateRange.endDate});
  const [start, setStart] = useState(lightFormat(new Date(), "yyyy-MM-dd"));
  const [end, setEnd] = useState(lightFormat(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    const get_data = async () => {
      let contextWidget = dateLockedWidgets[widgetId.id];

      if (contextWidget && contextWidget.locked) {
        setStart(savedDateRange.start)
        setEnd(savedDateRange.end)
      } else {
        setStart(selectedDateRange.startDate);
        setEnd(selectedDateRange.endDate);
        setSavedDateRange({start: selectedDateRange.startDate, end: selectedDateRange.endDate});
      }
    };

    get_data();
  }, [currentAsset, selectedDateRange, widgetId, dateLockedWidgets, savedDateRange.start, savedDateRange.end]);

  return (
    <div className="flex h-full">
        <AggregateSummaryChart
            startDate={start}
            endDate={end}
        />
    </div>
  );
}

export default AggregateSummaryWidget;

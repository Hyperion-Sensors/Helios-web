import DateRanger from "@/Global/charts/add-ons/date-ranger";
import AggregateSummaryChart from "@/Global/charts/aggregate_temperature_v_time";
import { format } from "date-fns";
import { useState } from "react";

type Props = {};

const AggTempsPanel = (props: Props) => {
  const [selectedRange, setSelectedRange] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  return (
      <div className="w-full h-full relative overflow-hidden">
        <div className="w-6 h-6 absolute right-1 z-10">
          <DateRanger changeDates={setSelectedRange} popOutRight={false}/>
        </div>

        <AggregateSummaryChart
          startDate={String(selectedRange.startDate)}
          endDate={String(selectedRange.endDate)}
        />
      </div>
  );
};

export default AggTempsPanel;

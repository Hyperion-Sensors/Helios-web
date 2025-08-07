import React, { useContext, useEffect, useRef, useState } from "react";

/*--------------------------Icons----------------------------- */
import HeliosIcons from "@/Global/icons";

/*--------------------------Context------------------------------ */
import { StatsContext } from "@/Context/stats_context";
import { Popover } from "@headlessui/react";

function DateLocker() {
  const { dateLockedWidgets, setDateLockedWidgets, selectedDateRange } = useContext(StatsContext);
  const [checkboxElements, setCheckboxElements] = useState([]);

  useEffect(() => {
    const handleCheckboxChange = (event) => {
      const { checked, id } = event.target;
  
      setDateLockedWidgets({
        ...dateLockedWidgets,
        [id]: { ...dateLockedWidgets[id], locked: checked, dateRange: selectedDateRange },
      });
    };

    const newCheckboxElements = Object.entries(dateLockedWidgets).map(
      ([key, value]:[key: string, value: {widgetName: string; locked: boolean}]) => {
        return (
          <li key={`checklist-item-${key}`}>
            <div>
              <input
                type="checkbox"
                id={key}
                checked={value.locked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`checkbox-${key}`} className="ml-2">
                {value.widgetName + " " + key}
              </label>
            </div>
          </li>
        );
      }
    );

    setCheckboxElements(newCheckboxElements);
  }, [dateLockedWidgets, selectedDateRange, setDateLockedWidgets]);

  return (
    <Popover className="relative flex items-center">
      <Popover.Button className="inline-flex w-full group text-md hover:bg-neutral rounded-md px-1">
        <div className="w-6 h-6">
          <HeliosIcons
            icon_class={"clock"}
            icon_type={"basic"}
            color={"stroke-secondary"}
            stroke={"stroke-2"}
          />
        </div>
        <p className="text-sm text-secondary font-medium text-center place-self-center w-full h-full">
          Lock Dates
        </p>
        <div className="w-6 h-6">
          <HeliosIcons
            icon_class={"chevron"}
            icon_type={"down"}
            color={"stroke-secondary"}
            stroke={"stroke-2 "}
          />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute top-8 left-0 w-max right-3 p-2 shadow-md bg-primary border border-neutral rounded-md divide-neutral">
        <ul className="text-sm text-secondary select-none">
          {checkboxElements.length != 0 ? checkboxElements : "No Date Widgets"}
        </ul>
      </Popover.Panel>
    </Popover>
  );
}

export default DateLocker;

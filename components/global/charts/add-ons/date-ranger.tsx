import React, { useState } from "react";

/*-------------------------------Libraries------------------------------- */
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, format, lightFormat } from "date-fns";

/*---------------------------Library Components-------------------------- */
import { DateRange } from "react-date-range";
import HeliosIcon from "@/Global/icons";
import { Popover } from "@headlessui/react";
import { isEqual } from "date-fns";

type Props = {
  changeDates({ startDate, endDate }): void;
  selectedDates?: { startDate: string; endDate: string };
  popOutRight?: boolean;
  form?: boolean;
};

function DateRanger({
  changeDates,
  selectedDates,
  popOutRight = true,
  form = false,
}: Props) {
  //return a component that produces a start and end date for the parent component to use
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  function handleRangeSelect(ranges) {
    let start: string;
    let end: string;

    // Necessary in order to create a range from 00:00:00 to 23:59:59
    if (isEqual(ranges.selection.startDate, ranges.selection.endDate)) {
      start = lightFormat(new Date(ranges.selection.startDate), "yyyy-MM-dd");
      end = lightFormat(
        addDays(new Date(ranges.selection.endDate), 1),
        "yyyy-MM-dd"
      );
    } else {
      start = lightFormat(new Date(ranges.selection.startDate), "yyyy-MM-dd");
      end = lightFormat(new Date(ranges.selection.endDate), "yyyy-MM-dd");
    }

    changeDates({
      startDate: start,
      endDate: end,
    });

    // Does not need the extra day added to the end date because the calendar doesn't care
    setSelectedRange([
      {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
      },
    ]);
  }

  return (
    <>
      {" "}
      {form ? (
        <div className="flex gap-2 group hover:bg-secondary/20 rounded-md p-2 ">
          <Popover className="h-full w-fit relative">
            <Popover.Button className="w-fit h-full rounded-md z-10 group-hover:bg-secondary bg-secondary/50 p-1">
              <button className="w-6 h-6 xl:w-8 xl:h-8">
                <HeliosIcon
                  icon_class={"calendar"}
                  icon_type={"days"}
                  color={""}
                  stroke={
                    "group-hover:stroke-accent stroke-secondary stroke-1 stroke-linecap-round"
                  }
                />
              </button>
              <p className="label-text text-xs font-bold group-hover:text-primary">
                Select Dates
              </p>
            </Popover.Button>

            <Popover.Panel
              className={`absolute top-9 ${
                popOutRight ? "left-3" : "right-3"
              } z-10 shadow-md bg-secondary border border-primary rounded-md`}
            >
              <DateRange
                ranges={selectedRange}
                moveRangeOnFirstSelection={false}
                maxDate={new Date()}
                onChange={handleRangeSelect}
              />
            </Popover.Panel>
          </Popover>
          <div className="form-control w-fit ">
            <label className="label">
              <span className="label-text text-xs font-bold">Start Date</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              value={selectedDates.startDate}
              className="input input-bordered w-full "
              disabled
            />
          </div>
          <div className="form-control w-fit ">
            <label className="label">
              <span className="label-text text-xs font-bold">End Date</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              value={selectedDates.endDate}
              className="input input-bordered w-full "
              disabled
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-2  rounded-md  ">
          <Popover className="h-full w-fit relative">
            <Popover.Button className="w-fit h-full rounded-md z-10 ">
              <button className="w-6 h-6">
                <HeliosIcon
                  icon_class={"calendar"}
                  icon_type={"days"}
                  color={""}
                  stroke={"stroke-2 stroke-secondary  stroke-linecap-round"}
                />
              </button>
            </Popover.Button>
            <Popover.Panel
              className={`absolute top-9 ${
                popOutRight ? "left-3" : "right-3"
              } z-10 shadow-md bg-secondary border border-primary rounded-md`}
            >
              <DateRange
                ranges={selectedRange}
                moveRangeOnFirstSelection={false}
                maxDate={new Date()}
                onChange={handleRangeSelect}
              />
            </Popover.Panel>
          </Popover>
        </div>
      )}
    </>
  );
}

export default DateRanger;

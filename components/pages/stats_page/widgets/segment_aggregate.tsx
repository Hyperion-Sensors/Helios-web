/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect } from "react";
import "chartjs-adapter-luxon";
import { Combobox, Tab, Transition } from "@headlessui/react";
import { lightFormat } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import tailwindConfig from "tailwind.config";
/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------API---------------------------- */
import { get_fibers } from "@/API/asset_services";
import { StatsContext } from "@/Context/stats_context";
import HeliosIcon from "@/Global/icons";
import OpenCloseLine from "@/Global/custom/open_close_line";
import SegmentAggregateChart from "@/Global/charts/aggregate_segment_temp_v_time";

interface fiber {
  id: number;
  name: string;
}

const tabOptions = [
  { id: 1, name: "Max", value: "max" },
  { id: 2, name: "Avg", value: "avg" },
];

function SegmentAggregateWidget(widgetId: any) {
  const { selectedDateRange, dateLockedWidgets } = useContext(StatsContext);
  const { currentAsset } = useContext(AssetContext);

  const [savedDateRange, setSavedDateRange] = useState({
    start: selectedDateRange.startDate,
    end: selectedDateRange.endDate,
  });
  const [start, setStart] = useState(lightFormat(new Date(), "yyyy-MM-dd"));
  const [end, setEnd] = useState(lightFormat(new Date(), "yyyy-MM-dd"));

  const [currentFiber, setCurrentFiber] = useState<fiber[]>([
    { id: 0, name: "Select Segment" },
  ]);
  const [aggregateType, setAggregateType] = useState("max");
  const [interval, setInterval] = useState("1 hour");
  const [query, setQuery] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFiber, setSelectedFiber] = useState(currentFiber[0]);

  const [showSidebar, setShowSidebar] = useState(true);

  const colorConfig = tailwindConfig.daisyui.themes[0]; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const get_fibers_data = async () => {
      const result = await get_fibers(currentAsset.id);
      if (result != null) {
        setCurrentFiber(result.data);
        setSelectedFiber(result.data[0]);
      }
    };
    get_fibers_data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAsset]);

  useEffect(() => {
    const get_data = async () => {
      let contextWidget = dateLockedWidgets[widgetId.id];

      if (contextWidget && contextWidget.locked) {
        setStart(savedDateRange.start);
        setEnd(savedDateRange.end);
      } else {
        setStart(selectedDateRange.startDate);
        setEnd(selectedDateRange.endDate);
        setSavedDateRange({
          start: selectedDateRange.startDate,
          end: selectedDateRange.endDate,
        });
      }
    };

    get_data();
  }, [
    currentFiber,
    currentAsset,
    aggregateType,
    interval,
    selectedFiber,
    selectedDateRange,
    widgetId,
    dateLockedWidgets,
    savedDateRange.start,
    savedDateRange.end,
    start,
    end,
  ]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  var filterFibers: fiber[] = [];

  if (Array.isArray(currentFiber)) {
    filterFibers =
      query === ""
        ? currentFiber
        : currentFiber.filter((fiber) => {
            return fiber.name.toLowerCase().includes(query.toLowerCase());
          });
  }

  return (
    <div className="flex flex-row gap-1 h-full">
      <SegmentAggregateChart
        aggregateType={aggregateType}
        interval={interval}
        selectedFiber={selectedFiber}
        start={start}
        end={end}
      />

      {/* Close/Open Button */}
      <OpenCloseLine
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "max-w-[50%] opacity-100"
            : "max-w-0 overflow-hidden opacity-0"
        } flex flex-col w-fit transition-all ease-in-out duration-300`}
      >
        {/* Max/Avg Selection */}
        <div className="flex flex-row place-content-center w-full">
          <Tab.Group
            selectedIndex={selectedIndex}
            onChange={(index) => {
              setSelectedIndex(index);
              setAggregateType(tabOptions[index].value);
            }}
          >
            <Tab.List className="flex ">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "flex px-1 w-full text-sm xl:text-base",
                    selected
                      ? "border-secondary text-secondary font-bold border-b"
                      : "text-secondary hover:text-accent hover:border-accent hover:border-b"
                  )
                }
              >
                {tabOptions[0].name}
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "flex px-1 w-full text-sm xl:text-base",
                    selected
                      ? "border-secondary text-secondary font-bold"
                      : "text-secondary hover:border-accent hover:border-b"
                  )
                }
              >
                {tabOptions[1].name}
              </Tab>
            </Tab.List>
          </Tab.Group>
        </div>

        {/* Segment Selection */}
        <div className="flex h-fit w-full p-1">
          <Combobox value={selectedFiber} onChange={setSelectedFiber}>
            <div className="relative mt-1">
              <div className="relative cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:outline-none rounded-sm ring-1 ring-secondary focus-within:ring-2 focus-within:ring-secondary">
                <Combobox.Input
                  className="w-full rounded px-1 focus-visible:outline-none"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(fiber: fiber) => fiber.name}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  {" "}
                  <HeliosIcon
                    icon_class={"chevron"}
                    icon_type={"up-down"}
                    color={""}
                    stroke={"stroke-1 stroke-secondary"}
                  />
                </Combobox.Button>
              </div>

              <Transition afterLeave={() => setQuery("")} />

              <Combobox.Options
                static
                className="max-h-[10rem] w-full flex-col flex flex-1 z-50 mt-1 overflow-y-auto bg-primary text-base focus:outline-none sm:text-sm"
              >
                {filterFibers.length > 0 ? (
                  filterFibers.map((fiber) => (
                    <Combobox.Option
                      className={({ active }) =>
                        `pl-1 cursor-default select-none hover:bg-secondary hover:text-primary ${
                          active ? "bg-secondary text-primary" : "text-secondary"
                        }`
                      }
                      key={fiber.id}
                      value={fiber}
                      onClick={() => {
                        setSelectedFiber(fiber);
                      }}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {fiber.name}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                ) : (
                  <div>Nothing Found</div>
                )}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  );
}

export default SegmentAggregateWidget;

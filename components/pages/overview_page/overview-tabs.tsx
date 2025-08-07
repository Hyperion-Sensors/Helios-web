import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";

/*--------------------------------Library Imports------------------------------- */
import { Tab } from "@headlessui/react";

/*--------------------------------Context Imports------------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------Component Imports ------------------------------- */
import HeliosIcon from "@/Global/icons";
import ExpandTab from "./expand_tab";
import MapBlock from "@/Global/map_block";

/*-------------------------------Hook Imports ------------------------------- */
import { format, subHours } from "date-fns";
import { useAssetFiberTemperatures } from "@/Queries/asset_queries";

//In-order to use zoom, must import component dynamically on client-side or will error due to no window defined
const SegmentFiberChart = dynamic(
  () => import("@/Global/charts/segment_temp_v_length"),
  { ssr: false }
);
//In-order to use zoom, must import component dynamically on client-side or will error due to no window defined
const SegmentOverviewChart = dynamic(
  () => import("@/Global/charts/segment_overview_chart"),
  { ssr: false }
);

type Props = {};

function OverviewTabs({}: Props) {
  const { currentAsset, currentSegment } = useContext(AssetContext);
  const [currentTab, setCurrentTab] = useState<string>("Fault Location");
  const [historicalTime, setHistoricalTime] = useState<Date>(
    subHours(new Date(), 200)
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { data: fiberData } = useAssetFiberTemperatures(currentAsset.id);
  /*
  To add a tab:
  
  1) Create a widget/component you would like to have in overview. 
  2)  Import your widget under component imports above ^^
  3) Add an object containing: {name: <name of tab,component: <TSX or JSX component>} to the tabs list below. 

  */

  // let start = format(dayAgo, "yyyy-MM-dd");
  // let end = format(new Date(), "yyyy-MM-dd");
  useEffect(() => {
    if (fiberData && currentAsset) {
      const newestDate = new Date(
        Object.values(fiberData.data.fiber_data)[0]["time"]
      );

      setHistoricalTime(subHours(newestDate, 200));
    }
  }, [fiberData, currentAsset]);
  // Format the date to "yyyy-MM-dd"

  let tabs = [
    {
      name: "Thermal History",
      component:
        currentSegment == undefined ? (
          <div>No Current Segment</div>
        ) : (
          <SegmentOverviewChart
            aggregateType={"max"}
            selectedFiber={currentSegment}
            interval={"1 hour"}
            start={format(historicalTime, "yyyy-MM-dd")}
            end={format(new Date(), "yyyy-MM-dd")}
          />
        ),
      description:
        "View the last 24 hours of temperature data for the selected sensor zone.",
      icon_class: "clock",
      icon_type: "basic",
    },
    {
      name: "Full Dataset",
      component: <SegmentFiberChart />,
      description:
        "Full temperature over distance readings for the selected asset. Click on a segment to view the temperature readings for that segment.",
      icon_class: "stats",
      icon_type: "bar",
    },
    {
      name: " Map",
      component: <MapBlock />,
      description: "Locate your assets using this map.",
      icon_class: "map",
      icon_type: "basic",
    },
  ];

  //handles state change for tab menu

  function handleChangeIndex(index: number) {
    if (selectedIndex == index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const expanded = (
    <Tab.Panels className={`h-full w-full  overflow-hidden rounded-lg`}>
      {tabs.map((n, index) => {
        return (
          <Tab.Panel
            key={index}
            className=" flex flex-col w-full h-full gap-6 xl:gap-0"
          >
            <div className="flex flex-row justify-start relative">
              <div className="absolute z-40 right-5">
                <ExpandTab title={n.name} content={n.component} />
              </div>
            </div>
            <div className=" h-full relative p-3  hover:shadow-inner hover:border-secondary/50 bg-primary">
              {n.component}
            </div>
          </Tab.Panel>
        );
      })}
    </Tab.Panels>
  );

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => handleChangeIndex(index)}
    >
      <Tab.List className={`flex flex-row justify-center w-full border-b pt-2`}>
        {tabs.map((c, index) => (
          <Tab
            key={index}
            onClick={() => {
              if (currentTab == c.name) {
                setCurrentTab("");
              } else {
                setCurrentTab(c.name);
              }
            }}
            className={({ selected }) =>
              classNames(
                " text-secondary focus:outline-none flex flex-row justify-center w-3/12 mx-3",
                selected
                  ? " border-b-2 border-secondary"
                  : "text-secondary hover:text-secondary/50 border-b-2 border-secondary/10 text-text font-medium"
              )
            }
          >
            <div className="h-5 w-5">
              <HeliosIcon
                icon_class={c.icon_class}
                icon_type={c.icon_type}
                color={"stroke-secondary"}
                stroke={"stroke-1"}
              />
            </div>
            <div className={`text-sm lg:text-md truncate font-bold mb-1 mx-2 `}>
              {c.name}
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className={`h-full w-full  overflow-hidden rounded-lg`}>
        {tabs.map((n, index) => {
          return (
            <Tab.Panel
              key={index}
              className=" flex flex-col w-full h-full gap-6 xl:gap-0"
            >
              {/* <div className="flex flex-row justify-start relative">
                <div className="absolute z-40 right-5">
                  <ExpandTab title={n.name} content={n.component} />
                </div>
              </div> */}
              <div className=" h-full relative p-3  hover:shadow-inner hover:border-secondary/50 bg-primary">
                {n.component}
              </div>
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default OverviewTabs;

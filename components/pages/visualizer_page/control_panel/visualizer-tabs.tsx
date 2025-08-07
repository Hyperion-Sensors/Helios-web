import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";

/*--------------------------------Library Imports------------------------------- */
import { Tab } from "@headlessui/react";

/*--------------------------------Context Imports------------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------Component Imports ------------------------------- */
import InfoCard from "@/Global/custom/info_card";
import HeliosIcon from "@/Global/icons";
import FiberPanel from "../fiber_panel";
import ViewChanger from "./options_tab/view_changer";
import ControlTabs from "./control_tabs";
import { AssetHealthGauge } from "./health_tab/asset_health_gauge";

/*-------------------------------Hook Imports ------------------------------- */
import { useSettings } from "@/Queries/settings_queries";
import SegmentOverviewChart from "@/Global/charts/segment_overview_chart";
import { format, subHours } from "date-fns";
import OptionsTab from "./options_tab";

type Props = {};

function VisualizerTabs({}: Props) {
  const { currentSegment } = useContext(AssetContext);
  const [currentTab, setCurrentTab] = useState<string>("");

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  /*
  To add a tab:
  
  1) Create a widget/component you would like to have in overview. 
  2)  Import your widget under component imports above ^^
  3) Add an object containing: {name: <name of tab,component: <TSX or JSX component>} to the tabs list below. 

  */

  const now = new Date();
  const dayAgo = subHours(new Date(), 200);
  // Format the date to "yyyy-MM-dd"
  const start = format(dayAgo, "yyyy-MM-dd");
  const end = format(now, "yyyy-MM-dd");

  const control_tabs = ["Controls"];

  let tabs = [
    {
      name: "Control Panel",
      component: <OptionsTab />,
      description:
        "View the last 24 hours of temperature data for the selected sensor zone.",
      icon_class: "clock",
      icon_type: "basic",
    },
    {
      name: "Asset Details",
      component: <FiberPanel />,
      description:
        "Full temperature over distance readings for the selected asset. Click on a segment to view the temperature readings for that segment.",
      icon_class: "stats",
      icon_type: "bar",
    },
    {
      name: " Map",
      component: <AssetHealthGauge />,
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

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => handleChangeIndex(index)}
    >
      <Tab.List className={`flex w-full border-b pt-2`}>
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
              {/* <div className="relative">
                <div className="flex flex-row justify-start">
                  <div className="absolute z-40 right-5">
                    <ExpandTab title={n.name} content={n.component} />
                  </div>
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

export default VisualizerTabs;

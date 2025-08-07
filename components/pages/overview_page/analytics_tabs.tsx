import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";

/*--------------------------------Library Imports------------------------------- */
import { Tab } from "@headlessui/react";

/*--------------------------------Context Imports------------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------Component Imports ------------------------------- */
import AggTempsPanel from "./aggregate_summary_panel";
import InfoCard from "@/Global/custom/info_card";
import HeliosIcon from "@/Global/icons";
import ExpandTab from "./expand_tab";

/*-------------------------------Hook Imports ------------------------------- */
import { useSettings } from "@/Queries/settings_queries";
import { useQueryClient } from "@tanstack/react-query";

//In-order to use zoom, must import component dynamically on client-side or will error due to no window defined
const SegmentFiberChart = dynamic(
  () => import("@/Global/charts/segment_temp_v_length"),
  { ssr: false }
);

type Props = {};

function AnalyticsTabs({}: Props) {
  const [currentTab, setCurrentTab] = useState<string>("Fault Location");

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  /*
  To add a tab:
  
  1) Create a widget/component you would like to have in overview. 
  2)  Import your widget under component imports above ^^
  3) Add an object containing: {name: <name of tab,component: <TSX or JSX component>} to the tabs list below. 

  */

  let tabs = [
    {
      name: "Full Dataset",
      component: <SegmentFiberChart />,
      description:
        "Full temperature over distance readings for the selected asset. Click on a segment to view the temperature readings for that segment.",
    },
    {
      name: "Temperature Historian",
      component: <AggTempsPanel />,
      description:
        "Aggregate hourly average and max values for temperature readings.",
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
      <Tab.List className={`flex py-1 w-1/3 `}>
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
                "w-full text-secondary focus:outline-none",
                selected
                  ? " border-b-2 border-secondary"
                  : "text-secondary hover:text-secondary/50 border-b-2 border-secondary/10 text-text font-medium"
              )
            }
          >
            <div className={`text-xs lg:text-md truncate font-bold mb-1 mx-2`}>
              {c.name}{" "}
            </div>
          </Tab>
        ))}
      </Tab.List>

      {/* This is overlapping 3d, please help stop it */}
      <Tab.Panels className={`h-full w-full rounded-md overflow-hidden`}>
        {tabs.map((n, index) => {
          return (
            <Tab.Panel
              key={index}
              className=" flex flex-col w-full h-full gap-6 xl:gap-0"
            >
              <div className="relative">
                <div className="flex flex-row justify-start">
                  <h1
                    id="analytics_tab_header"
                    className="font-bold text-lg xl:text-xl "
                  >
                    {n.name}
                  </h1>
                  <div className="h-5 w-5 group">
                    <InfoCard
                      title={"How to use chart tabs"}
                      description={
                        "Angle: Left-click and drag. \n Zoom: Scroll. \n Pan: Right-click and drag. "
                      }
                      card_styles={
                        "p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-10  bg-primary rounded-md shadow-lg top-0 left-10"
                      }
                    />
                  </div>
                  <div className="absolute right-5">
                    <ExpandTab title={n.name} content={n.component} />
                  </div>
                </div>

                <p
                  id="analytics_tab_description"
                  className="font-bold text-sm text-text"
                >
                  {n.description}
                </p>
              </div>
              <div className=" h-full relative p-3 border-secondary/10 border  hover:shadow-inner hover:border-secondary/50 rounded-md bg-primary">
                {n.component}
              </div>
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default AnalyticsTabs;

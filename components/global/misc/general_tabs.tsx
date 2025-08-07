/*--------------------------------Library Imports------------------------------- */
import React, { ReactElement, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

type tab = { name: string; component: ReactElement; description: string };
type Props = {
  tabs: tab[];
  title?: string;
  onTabChange?: (tab_name: string) => void;
};

function GeneralTabs({ tabs, title, onTabChange }: Props) {
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].name);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    onTabChange ? onTabChange(currentTab) : null;
  }, [currentTab]);
  /*
  To add a tab:
  
  1) Create a widget/component you would like to have in overview. 
  2)  Import your widget under component imports above ^^
  3) Add an object containing: {name: <name of tab,component: <TSX or JSX component>} to the tabs list below. 

  */

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
      <div className="bg-primary shadow-lg px-5 py-2 rounded-md">
        {
          title ? (
            <span className="text-base xl:text-lg font-bold text-secondary">
              {title}
            </span>
          ) : (
            <></>
          ) /* if there is a title prop, render it as a header*/
        }
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
                  "w-full focus:outline-none ",
                  selected
                    ? " border-b-2 border-secondary text-secondary font-bold text-sm"
                    : "text-neutral hover:text-secondary/50 border-b-2 border-secondary-light font-medium text-sm"
                )
              }
            >
              <div className={` lg:text-md truncate font-bold mb-1 mx-4 `}>
                {c.name}{" "}
              </div>
            </Tab>
          ))}
        </Tab.List>
      </div>

      {/* This is overlapping 3d, please help stop it */}
      <Tab.Panels className={`h-full w-full rounded-md overflow-hidden`}>
        {tabs.map((n, index) => {
          return (
            <Tab.Panel
              key={index}
              className=" flex flex-col w-full h-full gap-6 xl:gap-0"
            >
              <div className="relative">
                <p
                  id="analytics_tab_description"
                  className="font-bold text-sm text-text"
                >
                  {n.description}
                </p>
              </div>
              <div className=" h-full relative p-3 rounded-md ">
                {n.component}
              </div>
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default GeneralTabs;

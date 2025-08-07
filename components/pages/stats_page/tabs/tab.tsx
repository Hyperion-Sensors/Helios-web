import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

import classNames from "classnames";
import Addition from "../dashboard/item_container";

/*---------------------------Types-------------------------- */
import { Addin, Item } from "@/Types/stats_types";

/*--------------------------Data----------------------------- */
import addins from "../widgets/addins.json";
import InfoCard from "@/Global/custom/info_card";

type Props = {
  addOption: (item: Item) => void;
  toggleWidgetsVisible: () => void;
  widgetsVisible: boolean;
};

function WidgetTabs({
  addOption,
  toggleWidgetsVisible,
  widgetsVisible,
}: Props) {
  const [currentTab, setCurrentTab] = useState("Temperature");
  const [elements, setElements] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  let tabs = ["Temperature", "Load", "Thermal Ratings (RTTR)", "Status"];

  useEffect(() => {
    const options = addins.addinsLayout.map((n: Addin, index) => {
      if (n.category == currentTab) {
        return (
          <Addition
            setValue={(item: React.SetStateAction<string>) => {
              addOption(n);
            }}
            key={index}
            name={n.i}
            isDateComponent={n.isDateComponent}
          />
        );
      }
    });
    setElements(options);
  }, [addOption, currentTab]);

  function handleChangeIndex(index: number) {
    if (selectedIndex == index) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  }

  return (
    <div className={`flex flex-col w-full relative`}>
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={(index) => handleChangeIndex(index)}
      >
        <Tab.List
          className={`flex flex-row w-full h-full  rounded-tr-md rounded-tl-md`}
        >
          {tabs.map((c, index) => (
            <Tab
              key={c}
              onClick={() => {
                if (widgetsVisible && currentTab != c) {
                  setCurrentTab(c);
                } else if (!widgetsVisible && currentTab != c) {
                  toggleWidgetsVisible();
                  setCurrentTab(c);
                } else {
                  toggleWidgetsVisible();
                }
              }}
              className={({ selected }) =>
                classNames(
                  "w-full text-secondary focus:outline-none ",
                  selected ? "font-bold" : "text-secondary font-medium"
                )
              }
            >
              <div
                className={`whitespace-nowrap w-full text-sm font-bold hover:border-secondary transition duration-50 ease-in-out ${
                  currentTab == c && widgetsVisible
                    ? "border-b-2 border-secondary text-secondary"
                    : "border-b-2 border-neutral-focus text-neutral-focus hover:text-secondary"
                }`}
              >
                {c}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels
          className={`${
            widgetsVisible ? "max-h-[10rem]" : "max-h-[0rem]"
          } transition-all transform ease-in-out duration-200 scrollbar overflow-x-auto overflow-y-hidden pt-2`}
        >
          {addins.addinsLayout.map((n, index) => {
            return (
              <Tab.Panel key={index}>
                <div
                  className={`w-full flex flex-row gap-1 justify-end h-full capitalize select-none`}
                >
                  {elements}
                </div>
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default WidgetTabs;

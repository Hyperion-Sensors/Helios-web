import React, { useContext } from "react";
import { Tab, Disclosure } from "@headlessui/react";
import ModellingTab from "./modelling_tab";
import OptionsTab from "./options_tab";
import { VisualizerContext } from "@/Context/visualizer_context";

type Props = {
  tabs: string[];
  // widgetsVisible: boolean;
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ControlTabs({ tabs /*widgetsVisible*/ }: Props) {
  const { setCurrentTab } = useContext(VisualizerContext);
  return (
    <>
      <Tab.Group>
        <Tab.List className={`flex w-full max-h-full mx-1 mt-4 mb-2`}>
          {tabs.map((category, index) => (
            <Tab
              key={category}
              onClick={() => setCurrentTab(index)}
              className={({ selected }) =>
                classNames(
                  "w-full p-1 text-secondary border-b-2",
                  selected
                    ? "font-bold text-md border-secondary ring-secondary ring-1"
                    : "text-neutral hover:bg-neutral hover:neutral-focus font-medium text-sm border-neutral"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels
          className={`max-h-full overflow-y-auto scrollbar overflow-x-hidden mb-2 w-full`}
        >
          <Tab.Panel
            key={1}
            className={classNames(
              "rounded-xl bg-primary",
              "ring-primary ring-opacity-60 ring-offset-2 ring-offset-secondary "
            )}
          >
            <OptionsTab />
          </Tab.Panel>

          <Tab.Panel
            key={2}
            className={classNames(
              "rounded-xl bg-primary",
              "ring-primary ring-opacity-60"
            )}
          >
            <ModellingTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default ControlTabs;

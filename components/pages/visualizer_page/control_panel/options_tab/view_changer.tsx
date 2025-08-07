import React, { useState, useContext, Fragment, useEffect } from "react";

type Props = {};

/*------------------------------Components--------------------------- */
import { Listbox, Transition } from "@headlessui/react";

/*-------------------------------Context----------------------------- */
import { VisualizerContext } from "@/Context/visualizer_context";
import TitleCard from "@/Global/custom/title_card";
import HeliosIcon from "@/Global/icons";

const views = [
  {
    name: "3D Visualizer",
    value: 1,
    // path: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
    icon_class: "3d",
    icon_type: "box",
  },
  {
    name: "2D Visualizer",
    value: 2,
    icon_class: "photo",
    icon_type: "basic",
  },
  {
    name: "Map View",
    value: 3,
    icon_class: "3d",
    icon_type: "layers",
  },
];

function ViewChanger() {
  const { currentView, setCurrentView } = useContext(VisualizerContext);
  const [selected, setSelected] = useState(views[0].name);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <Listbox.Button
        id="view_changer"
        className="flex justify-between items-center text-primary bg-secondary hover:bg-accent rounded-md p-2 shadow-lg"
      >
        <div className="text-sm whitespace-nowrap font-medium">{selected}</div>
        <div className="h-5 w-5">
          <HeliosIcon
            icon_class={"chevron"}
            icon_type={"up-down"}
            color={" group-hover:stroke-accent"}
            stroke={"stroke-1 stroke-primary"}
          />
        </div>
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 top-16 whitespace-nowrap text-secondary xl:text-md bg-primary border border-neutral shadow-md rounded-md">
        {views.map((v, index) => (
          <Listbox.Option
            className="flex justify-start hover:bg-neutral hover:text-accent py-1 px-3 group select-none cursor-pointer text-md"
            key={index}
            value={v.name}
            onClick={() => {
              setCurrentView(v.value);
            }}
          >
            <div className="h-5 w-5">
              <HeliosIcon
                icon_class={v.icon_class}
                icon_type={v.icon_type}
                color={" group-hover:stroke-accent"}
                stroke={"stroke-1 stroke-secondary"}
              />
            </div>

            <span className="ml-4 self-start ">{v.name}</span>
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}

export default ViewChanger;

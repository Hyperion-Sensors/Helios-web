/*---------------------------Library Imports----------------------------*/
import React, { useContext, useEffect, useRef } from "react";

/*---------------------------Component Imports----------------------------*/
import HeliosIcon from "@/Global/icons";
import ViewChanger from "./options_tab/view_changer";
import OptionsBox from "./options_tab/options_box";
import BoundaryInputs from "@/Global/custom/boundary_inputs";
import ControlInfo from "./options_tab/control_info";

/*-----------------------------Context Imports----------------------------- */
import { VisualizerContext } from "@/Context/visualizer_context";

type Props = {}; //no props to add

function ControlPanel({}: Props) {
  const [currentTab, setCurrentTab] = React.useState(null); // [0, 1, 2] = [Controls, Forecast, Help]
  const { tempRange, setTempRange } = useContext(VisualizerContext);
  const containerRef = useRef(null);

  /*-------------------------------Detect Mouse Clicked Outside--------------------------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current) {
        // Close all <details> elements
        const detailsElements =
          containerRef.current.querySelectorAll("details[open]");
        setCurrentTab(null); //set all icons to up

        detailsElements.forEach((details) => {
          // This allows other details to close when one is opened
          if (!details.contains(event.target)) {
            details.removeAttribute("open");
          }
        });
      }
    }

    // Attach the click event handler
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const control_tabs = ["Controls", "Forecast"];

  /*--------------------------Control Data Setup------------------------------ */
  const controls = [
    {
      name: "Controls",
      component: <OptionsBox />,
      description: null,
      icon_class: "adjustments",
      icon_type: "horizontal",
    },
    {
      name: "Temperature Limits",
      component: (
        <BoundaryInputs
          type={"temp"}
          handleChange={(range: number[]) => {
            setTempRange(range);
          }}
          range={tempRange}
        />
      ),
      description: null,
      icon_class: "thermometer",
      icon_type: "basic",
    },
    {
      name: "Help",
      component: <ControlInfo />,
      description: null,
      icon_class: "info",
      icon_type: "basic",
    },
  ];

  return (
    <div
      className={`flex flex-row items-center w-full h-full relative`}
      ref={containerRef}
    >
      <div className="flex items-center justify-between bg-primary/50 rounded-md px-3 py-[0.35rem]">
        {/* Made listbox options absolute to keep from becoming too large */}
        <ViewChanger />
        <div className="flex flex-row pl-2 ml-2 select-none bg-primary rounded-lg divide-y">
          {controls.map((tab, index) => (
            <div className="relative cursor-pointer rounded-md" key={index}>
              <details>
                <summary className="flex flex-row gap-1 p-2 bg-primary rounded-md place-items-center hover:bg-neutral transition-all duration-200  ">
                  <div className="w-5 h-5">
                    <HeliosIcon
                      icon_class={tab.icon_class}
                      icon_type={tab.icon_type}
                      color={"stroke-secondary"}
                      stroke={"stroke-2"}
                    />
                  </div>

                  <p className="text-sm">{tab.name}</p>
                  <div className="h-3 w-3">
                    <HeliosIcon
                      icon_class={"chevron"}
                      icon_type={"down"}
                      color={"stroke-secondary"}
                      stroke={"stroke-2"}
                    />
                  </div>
                </summary>

                {/*Dropdown Menu*/}
                <ul className="absolute top-12 p-2 bg-base-100 rounded-md cursor-default">
                  <li className="w-full h-full">{tab.component}</li>
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;

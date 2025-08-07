import React, { useEffect, useState, useContext } from "react";

/*--------------------------Context--------------------------*/
import { VisualizerContext } from "@/Context/visualizer_context";
import { Switch } from "@headlessui/react";

function OptionsBox() {
  const [elements, setElements] = useState([]);
  // const [optionBoxes, setOptionBoxes] = useState([]);
  const { options, changeOptions } = useContext(VisualizerContext);

  const handleOptionChange = (index: number) => {
    changeOptions({ type: "TOGGLE_OPTION", payload: index });
  };

  const resetOptions = () => {
    changeOptions({ type: "RESET_OPTIONS" });
  };

  //fires every time options in changed
  useEffect(() => {
    if (options) {
      const temp = options.map((o, index) => {
        return (
          <label
            className="flex flex-row justify-between gap-1 items-center label cursor-pointer"
            key={index}
          >
            <span className="label-text text-center text-secondary text-m">
              {o.name}
            </span>
            <Switch
              checked={o.checked}
              onChange={(e) => handleOptionChange(index)}
              className={`${o.checked ? "bg-secondary" : "bg-primary"}
          relative inline-flex h-5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 my-1`}
            >
              <span
                aria-hidden="true"
                className={`${
                  o.checked
                    ? "translate-x-[0.8rem] bg-primary"
                    : "translate-x-[0.02rem] bg-secondary"
                }
            pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </label>
        );
      });
      setElements(temp);
    }
  }, [options]);

  return (
    <div className=" flex-1 gap-1 bg-primary rounded-md items-center justify-center text-secondary">
      <div className="form-control w-full flex flex-col">{elements}</div>{" "}
      {/*render elements from state */}
    </div>
  );
}

export default OptionsBox;
// subroutine for changing the options state held in context
// const handleOptionChange = (index: number) => {
//   // const tempOptions = [...options]; //non reference, mutable in-memory during function
//   // tempOptions[index].checked = !tempOptions[index].checked; //set the options to the opposite boolean

//   // setOptions(tempOptions);

// };

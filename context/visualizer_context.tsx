import React, { useState, createContext, useRef, useReducer } from "react";

/*------------------------Type Imports----------------------------- */
import { OptionBox, CurrentFiber } from "@/Types/3d_types";
import { Action } from "@/Types/visualizer_types";

/*------------------------API Imports----------------------------- */

type VisualizerContextType = {
  onThreeD: boolean;
  setOnThreeD: (view_choice: boolean) => void;
  options: OptionBox[]; // State management for visuzlizer
  changeOptions: (action: Action) => void;
  currentTab: number;
  setCurrentTab: (new_tab: number) => void;
  currentFiber: string;
  setCurrentFiber: (name: string) => void;
  tempRange: number[];
  setTempRange: (range: number[]) => void;
  currentView: number;
  setCurrentView: (view: number) => void;
};

const VisualizerContext = createContext<VisualizerContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const VisualizerProvider: React.FC<Props> = ({ children }) => {
  //is the current asset in view on the assets menu? if not then is true
  const [onThreeD, setOnThreeD] = useState(true);

  const [currentView, setCurrentView] = useState(1);

  type OptionBox = {
    name: string;
    checked: boolean;
  };

  const initialState: OptionBox[] = [
    { name: "Model", checked: true },
    { name: "Fiber", checked: true },
    { name: "Grid", checked: true },
    { name: "Axes", checked: true },
  ];

  function reducer(state: OptionBox[], action: Action) {
    switch (action.type) {
      case "TOGGLE_OPTION":
        let tempOptions = [...state];

        // changing the options inplace at copy point
        tempOptions[action.payload] = {
          ...tempOptions[action.payload],
          checked: !tempOptions[action.payload].checked,
        };

        return tempOptions;
      case "RESET_OPTIONS":
        return initialState;
      default:
        return state;
    }
  }
  const [options, changeOptions] = useReducer(reducer, initialState);

  const [currentTab, setCurrentTab] = useState<number>(0);

  const [currentFiber, setCurrentFiber] = useState<string>("");

  const [tempRange, setTempRange] = useState<number[]>([0, 100]);

  return (
    <VisualizerContext.Provider
      value={{
        onThreeD,
        setOnThreeD,
        options,
        changeOptions,
        currentTab,
        setCurrentTab,
        currentFiber,
        setCurrentFiber,
        tempRange,
        setTempRange,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
};

export { VisualizerProvider, VisualizerContext };

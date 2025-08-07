import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

/*------------------------Type Imports----------------------------- */

/*------------------------API Imports----------------------------- */

type OverviewContextType = {
  currentTab: number;
  changeCurrentTab: (tab: number) => void;
  assetNotInView: boolean;
  changeAssetNotInView: () => void;
  currentFiber: string;
  changeCurrentFiber: (fiber: string) => void;
};

const OverviewContext = createContext<OverviewContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const OverviewProvider: React.FC<Props> = ({ children }) => {
  //is the current asset in view on the assets menu? if not then is true
  const [assetNotInView, setAssetNotInView] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<number>(0);

  const [currentFiber, setCurrentFiber] = useState(undefined);

  //set fiber of focus on 3D
  function changeCurrentFiber(fiber: string) {
    setCurrentFiber(fiber);
  }

  // change tabs for the feed component (component above map)
  function changeCurrentTab(n) {
    setCurrentTab(n);
  }

  // set weather or not the current asset is in view
  function changeAssetNotInView() {
    setAssetNotInView(!assetNotInView);
  }

  return (
    <OverviewContext.Provider
      value={{
        currentTab,
        changeCurrentTab,
        assetNotInView,
        changeAssetNotInView,
        currentFiber,
        changeCurrentFiber,
      }}
    >
      {children}
    </OverviewContext.Provider>
  );
};

export { OverviewProvider, OverviewContext };

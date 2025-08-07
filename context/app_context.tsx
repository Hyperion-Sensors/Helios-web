import React, { useState, useReducer, createContext, useEffect } from "react";
import Pages from "../components/global/navbar/navbar_data.json";
import { useSettings } from "@/Queries/settings_queries";
import { useSession } from "next-auth/react";
import { set } from "lodash";
//session import

type AppContextType = {
  currentPage: string;
  changeCurrentPage: (string: String) => void;
  liveDataOn: boolean;
  toggleLiveData: () => void;
  sidePanelVisible: boolean;
  toggleSidePanelVisible: (action: {
    type: string;
    payload: boolean | null;
  }) => void;
  latestTimes: any;
  setLatestTimes: (times: any) => void;
  sidePanelButtonVisible: boolean;
  setSidePanelButtonVisible: (toggle: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const AppProvider: React.FC<Props> = ({ children }) => {
  //get settings from session
  const { data: session } = useSession();
  // //get settings data from db
  const { data: settingsData } = useSettings(session.user.id);

  const [currentPage, setCurrentPage] = useState<string>(
    Pages["main-pages"][0].title
  );
  const [latestTimes, setLatestTimes] = useState<any>(null);

  const [liveDataOn, toggleLiveData] = useReducer((state) => {
    //handles visibility state of widgets using !state dispatch function
    return !state;
  }, true);
  const changeCurrentPage = (page: string) => {
    setCurrentPage(page);
  };

  /*-----------------Side Panel Default Set------------------- */
  useEffect(() => {
    //detect when settingsData is populated, and set the default side-panel-state
    if (settingsData) {
      toggleSidePanelVisible({
        type: "set",
        payload: settingsData.general["Side_Panel_Default"],
      });
    }
  }, [settingsData]);

  const [sidePanelVisible, toggleSidePanelVisible] = useReducer(
    (state, action: { type: string; payload: boolean | null }) => {
      switch (action.type) {
        case "toggle":
          return !state;
        case "set":
          return action.payload;
      }
    },
    settingsData ? settingsData.general["Side_Panel_Default"] : true //default as true in case of settings lag
  );

  //for pages where side panel is not visible, need to disable the button in the navbar (bars/hamburger icon)
  const [sidePanelButtonVisible, setSidePanelButtonVisible] = useState(true);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        changeCurrentPage,
        liveDataOn,
        toggleLiveData,
        sidePanelVisible,
        toggleSidePanelVisible,
        latestTimes,
        setLatestTimes,
        sidePanelButtonVisible,
        setSidePanelButtonVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };

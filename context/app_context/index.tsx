import React, { useState, useReducer, createContext, useEffect } from "react";

type AppContextType = {
  currentPage: string;
  changeCurrentPage: (string: String) => void;
  liveDataOn: boolean;
  toggleLiveData: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const AppProvider: React.FC<Props> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [liveDataOn, toggleLiveData] = useReducer((state) => {
    //handles visibility state of widgets using !state dispatch function
    return !state;
  }, true);
  const [totalDevicesm, setTotalDevices] = useState<number>(0);
  const changeCurrentPage = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        changeCurrentPage,
        liveDataOn,
        toggleLiveData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };

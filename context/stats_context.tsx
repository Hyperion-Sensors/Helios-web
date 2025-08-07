import React, { useState, createContext, useReducer } from "react";

/*-----------------------------Library Imports---------------------------------- */
import { subDays, format } from "date-fns";

type StatsContextType = {
  selectedDateRange: { startDate: string; endDate: string };
  setSelectedDateRange: (new_date_range: {
    startDate: string;
    endDate: string;
  }) => void;
  dateLockedWidgets: {};
  setDateLockedWidgets: (new_date_locked_widgets: {}) => void;
  widgetsDraggable: boolean;
  toggleWidgetsDraggable: () => void;
};

const StatsContext = createContext<StatsContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const StatsProvider: React.FC<Props> = ({ children }) => {
  //state of dashboard global date range
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // for storing the widgets that are date locked
  const [dateLockedWidgets, setDateLockedWidgets] = useState([]);

  // for toggling the moveability of widgets to opposite of current state
  const [widgetsDraggable, toggleWidgetsDraggable] = useReducer(
    // reducer function
    (widgetsDraggable) => {
      return !widgetsDraggable;
    },
    // initial state
    true,
    // initial state function
    () => {
      let storageSetting = localStorage.getItem("widgetsDraggable");

      if (!storageSetting) {
        return false;
      }

      if (storageSetting.toLowerCase() == "false") {
        return false;
      }

      return true;
    }
  );

  return (
    <StatsContext.Provider
      value={{
        selectedDateRange,
        setSelectedDateRange,
        dateLockedWidgets,
        setDateLockedWidgets,
        widgetsDraggable,
        toggleWidgetsDraggable,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export { StatsProvider, StatsContext };

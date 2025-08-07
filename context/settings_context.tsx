import React, { useState, useReducer, createContext, useEffect } from "react";
//session import
import { settings, settings_action } from "@/Types/settings_types";
import settings_config from "@/Settings/settings_config.json";

type SettingsContextType = {
  settings: settings;
  updateSettings: (action: settings_action) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const SettingsProvider: React.FC<Props> = ({ children }) => {
  function settingsReducer(state, action: settings_action) {
    const saved_settings = state;
    const action_type = action.type;
    const setting_type = action.payload.settings_type;
    const settings_change = action.payload.settings_change;

    if (action_type === "update") {
      return {
        ...saved_settings,
        [setting_type]: { ...saved_settings[setting_type], ...settings_change },
      };
    }
    if (action_type === "reset") {
      return {
        ...saved_settings,
        ...settings_change,
      };
    }
  }

  const [settings, updateSettings] = useReducer(settingsReducer, undefined);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };

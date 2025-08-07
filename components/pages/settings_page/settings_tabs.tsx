/*---------------------------------------Library------------------------------------- */
import React, { useContext, useEffect, useReducer } from "react";

/*-------------------------------------Components------------------------------------- */
import GeneralTabs from "@/Global/misc/general_tabs";
import GetTypedSettings from "./setting_tabs_logic/get_typed_settings";
import settings_config from "@/Settings/settings_config.json";
import { parseWord } from "@/Helpers/text_helper";
import { useSettings } from "@/Queries/settings_queries";

/*-------------------------------------Context------------------------------------- */
import { SettingsContext } from "@/Context/settings_context";

/*---------------------------------------Types---------------------------------------- */
import { settings_tab, settings_row } from "@/Types/settings_types";
import { change_multiple_settings } from "@/API/settings_services";
import queryClient from "@/Queries/index";
import { useSession } from "next-auth/react";

/*
Function: SettingsTabs

Purpose: Parent component of GetTypedSettings (list of setting components) under each setting tab. 

Called by: components/settings_page/settings_page.tsx
*/
function SettingsTabs() {
  const { settings, updateSettings } = useContext(SettingsContext);

  const [currentTab, setCurrentTab] = useReducer(
    (state: string, newTab: string) => newTab,
    "general"
  );
  const { data: session } = useSession();
  const { data: settings_data } = useSettings(session.user.id);

  useEffect(() => {
    updateSettings({
      type: "reset",
      payload: { settings_type: null, settings_change: settings_data },
    });
  }, [settings_data]);

  const saveSettings = () => {
    change_multiple_settings(
      currentTab.toLowerCase().replace(/ /g, "-"),
      settings[currentTab.toLowerCase().replace(/ /g, "_")],
      session.user.id
    );
    queryClient.invalidateQueries({ queryKey: ["user_settings"] });
  };

  return (
    <GeneralTabs
      tabs={settings_config.tabs.map((n: settings_tab, index: number) => {
        return {
          name: parseWord(n.name),
          component: (
            <div
              className="form-control w-full h-full flex items-center  
            transition delay-150 ease-in-out"
            >
              <GetTypedSettings settings_data={n} settings_name={n.name} />
              <button
                className="btn btn-secondary hover:btn-success w-20 self-end"
                onClick={() => saveSettings()}
              >
                Save
              </button>
            </div>
          ),
          description: n.description,
        };
      })}
      title={"Settings"}
      onTabChange={(tab_name) => setCurrentTab(tab_name)}
    />
  );
}

export default SettingsTabs;

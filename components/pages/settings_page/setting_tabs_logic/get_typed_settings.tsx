import { useContext, useEffect } from "react";

/*---------------------------------------Types------------------------------------- */
import { settings } from "@/Types/settings_types";
/*---------------------------------------Context------------------------------------- */
import { SettingsContext } from "@/Context/settings_context";
/*---------------------------------------Hooks and Components------------------------------------- */
import MessageScreen from "@/Global/layout/message_screen";
import { parseWord } from "@/Helpers/text_helper";
import SettingsComponentGenerator from "@/Settings/setting_tabs_logic/settings_component_generator";

/*
Function: GetTypedSettings

Returns a list of settings components to be added to one form control.
*/
type Props = {
  settings_data: any;
  settings_name: string;
};

export default function GetTypedSettings({
  settings_data,
  settings_name,
}: Props) {
  const { settings } = useContext(SettingsContext);

  if (!settings) return <div>No Settings Found</div>;

  if (
    settings &&
    settings.general != undefined &&
    settings_data.no_access == false
  ) {
    return settings_data.settings.map((n, index) => {
      return (
        <label
          key={index}
          className="label border-t hover:border-b border-neutral hover:border-accent transition ease-in hover:grow-1 hover:duration-150 w-full h-14 "
        >
          <div className="flex flex-col w-2/5">
            <div className="label-text font-bold ">{parseWord(n.name)}</div>
            <p className="text-xs">{n.description}</p>
          </div>

          {/* <input type="checkbox" checked={false} className="checkbox" /> */}
          <div className="w-full h-full flex justify-end">
            <SettingsComponentGenerator
              setting_type={settings_name}
              setting_name={n.name}
              active_data={settings[settings_data.name][n.name]}
              setting_component_type={n.type}
              default_list_data={n.list}
              default_static_data={n.static}
            />
          </div>
        </label>
      );
    });
  } else {
    return (
      <MessageScreen
        message={"No settings with your access level were found"}
        image={"/photon.gif"}
      />
    );
  }
}

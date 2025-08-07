/*--------------------------------Libraries---------------------------------- */
import { useContext, useEffect } from "react";

/*--------------------------------Components---------------------------------- */
import SettingsMultiSelect from "@/Settings/settings-multi-select";

/*--------------------------------Context---------------------------------- */
import { SettingsContext } from "@/Context/settings_context";

type Props = {
  setting_type: string;
  setting_name: string;
  setting_component_type: string | null;
  active_data: number[] | string[] | boolean | string | number | boolean | null;
  default_list_data?: number[] | string[] | null;
  default_static_data?: string | number | boolean | null;
};

function SettingsComponentGenerator({
  setting_type,
  setting_name,
  setting_component_type,
  active_data,
  default_list_data,
  default_static_data,
}: Props) {
  const { updateSettings } = useContext(SettingsContext);

  /*
    Parent: SettingsComponentGenerator
    Function: updateCachedSettings
    Purpose: Calls the updateSettings function from SettingsContext. 
  */
  function updateCachedSettings(setting_type: string, new_data: any) {
    updateSettings({
      type: "update",
      payload: {
        settings_type: setting_type,
        settings_change: { [setting_name]: new_data },
      },
    });
  }

  if (setting_component_type == null) {
    return <div>Setting currently in development</div>;
  }

  /*
  The switch case below checks the type of settings component to be rendered and returns the appropriate component.
  */
  switch (setting_component_type) {
    case "check":
      return (
        <input
          type="checkbox"
          className="checkbox checkbox-secondary"
          defaultChecked={typeof active_data == "boolean" ? active_data : false}
          onChange={(event) =>
            updateCachedSettings(setting_type, event.target.checked)
          }
        />
      );
    case "select":
      return (
        <select
          className="select select-sm"
          defaultValue={typeof active_data == "string" ? active_data : ""}
          onChange={(event) =>
            updateCachedSettings(setting_type, event.target.value)
          }
        >
          {default_list_data != null ? (
            default_list_data.map((n: string | number, index: number) => (
              <option key={index}>{n}</option>
            ))
          ) : (
            <option>N/A</option>
          )}
        </select>
      );
    case "multi-select":
      return (
        <SettingsMultiSelect
          default_list_data={default_list_data}
          active_list_data={Array.isArray(active_data) ? active_data : []}
          handle_change={(new_data: string[] | number[]) =>
            updateCachedSettings(setting_type, new_data)
          }
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="input input-bordered input-small h-full"
          defaultValue={typeof active_data == "number" ? active_data : ""}
          onChange={(event) =>
            updateCachedSettings(setting_type, event.target.value)
          }
        />
      );

    default:
      return <div>Setting currently in development</div>;
  }
}

export default SettingsComponentGenerator;

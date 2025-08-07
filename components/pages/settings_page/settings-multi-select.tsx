/*--------------------------------Libraries---------------------------------- */
import React, { useEffect, useReducer, useRef } from "react";

/*--------------------------------Components---------------------------------- */
import { MultiSelect } from "../../global/misc/multi-select";
import useAssets from "../../../hooks/queries/asset_queries";

/*--------------------------------Hooks---------------------------------- */
import { parseWord } from "@/Helpers/text_helper";
import { Asset } from "@/Types/asset_types";
import { act } from "@react-three/fiber";
import { uniqueId } from "lodash";
import HeliosIcon from "@/Global/icons";

type Props = {
  default_list_data?: number[] | string[] | null;
  active_list_data?: number[] | string[] | null;
  handle_change: (new_data: string[] | number[]) => void; //drilling this into the component for state change
  clear?: boolean | null;
};

function SettingsMultiSelect({
  default_list_data,
  active_list_data,
  handle_change,
  clear,
}: Props) {
  const { data: assets } = useAssets();

  useEffect(() => {
    handle_change(active_list_data);
  }, [active_list_data]);

  /*GET asset data from react-query-client */
  let select_component;

  /*----------------------------Multi-Select Generator------------------------------------------------------

Purpose:"Component that checks the first element of default_list_data and renders the appropriate component"

To add to this:
1. Add a case to the switch statement based on the first element of default_list_data for example (['assets'])
2. Create a component that will be rendered with fetched data for this case
3. Add the component to the return statement

For example, if I want a multi-select for tfits, I would do the following:

      case "tfits": // if default_list_data[0] == "tfits"
        select_component = (
          <MultiSelect
            title={default_list_data[0]}
            data={devices.map((n: Asset) =>
              n.name.replace(/_/g, " ")
            )} 
            default_data={active_list_data}
          />
        );
        break;
----------------------------------------------------------------------------------*/

  if (default_list_data != null && default_list_data != undefined) {
    switch (default_list_data[0]) {
      case "assets": // if default_list_data[0] == "assets"
        select_component = (
          <MultiSelect
            title={default_list_data[0]}
            data={assets.map((n: Asset) =>
              n.name.replace(/_/g, " ")
            )} /*Because the first elements was called "assets", use assets from query client */
            default_data={active_list_data}
            optLogic={(data) => {
              handle_change(data);
            }}
            clear={clear}
          />
        );
        break;
      case "default":
        select_component = (
          <MultiSelect title={default_list_data[0]} data={default_list_data} />
        );
    }
  } else {
    select_component = <MultiSelect title="assets" data={[]} />;
  }
  /*-----------------------------------------------------------------------------------*/

  return (
    <div className="flex w-full justify-between items-center truncate">
      <div id={String(uniqueId)} className="h-full w-full overflow-y-auto">
        {active_list_data != null && active_list_data.length > 0 ? (
          <div className="flex flex-row flex-wrap justify-start  gap-2 m-1 truncate h-max">
            {active_list_data.map((item, index) => (
              <div
                className="inline-flex text-xs text-primary bg-info rounded-md shadow-lg p-0.5 hover:scale-110 transition ease-out hover:ease-in duration-300 w-18 truncate"
                key={index}
              >
                <span>{parseWord(item)}</span>
                {/* <button className="btn btn-circle ">
                  <HeliosIcon
                    icon_class={"x"}
                    icon_type={""}
                    color={""}
                    stroke={"stroke-primary"}
                  />
                </button> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="p-3 text-info text-sm font-bold">None Selected</p>
        )}
      </div>
      {select_component}
    </div>
  );
}

export default SettingsMultiSelect;

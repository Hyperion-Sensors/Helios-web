import React, { useEffect, useReducer, useState } from "react";
import DateRanger from "@/Global/charts/add-ons/date-ranger";
import useAssets from "@/Queries/asset_queries";
import { format } from "date-fns";
import SettingsMultiSelect from "@/Settings/settings-multi-select";
import Select from "@/Global/misc/select";
import HeliosIcon from "@/Global/icons";
import InfoCard from "@/Global/custom/info_card";
import {
  downloadAssetTemps,
  downloadFiberTemps,
  downloadAssetInfo,
  downloadSystemInfo,
} from "@/Hooks/endpoints/file_services";
import { MultiSelect } from "@/Global/misc/multi-select";
import { useSettings } from "@/Queries/settings_queries";
import { useSession } from "next-auth/react";
const initialState = {
  dataTypeSelected: false,
  assetsSelected: false,
  showDownloadButton: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "SELECT_DATA_TYPE":
      return { ...state, dataTypeSelected: true };
    case "SELECT_ASSETS":
      return { ...state, assetsSelected: true };
    case "SHOW_DOWNLOAD_BUTTON":
      return { ...state, showDownloadButton: true };
    case "RESET_ASSETS":
      return { ...state, assetsSelected: false };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

export default function DownloadPage() {
  /*-------------------------------------Hooks-----------------------------------*/

  const [selectedDates, setSelectedDates] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [downloadState, dispatch] = useReducer(reducer, initialState);
  const [downloadType, setDownloadType] = useState({
    key: "",
    name: "",
    assets_required: false,
    dates_required: false,
    endpoint: () => {},
  });
  const [activeAssets, setActiveAssets] = useState([]);
  const { data: session } = useSession();
  const { data: assetData, isLoading: assetsIsLoading } = useAssets();
  const { data: settingsData } = useSettings(session.user.id);
  useEffect(() => {
    console.log("downType", activeAssets);
  }, [downloadType]);

  useEffect(() => {
    if (activeAssets.length > 0) {
      dispatch({ type: "SELECT_ASSETS" });
    } else {
      dispatch({ type: "RESET_ASSETS" });
    }
  }, [activeAssets, downloadType]);
  /*-------------------------------------Handle Select All-----------------------------------*/
  const handleSelectAll = () => {
    setActiveAssets(assetData.map((n) => n.name));
  };

  /*-------------------------------------Handle Submit-----------------------------------*/
  const IMPERIAL = settingsData // are the user settings units imperial or metric? F or C?
    ? settingsData.data_options.Unit_System == "imperial"
    : false;

  const downloadTypes = [
    {
      key: "asset-info",
      name: "Asset Information List (all monitored assets)",
      assets_required: false,
    },
    {
      key: "systems-summary",
      name: "System Information List  (all tFIT systems)",
      assets_required: false,
    },
    {
      key: "asset-temps",
      name: `Avg Asset Temperature ${IMPERIAL ? "(F)" : "(C)"}`,
      assets_required: true,
    },
    {
      key: "fiber-temps",
      name: `Avg Sensor Zone Temperatures ${IMPERIAL ? "(F)" : "(C)"}`,
      assets_required: true,
    },
  ];

  type body = {
    asset_names: string[];
    start_date: string;
    end_date: string;
    imperial: boolean;
  };
  const submitServices = {
    "asset-info": () => downloadAssetInfo(),
    "asset-temps": (
      bodyData = {
        asset_names: activeAssets,
        start_date: selectedDates.startDate,
        end_date: selectedDates.endDate,
        imperial: settingsData.data_options.Unit_System == "imperial",
      }
    ) => downloadAssetTemps(bodyData),
    "fiber-temps": (
      bodyData = {
        asset_names: activeAssets,
        start_date: selectedDates.startDate,
        end_date: selectedDates.endDate,
        imperial: settingsData.data_options.Unit_System == "imperial",
      }
    ) => downloadFiberTemps(bodyData),
    "systems-summary": () => downloadSystemInfo(),
  };

  const handleSubmit = async () => {
    const status = await submitServices[downloadType.key]();
    if (!status) {
      alert("No data available for selected options");
    }
  };

  /*-----------------------------------Handle Download Type-----------------------------------*/
  const handleDownloadTypeChange = (type) => {
    dispatch({ type: "RESET_ALL" });
    console.log(type);
    setDownloadType(type);
    if (type.assets_required) {
      dispatch({ type: "SELECT_DATA_TYPE" });
    } else {
      dispatch({ type: "SHOW_DOWNLOAD_BUTTON" });
    }
  };

  /*-------------------------------------Styling for Render-----------------------------------*/

  const ROW_STYLES = "flex flex-row w-full h-min justify-between";
  const HEADER_STYLES = "font-semibold xl:text-lg  text-text";
  const BOX_STYLES =
    " flex flex-col bg-primary border-2 rounded-md hover:border-2-focus border-secondary p-3 w-full ";

  /*-------------------------------------Main Render-----------------------------------*/

  return (
    <div className="w-full h-full flex flex-col gap-6 items-center">
      {/* <h1 className={`text-xl font-bold `}>Downloads</h1> */}

      <div className="flex flex-col w-1/2 h-full gap-6 overflow-y-auto">
        {/* -----------------------Download Type Selection ----------------------*/}
        <div className={`${BOX_STYLES}`}>
          <div className="flex">
            {" "}
            <h1 className={`${HEADER_STYLES} `}>Download Type </h1>
            <div className="h-2 w-2 xl:h-4 xl:w-4 ">
              <InfoCard
                title={"Select From Downloadable Data Types"}
                description={
                  "Select the type of information you would like to download. Depending on your choice, there may be further steps to take before a download can be accomplished"
                }
                card_styles={
                  " p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-50 bg-primary rounded-md shadow-lg top-5 left-0 align-center border-2"
                }
              />
            </div>
          </div>
          <div className={`${ROW_STYLES} justify-center`}>
            <Select
              title={"Download types"}
              data={downloadTypes}
              optLogic={(n) => {
                handleDownloadTypeChange(n);
              }}
            />
          </div>
        </div>

        {/* -----------------------Asset SELECTION ROW ----------------------*/}
        <div
          className={` ${
            downloadState.dataTypeSelected ? "block" : "hidden"
          } ${BOX_STYLES} relative`} //relative for clear button
        >
          <div className="flex items-center justify-between">
            <h1 className={`${HEADER_STYLES}`}>Select Assets</h1>
          </div>

          <div className={`${ROW_STYLES} `}>
            <div className="flex flex-col justify-start items-center  hover:border-secondary/50 gap-3 w-full ">
              {/* SELECT ALL ASSETS BUTTON */}
              {assetData ? (
                <SettingsMultiSelect
                  default_list_data={["assets"]}
                  active_list_data={activeAssets}
                  handle_change={setActiveAssets}
                  clear={true}
                />
              ) : (
                <>Loading</>
              )}
              <p className=" font-bold whitespace-nowrap min-0-fit"> - OR - </p>

              <button
                className="bg-secondary hover:bg-secondary-focus border text-md text-primary font-medium text-center p-2 min-w-fit rounded-md border-1 hover:border-success"
                onClick={handleSelectAll}
              >
                Select All
              </button>
            </div>
          </div>
        </div>
        {/* -----------------------DATE SELECTION ROW ----------------------*/}
        <div
          className={`${
            downloadState.dataTypeSelected ? "block" : "hidden"
          } ${BOX_STYLES} relative`}
        >
          <div className="flex flex-row justify-start items-center hover:border-secondary/50 gap-6">
            <h1 className={`${HEADER_STYLES}`}>Choose date range</h1>
          </div>

          <div className={`${ROW_STYLES}`}>
            <DateRanger
              changeDates={(dates) => {
                setSelectedDates(dates);
              }}
              selectedDates={selectedDates}
              form={true}
            />
          </div>
        </div>
        {/* -----------------------Submit Button ----------------------*/}
        <label
          className={`${
            (downloadState.dataTypeSelected && downloadState.assetsSelected) ||
            downloadState.showDownloadButton
              ? "block"
              : "hidden"
          } flex self-center m-10  bg-neutral border-2 hover:border-neutral-focus rounded-md  w-max"`}
          htmlFor="upload-button"
        >
          {/* <button
            className="bg-primary hover:bg-primary-focus text-md text-secondary font-medium text-center place-self-center w-full h-full px-2 rounded-sm"
            onClick={handleSubmit}
          >
            {"Download File"}
          </button> */}
          <button
            className="flex justify-around gap-6 group items-center bg-secondary hover:bg-secondary-focus border text-md text-primary font-medium text-center p-2 min-w-fit rounded-md border-1 hover:border-success"
            onClick={() => {
              handleSubmit();
            }}
          >
            <p className="group-hover:text-success">{"Download File"}</p>
            <div className="w-5 h-5">
              <HeliosIcon
                icon_class={"inbox"}
                icon_type={"arrow-down"}
                color={""}
                stroke={"stroke-2 stroke-primary group-hover:stroke-success"}
              />
            </div>
          </button>
        </label>
      </div>
    </div>
  );
}

// /*-------------------------------------Handle Submit-----------------------------------*/
// const handleSubmit = () => {
//   let selectedAssets = [];
//   console.log("submitting");
//   for (let i = 0; i < checkedState.length; i++) {
//     if (checkedState[i]) {
//       selectedAssets.push(assetChecklist[i].key);
//     }
//   }
//   // DO STUFF WITH THE DATA HERE
//   console.log(selectedAssets);
//   console.log(selectedDates);
// };
/*-------------------------------Handle Checkbox Updates-------------------------------*/

// const handleCheckboxChange = (position) => {
//   const updatedCheckedState = checkedState.map((item, index) =>
//     index == position ? !item : item
//   );
//   setCheckedState(updatedCheckedState);
// };
/*-------------------------------------EFFECT > when assetData changes-----------------------------------*/
// Doing this after the other useEffect so that the checkedState array is actually loaded
// useEffect(() => {
//   setAssetChecklist(
//     assetData?.map((n, index) => {
//       return (
//         <div className="flex flex-row" key={n.id}>
//           <input
//             className="mr-2"
//             type="checkbox"
//             checked={checkedState[index]}
//             onChange={() => handleCheckboxChange(index)}
//           />
//           <p className="justify-self-center">{n.name}</p>
//         </div>
//       );
//     })
//   );
// }, [checkedState]);
// /*-------------------------------------EFFECT > when assetData changes-----------------------------------*/
// // Creates the array to hold state for checkboxes
// useEffect(() => {
//   setCheckedState(new Array(assetData?.length).fill(false));
// }, [assetData]);

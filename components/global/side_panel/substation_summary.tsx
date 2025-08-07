import React, { useContext, useState, useEffect } from "react";
import { AssetContext } from "@/Context/asset_context";

/*------------------------------------Library Imports------------------------------------- */
import { isEmpty } from "lodash";

/*------------------------------------API Imports------------------------------------- */
import useAssets, { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import { get_device_status } from "hooks/endpoints/device_services";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";

/*--------------------------------Custom Hook Imports------------------------------------ */
import { convertToFahrenheit } from "@/Helpers/unit_helper";
import Divider from "../custom/divider";
import useProblemFibers from "@/Queries/device_queries";
import { fi } from "date-fns/locale";

type Props = { problemData: any };

async function get_substation_status(tfit_id: number) {
  try {
    const result = get_device_status(tfit_id);
    return result;
  } catch (e) {
    console.log(e);
  }
}

function SubstationSummary() {
  const [max, setMax] = useState(0);
  const [problemAssetsNumber, setProblemAssetsNumber] = useState(0);
  const { currentAsset } = useContext(AssetContext);
  const [status, setStatus] = useState<any>({});
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);

  /*------------------------------------ API Queries------------------------------------ */
  const { data: fiberTemperatureData, isLoading: isFiberLoading } =
    useAssetFiberTemperatures(currentAsset.id);

  const { data: problemFibers } = useProblemFibers();
  const { data: assetData } = useAssets();

  useEffect(() => {
    const getStatus = async () => {
      const response = await get_substation_status(currentAsset.tfit_id);
      setStatus(response.data);
    };

    if (
      !isFiberLoading &&
      fiberTemperatureData?.data?.fiber_data &&
      !isEmpty(fiberTemperatureData.data)
    ) {
      setMax(
        fiberTemperatureData.data.fiber_data[
          fiberTemperatureData.data.max_fiber_id
        ].max
      );
    }

    getStatus();
  }, [currentAsset, fiberTemperatureData]);

  /*-------------------------------Process GET /problem-fibers data -------------------------------- 
      
    Purpose: Count the number of problem assets in problemFibers array 
    
    Schema Format of problemFibers: [assetNumber1: {fiber_count: <number>},assetNumber1: {fiber_count: <number>}, ...]
  
  */

  useEffect(() => {
    if (problemFibers) {
      setProblemAssetsNumber(0); //reset problem assets to 0 if refreshed, then process the data again

      //format the problemFibers into JSON object using asset_id as key
      const processedProblemFibers = problemFibers.reduce((acc, curr) => {
        acc[curr.asset_id] = { fiber_count: parseInt(curr.fiber_count, 10) };
        return acc;
      }, {});

      //filter the assets according to current device
      const filteredArray = assetData?.filter(
        (entry) => entry.device === currentAsset.device
      );

      //count the number of problem assets
      filteredArray.forEach((entry) => {
        if (processedProblemFibers[entry.id].fiber_count > 0) {
          setProblemAssetsNumber(problemAssetsNumber + 1);
        }
      });
    }
  }, [problemFibers, assetData, currentAsset]);

  return status.length > 0 ? (
    <>
      <Divider
        title="System"
        besideContent={
          <span
            className={` text-xs w-full font-bold rounded-full text-center border-2 px-2 ${
              max > 40
                ? max > 70
                  ? "border-error/40"
                  : "border-warning/40"
                : "border-success/30"
            }`}
          >
            {max >= 40 ? (max > 70 ? "Hot" : "Warm") : " Normal"}
          </span>
        }
      />

      <div className="mx-2 rounded-sm h-full bg-primary  ">
        <table className="text-sm text-center h-3/4  text-secondary w-full ">
          <tbody>
            <tr
              id="substation-assets-row"
              className="border-b-2 border-secondary/10"
            >
              <td className=" border-secondary/50  font-bold  text-start text-text">
                Assets
              </td>
              <td className=" border-secondary/50  text-end pr-2 ">
                <span>{1}</span>{" "}
                {/* TEMPORARY CHANGE - NEEDS TO GET UPDATED ASSET COUNT FROM SUBSTATION */}
              </td>
            </tr>
            <tr
              id="substation-problem-asset-row"
              className="border-b-2 border-secondary/10"
            >
              <td className=" border-secondary/50  font-bold  text-start text-text">
                Problem Asset(s)
              </td>
              <td className=" border-secondary/50  text-end pr-2 ">
                <span>{problemAssetsNumber}</span>
              </td>
            </tr>

            <tr id="substation-max-temp-row">
              <td className="  font-bold  text-start text-text ">
                {settingsData.data_options.Unit_System == "imperial"
                  ? "Max Temp (\u00b0F)"
                  : "Max Temp (\u00b0C)"}
              </td>
              <td className="text-end">
                {isFiberLoading || !max ? (
                  <span className="loading loading-dots loading-md text-secondary"></span>
                ) : settingsData.data_options.Unit_System == "imperial" ? (
                  Math.round(convertToFahrenheit(max) * 10) / 10
                ) : (
                  Math.round(max * 10) / 10
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <span className="place-self-center loading loading-spinner loading-lg text-secondary"></span>
  );
}
<div
  className={`flex  gap-4 w-full `} //if the "Capacity" option in context is false, hide this element
></div>;
export default SubstationSummary;

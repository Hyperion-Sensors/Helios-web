import React, { useContext, useState, useEffect } from "react";

/*------------------------------------Custom Imports------------------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*------------------------------------Library Imports------------------------------------- */
import Gradient from "javascript-color-gradient";
import RadialChart from "@/Global/charts/radial_chart";
import { concat } from "lodash";

import {
  useAssetCapacity,
  useAssetFiberTemperatures,
} from "@/Queries/asset_queries";
import { useSettings } from "@/Queries/settings_queries";
import { useSession } from "next-auth/react";

/*--------------------------------Custom Hook Imports------------------------------------ */
import { convertToFahrenheit } from "@/Helpers/unit_helper";
import Divider from "../custom/divider";
import useProblemFibers from "@/Queries/device_queries";

function AssetSummary() {
  const [max, setMax] = useState(0);
  const [problemData, setProblemData] = useState([]);
  const { data: session } = useSession();
  const [capacity, setCapacity] = useState(0);
  const { currentAsset } = useContext(AssetContext);

  /*------------------------------------ API Queries------------------------------------ */
  const { data: fiberTemperatureData, isLoading: isFiberLoading } =
    useAssetFiberTemperatures(currentAsset.id);
  const { data: capacityData, isLoading: isCapacityLoading } =
    useAssetCapacity();

  const { data: problemFibers } = useProblemFibers(); // for HOT Zones number

  const { data: settingsData } = useSettings(session.user.id);

  /*-------------------------------Process FiberTemps data -------------------------------- */
  useEffect(() => {
    if (
      fiberTemperatureData != undefined &&
      fiberTemperatureData.data.fiber_data != undefined && // prevent error when fiberTemps.fiber_data is undefined
      fiberTemperatureData.data.fiber_data[
        fiberTemperatureData.data.max_fiber_id
      ] != undefined
    ) {
      setMax(
        fiberTemperatureData.data.fiber_data[
          fiberTemperatureData.data.max_fiber_id
        ].max
      );
    }
  }, [currentAsset, fiberTemperatureData]);

  /*-------------------------------Process GET /problem-fibers data -------------------------------- */
  useEffect(() => {
    if (problemFibers) {
      const temp = problemFibers.reduce((acc, curr) => {
        acc[curr.asset_id] = { fiber_count: parseInt(curr.fiber_count, 10) };
        return acc;
      }, {});
      setProblemData(temp);
    }
  }, [problemFibers]);

  /*-------------------------------Process GET /capacity-------------------------------- */
  useEffect(() => {
    if (!isCapacityLoading && capacityData) {
      setCapacity(Math.round(capacityData.data[currentAsset.name]));
    }
  }, [currentAsset, capacityData]);

  return currentAsset ? (
    <>
      <Divider
        title="Asset"
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
      <div className="mx-2 rounded-sm h-full bg-primary overflow-y-auto">
        <table className="table-auto text-sm h-full text-center text-secondary w-full ">
          <tbody>
            <tr className="border-b-2 border-secondary/10">
              <td className="font-bold  text-start text-text">Region</td>
              <td className="pr-2 text-end  "> {currentAsset.region} </td>
            </tr>
            <tr id="max-temp-row" className="border-b-2 border-secondary/10">
              <td className="  font-bold  text-start text-text">
                {settingsData?.data_options.Unit_System == "imperial"
                  ? "Max Temp (\u00b0F)"
                  : "Max Temp (\u00b0C)"}
              </td>
              <td className="pr-2   text-end  ">
                {isFiberLoading || !max ? (
                  <span className="loading loading-dots loading-md text-secondary"></span>
                ) : settingsData?.data_options.Unit_System == "imperial" ? (
                  Math.round(convertToFahrenheit(max) * 10) / 10
                ) : (
                  Math.round(max * 10) / 10
                )}
              </td>
            </tr>
            <tr id="max-temp-row" className="border-b-2 border-secondary/10">
              <td className="  font-bold  text-start text-text">Hot Zones</td>
              <td className="pr-2   text-end  ">
                {problemData[currentAsset.id]
                  ? problemData[currentAsset.id].fiber_count
                  : 0}
              </td>
            </tr>
            <tr>
              <td className=" border-secondary/50  font-bold  text-start text-text">
                RTTR
              </td>
              <td className="flex justify-end items-center h-full border-secondary/50  text-end  pr-2">
                {isCapacityLoading || !capacity ? (
                  <span className="loading loading-dots loading-md text-secondary"></span>
                ) : (
                  <div className="h-12 w-12">
                    <RadialChart
                      value={Math.round(capacity)}
                      unit={"%"}
                      type={""}
                      maxVal={100}
                      size={60}
                      guage={false}
                    />
                  </div>
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
export default AssetSummary;

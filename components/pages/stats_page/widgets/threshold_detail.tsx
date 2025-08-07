import React, { useState, useContext, useEffect, useMemo } from "react";

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";

import { get_aggregate } from "hooks/endpoints/temperature_services";
import RecentThresholdChart from "@/Global/charts/recent_threshold";

import { useAssetCapacity } from "@/Queries/asset_queries";

import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

function ThresholdDetail() {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  // const isImperial = settingsData.data_options.Unit_System == "imperial";

  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);

  const { currentAsset } = useContext(AssetContext);

  const [currentMax, setCurrentMax] = useState(0);
  const [status, setStatus] = useState("OK");
  const [action, setAction] = useState("Asset operating normally");
  const [color, setColor] = useState("text-success");

  const { data: capacityData, isLoading: isCapacityLoading } =
    useAssetCapacity();

  useEffect(() => {
    const data = async () => {
      // Add in custom route later
      const result = await get_aggregate("1 hour", 1, currentAsset.id);

      if (result != null && result.data.length > 0) {
        let max_temp = result.data[0].max;

        if (isImperial) {
          max_temp = convertToFahrenheit(max_temp);
        }

        setCurrentMax(max_temp);
      }
    };

    const statusInfo = () => {
      let cap = capacityData.data[currentAsset.name];
      if (cap > 50 && cap < 75) {
        setStatus("Near Danger");
        setAction("Asset operating normally");
        setColor("text-success");
      } else if (cap >= 75 && cap <= 100) {
        setStatus("Danger");
        setAction("Asset requires attention");
        setColor("text-warning");
      } else if (cap > 100) {
        setStatus("Above Threshold");
        setAction("Asset is at risk");
        setColor("text-error");
      } else {
        setStatus("OK");
        setAction("Asset operating normally");
        setColor("text-success");
      }
    };

    data();
    if (!isCapacityLoading && capacityData) {
      statusInfo();
    }
  }, [currentAsset]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="flex flex-row w-fit h-fit px-3 rounded-br-lg gap-2 border-r border-b border-accent-semi-light transition-all">
        <div className="flex flex-col text-center">
          <p>Current Max</p>
          {isImperial
            ? Math.round(convertToFahrenheit(currentMax))
            : Math.round(currentMax)}
          {isImperial ? "°F" : "°C"}
        </div>

        <div className="flex flex-col text-center">
          <p>Asset Status</p>
          <p className={`${color} font-bold`}>{status}</p>
        </div>

        <p className="flex place-self-center">{action}</p>
      </div>

      <div className="flex relative w-full h-full">
        <RecentThresholdChart
          bucket_type="1 hour"
          bucket_number={5}
          returnCurrentMax={setCurrentMax}
          asset_id={currentAsset.id}
        />
      </div>
      
    </div>
  );
}

export default ThresholdDetail;

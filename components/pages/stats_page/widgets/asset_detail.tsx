import React, { useState, useContext, useEffect } from "react";

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";

import { get_max_fiber } from "hooks/endpoints/temperature_services";
import RadialChart from "@/Global/charts/radial_chart";
import { ResponsiveContainer } from "recharts";

import { useAssetCapacity } from "@/Queries/asset_queries";

function AssetDetail() {
  const { currentAsset } = useContext(AssetContext);
  const [temp, setTemp] = useState(0);
  const [time, setTime] = useState();
  const [fiberName, setFiberName] = useState("");
  const [colour, setColour] = useState("border-success");

  const { data: capacityData, isLoading: isCapacityLoading } =
    useAssetCapacity();

  useEffect(() => {
    const data = async () => {
      const result = await get_max_fiber(currentAsset.id);

      if (result != null && result.data.length > 0) {
        setTemp(result.data[0].max);
        setTime(result.data[0].bucket);
        setFiberName(result.data[0].fiber_name);
      }
    };

    data();
  }, [currentAsset]);

  useEffect(() => {
    currentAsset.status
      ? setColour("border-success")
      : setColour("border-error");
  }, [currentAsset.status]);

  return (
    <div className="flex flex-col h-full w-[17rem] max-w-full pt-6 pb-2 place-self-center">
      <div className="flex flex-row place-content-around">
        <h1 className="flex font-bold text-xl">{currentAsset.name}</h1>
        <div
          className={`flex justify-center place-items-center rounded-full border-2 ${colour} w-1/3`}
        >
          {currentAsset.status ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-md">
        <div className="flex flex-row place-content-between w-full">
          <p className="font-semibold">Region</p>
          {currentAsset.region}
        </div>

        <div className="flex flex-row place-content-between w-full">
          <p className="font-semibold">Segment of Interest</p>
          {fiberName}
        </div>

        <span className="w-full h-[0.1rem] bg-accent-light rounded-lg" />

        <div className="flex flex-row w-full justify-center text-center gap-3">
          <div className="flex flex-col w-1/2">
            <p className="font-semibold">Highest Temp (Half-Hour)</p>
            <p className="text-xl">{Math.round(temp * 100) / 100}°C</p>
          </div>

          <div className="flex flex-col h-[5rem] w-[5rem]">
            <p className="font-semibold">Capacity</p>
            <ResponsiveContainer>
              {isCapacityLoading || !capacityData.data ? (
                <span className="loading loading-dots loading-md text-secondary"></span>
              ) : (
                <RadialChart
                  type={""}
                  value={
                    Math.round(capacityData.data[currentAsset.name] * 100) / 100
                  }
                  unit={"%"}
                  maxVal={100}
                  size={101}
                  guage={false}
                />
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;

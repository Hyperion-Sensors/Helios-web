import React from "react";
import RadialChart from "@/Global/charts/radial_chart";
import dynamic from "next/dynamic";
const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });
import tailwindConfig from "tailwind.config";

export function AssetHealthGauge() {
  return (
    <div className="h-2/3 w-full flex flex-col justify-center items-center">
      <GaugeChart
        //@ts-ignore
        id="gauge-chart3"
        nrOfLevels={30}
        colors={[
          tailwindConfig.daisyui.themes[0].lightTheme["error"],
          tailwindConfig.daisyui.themes[0].lightTheme["success"],
        ]}
        hideText={true}
        arcWidth={0.3}
        percent={0.8}
      />
      {/* <div className="inline-flex gap-3 bg-secondary p-1 rounded-md shadow-lg text-primary">
        <p> Asset Life Remaining: </p>
        <p className="text-md">8 years</p>
      </div> */}
    </div>
  );
}

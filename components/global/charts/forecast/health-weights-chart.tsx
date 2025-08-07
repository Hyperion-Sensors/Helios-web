import React, { useContext, useEffect } from "react";

import { Radar } from "react-chartjs-2";
/*---------------------------------Context-------------------------------- */
import { ForecastContext } from "@/Context/forecast_context";
import { ResponsiveContainer } from "recharts";

export default function HealthWeightsChart() {
  const { selectedWeightPreset } = useContext(ForecastContext)!;

  /*-------------CHART  CONFIGURATION------------*/

  const data = {
    labels: ["F1", "F2", "F3", "F4"],
    datasets: [
      {
        label: "# of Votes",
        data: selectedWeightPreset.weights,
        backgroundColor: "rgba(46,80,114,0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className=" flex flex-row w-full h-full">
      <Radar
        data={data}
        options={{
          plugins: {
            legend: { display: false },
            //@ts-ignore
            crosshair: false,
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            tooltip: {
              position: "nearest",
              intersect: false,
            },
            snap: {
              enabled: true,
            },
            sync: {
              enabled: true,
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

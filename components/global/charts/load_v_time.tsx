import React, { useState, useContext, useEffect, useRef, use } from "react";

/*--------------------------------Libraries---------------------------- */
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";
import { format } from "date-fns";

/*-------------------------------API--------------------------------- */
import { get_recent_load } from "@/API/capacity_services";

/*-----------------------------Components------------------------------- */
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { AssetContext } from "@/Context/asset_context";

function LoadChart() {
  const { currentAsset } = useContext(AssetContext);
  const [chartData, setChartData] = useState<any>({ times: [], amps: [] });

  const styleConfig = tailwindConfig; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const get_data = async () => {
      const result = await get_recent_load(currentAsset.id, 10);

      if (result != null) {
        let times = result.data.map((data) =>
          format(new Date(data.time), "MM-dd | H:mm")
        );
        let amps = result.data.map((data) => data["amps"]);

        setChartData({
          times: times,
          amps: amps,
        });
      }
    };

    get_data();
  }, [currentAsset.id]);

  const data = {
    labels: chartData.times,
    datasets: [
      {
        label: `Amperes`,
        data: chartData.amps,
        fill: false,
        backgroundColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
        borderColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
      },
    ],
  };

  return (
    <div className="flex flex-row gap-1 h-full">
      <div className="flex w-full h-full">
        <Line
          data={data}
          options={{
            animation: {
              duration: 300,
              easing: "easeInOutQuad",
            },
            elements: {
              point: {
                radius: 1,
              },
            },
            datasets: {
              line: {
                pointRadius: 0, // disable for all `'line'` datasets
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Amperes",
                },
                grid: {
                  borderWidth: 4,
                  borderColor: styleConfig.daisyui.themes[0].lightTheme["neutral"],
                },
              },
              x: {
                grid: {
                  borderWidth: 4,
                  borderColor: styleConfig.daisyui.themes[0].lightTheme["neutral"],
                },
                ticks: {
                  maxRotation: 0,
                  maxTicksLimit: 4,
                },
                reverse: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                position: "nearest",
                intersect: false,
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}

export default LoadChart;

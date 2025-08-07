import React, { useState, useContext, useEffect } from "react";

/*--------------------------------Libraries---------------------------- */
import resolveConfig from "tailwindcss/resolveConfig"; //for to get theme colors programmatically out of tailwind.config.js
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";

/*-------------------------------API---------------------------- */
import { get_fiber_range } from "hooks/endpoints/temperature_services";

/*-----------------------------Components------------------------------- */
import {
  Chart,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AssetContext } from "@/Context/asset_context";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  start: number;
  end: number;
};

function FullFiberChart({ start, end }: Props) {
  const [chartData, setChartData] = useState<number[]>([]);
  const { currentAsset } = useContext(AssetContext);
  const [refresh, setRefresh] = useState(true);

  const colorConfig = tailwindConfig.theme.colors; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const get_data = async () => {
      if (currentAsset) {
        const result = await get_fiber_range(
          start / 0.5,
          end / 0.5,
          currentAsset.raw_table
        );
        if (result != null) {
          setChartData(result.data);
        }
      }
    };

    // Gets data every 60s
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, 60 * 1000);

    get_data();
    return () => clearInterval(interval);
  }, [currentAsset, refresh]);
  const data = {
    labels: Array.from(chartData.keys()),
    datasets: [
      {
        label: "Fiber Temperature",
        data: chartData,
        fill: false,
        borderColor: colorConfig["accent"],
        backgroundColor: "rgba(51, 58, 86, 0.2)",
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        elements: {
          point: {
            radius: 0,
          },
        },

        scales: {
          y: {
            title: {
              display: true,
              text: "Temperature (\u00b0C)",
            },
            grid: {
              borderWidth: 4,
              borderColor: colorConfig["accent-light"],
            },
          },
          x: {
            title: {
              display: true,
              text: "Fiber Length (m)",
            },
            grid: {
              borderWidth: 4,
              borderColor: colorConfig["accent-light"],
            },
            position: "center",
          },
        },
        maintainAspectRatio: false,
      }}
    />
  );
}

export default FullFiberChart;

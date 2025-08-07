/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect, useMemo } from "react";
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";
import ChartDataLabels from "chartjs-plugin-datalabels";

/*------------------------Library Components------------------- */
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";
import { VisualizerContext } from "@/Context/visualizer_context";

/*-------------------------------API---------------------------- */
import { get_last_day_segment } from "@/API/temperature_services";
import { ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

function LastDaySegmentChart() {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);

  const { currentAsset } = useContext(AssetContext);
  const { currentFiber } = useContext(VisualizerContext);
  const [chartData, setChartData] = useState({
    max: [],
    times: [],
  });
  const [times, setTimes] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const styleConfig = tailwindConfig; //instatiates tailwind config as styleConfig object
  Chart.register(ChartDataLabels);

  useEffect(() => {
    const get_data = async () => {
      const result = await get_last_day_segment("1 hour", 24, currentFiber); //call get_aggreate API for the last 48 hours in 1 hour time buckets (intervals)

      if (result != null) {
        let max_agg = result.data.map((n) => {
          //max value processing
          if (isImperial) {
            return convertToFahrenheit(n.max);
          }

          return n.max;
        });
        let time_agg = result.data.map((fiber) => {
          return format(new Date(fiber.bucket), "H:mm");
        });
        setChartData({
          max: max_agg,
          times: time_agg,
        });

        setTimes(times);
      }
    };
    if (currentFiber != undefined) {
    }

    // Gets data every 60s
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, 60 * 1000);

    get_data();

    return () => clearInterval(interval);
  }, [currentFiber, currentAsset.id, refresh]);

  const data = {
    labels:
      chartData.times.length > 0
        ? chartData.times
        : ["1:00", "2:00", "3:00", "4:00"],
    datasets: [
      {
        label: "Max Temp",
        data: chartData.times.length > 0 ? chartData.max : [0, 0, 0, 0],
        fill: false,
        borderColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
        backgroundColor: "rgba(51, 58, 86, 0.2)",
        pointRadius: function (context) {
          if (
            context.dataIndex ==
            context.chart.data.datasets[0].data.length - 1
          ) {
            return 5; // the border radius you want for your lastpoint
          } else {
            return 0;
          }
        },
        tension: 0.5,
      },
    ],
  };

  return (
    <ResponsiveContainer>
      <Line
        data={data}
        options={{
          layout: {
            padding: 20,
          },

          plugins: {
            legend: {
              display: false,
            },

            datalabels: {
              display: (context) => {
                return context.dataIndex ===
                  context.chart.data.datasets[0].data.length - 1
                  ? true
                  : false;
              },
              clamp: true,
              align: "bottom",
            },
          },
          elements: {
            point: {
              radius: 5,
              backgroundColor: "#fffeee",
            },
          },

          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            y: {
              grid: {
                display: false,
                drawBorder: false,
              },
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </ResponsiveContainer>
  );
}

export default LastDaySegmentChart;

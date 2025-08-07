/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect, useMemo } from "react";
import tailwindConfig from "../../../tailwind.config";
import StreamingPlugin from "chartjs-plugin-streaming";
import "chartjs-adapter-luxon";

/*------------------------Library Components------------------- */
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";
import { OverviewContext } from "@/Context/overview_context/";

/*-------------------------------API---------------------------- */
import { get_aggregate } from "hooks/endpoints/temperature_services";
import { ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

Chart.register(StreamingPlugin);

function MaxTempChart() {
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
  const { currentFiber } = useContext(OverviewContext);
  const [chartData, setChartData] = useState({
    max: [],
    times: [],
  });
  const [times, setTimes] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const colorConfig = tailwindConfig.theme.colors; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const get_data = async () => {
      const result = await get_aggregate("1 hour", 48, currentAsset.id); //call get_aggreate API for the last 48 hours in 1 hour time buckets (intervals)

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
    labels: chartData.times,
    datasets: [
      {
        label: "Max Temp",
        data: chartData.max,
        fill: false,
        borderColor: colorConfig["accent-semi-light"],
        backgroundColor: "rgba(51, 58, 86, 0.2)",
      },
    ],
  };

  return (
    <ResponsiveContainer>
      <Line
        data={data}
        options={{
          elements: {
            point: {
              radius: 2,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: isImperial
                  ? "Temperature (\u00b0F)"
                  : "Temperature (\u00b0C)",
              },
              grid: {
                borderWidth: 4,
                borderColor: colorConfig["accent-light"],
              },
            },
            x: {
              grid: {
                borderWidth: 4,
                borderColor: colorConfig["accent-light"],
              },
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </ResponsiveContainer>
  );
}

export default MaxTempChart;

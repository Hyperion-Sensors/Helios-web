import React, { useContext, useEffect, useState, useMemo } from "react";

/*------------------------------Libraries---------------------------- */
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

/*--------------------------------API-------------------------------- */
import { get_aggregate } from "@/API/temperature_services";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

/*-----------------------------Context------------------------------- */
import { AssetContext } from "@/Context/asset_context";

import tailwindConfig from "tailwind.config";

type Props = {
  bucket_type: string; // length of time for each bucket
  bucket_number: number; // number of buckets
  returnCurrentMax: (max: number) => void;
  asset_id?: number;
};

function RecentThresholdChart({
  bucket_type = "1 hour",
  bucket_number = 1,
  returnCurrentMax,
  asset_id,
}: Props) {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);

  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);

  const [chartData, setChartData] = useState({
    times: [],
    max: [],
  });
  const [chartMax, setChartMax] = useState(150); // highest value on y-axis
  const [chartMin, setChartMin] = useState(0); // lowest value on y-axis
  const { currentAsset } = useContext(AssetContext);

  const styleConfig = tailwindConfig; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const get_data = async () => {
      const result = await get_aggregate(
        bucket_type,
        bucket_number,
        asset_id ? asset_id : currentAsset.id
      );

      if (result != null && result.data.length > 0) {
        // This is confusing nomenclature, but we want the min value from the max values
        let min = result.data[0].max;

        let times = result.data.map((data) =>
          format(new Date(data.bucket), "MM-dd | H:mm")
        );

        let max = result.data.map((data) => {
          data.max < min ? (min = data.max) : min;
          return isImperial ? convertToFahrenheit(data.max) : data.max;
        });

        returnCurrentMax(result.data[result.data.length - 1].max);

        setChartMin(Math.floor(min * 0.9));
        // setChartMax(Math.ceil(currentAsset.capacity * 1.1))

        setChartData({
          times: times,
          max: max,
        });
      }
    };

    get_data();
  }, [
    asset_id,
    bucket_number,
    bucket_type,
    currentAsset.capacity,
    currentAsset.id,
    returnCurrentMax,
  ]);

  const data = {
    labels: chartData.times,
    datasets: [
      {
        label: "Recent Threshold",
        data: chartData.max,
        fill: false,
        backgroundColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
        borderColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
      },
    ],
  };

  return (
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
              type: "linear",
              suggestedMax: chartMax,
              suggestedMin: chartMin,
              title: {
                display: true,
                text: isImperial
                  ? "Temperature (\u00b0F)"
                  : "Temperature (\u00b0C)",
              },
              grid: {
                borderWidth: 4,
              },
            },
            x: {
              title: {
                display: false,
                text: "Time",
              },
              grid: {
                borderWidth: 4,
              },
              position: "bottom",
            },
          },
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              position: "nearest",
              intersect: false,
            },
            zoom: {
              zoom: {
                //@ts-ignore
                enabled: false,
              },
              pan: {
                enabled: false,
              },
            },
            crosshair: {
              zoom: {
                enabled: false, // enable zooming
              },
              callbacks: {
                beforeZoom: () =>
                  function (start, end) {
                    // called before zoom, return false to prevent zoom
                    return true;
                  },
                afterZoom: () =>
                  function (start, end) {
                    // called after zoom
                  },
              },
              snap: {
                enabled: true,
              },
              sync: {
                enabled: false,
              },
              line: {
                color: styleConfig.daisyui.themes[0].lightTheme["secondary"], // crosshair line color
                width: 1, // crosshair line width
              },
            },
          },
        }}
      />
    </div>
  );
}

export default RecentThresholdChart;

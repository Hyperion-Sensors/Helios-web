/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect, useReducer } from "react";
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";

import moment from "moment";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

/*------------------------Library Components------------------- */
import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

/*-------------------------------API---------------------------- */
import { get_fiber_aggregate } from "@/API/temperature_services";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";
import { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import { AssetContext } from "@/Context/asset_context";

interface fiber {
  id: number;
  name: string;
}

type Props = {
  aggregateType: string;
  selectedFiber: fiber;
  interval: string;
  start: string;
  end: string;
};

// Chart.register(...registerables);

Chart.register(CrosshairPlugin, zoomPlugin);

function SegmentOverviewChart({
  selectedFiber,
  aggregateType = "max",
  interval = "1 hour",
  start,
  end,
}: Props) {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  const [isImperial, setIsImperial] = useState(false);
  const [max, setMax] = useState(100);
  const [min, setMin] = useState(0);
  const { currentAsset, currentSegment, changeCurrentSegment } =
    useContext(AssetContext);

  const { data: fiberTemps, isLoading: isFiberLoading } =
    useAssetFiberTemperatures(currentAsset.id);

  const [chartData, setChartData] = useState({
    times: [],
    temps: [],
  });

  const styleConfig = tailwindConfig;

  /*---------------------------Chart.js Register Chart Elements-------------------------------- */

  useEffect(() => {
    if (settingsData) {
      setIsImperial(settingsData.data_options.Unit_System == "imperial");
    }
    if (
      !isFiberLoading &&
      fiberTemps &&
      selectedFiber &&
      fiberTemps?.data?.fiber_data
    ) {
      const fiberData = Object.values(fiberTemps.data.fiber_data) as any;
      if (fiberData[currentSegment.name]) {
        setMax(fiberData[currentSegment.name]["max"]);
        setMin(fiberData[currentSegment.name]["min"]);
      }
    }
  }, [fiberTemps, settingsData, isFiberLoading]);

  useEffect(() => {
    const get_data = async () => {
      const result = await get_fiber_aggregate(
        aggregateType,
        selectedFiber.id,
        interval,
        start,
        end
      );
      if (result != null) {
        let times = result.data.map((data) =>
          moment(data.bucket).format("MM-DD | H:mm")
        );
        let temps = result.data.map((data) => {
          if (isImperial) {
            return convertToFahrenheit(data[aggregateType]);
          }

          return data[aggregateType];
        });

        setChartData({
          times: times,
          temps: temps,
        });
      }
    };

    get_data();
  }, [aggregateType, interval, selectedFiber.id, start, end]);

  const data = {
    labels: chartData.times,
    datasets: [
      {
        label: `${aggregateType} Temperature`,
        data: chartData.temps,
        fill: false,
        backgroundColor: styleConfig.daisyui.themes[0].lightTheme.secondary,
        borderColor: styleConfig.daisyui.themes[0].lightTheme.secondary,
      },
    ],
  };

  return (
    <div className="flex w-full h-full">
      <Line
        data={data}
        options={{
          animation: {
            duration: 500,
            easing: "easeInOutQuad",
          },
          elements: {
            point: {
              radius: 1,
            },
          },
          datasets: {
            line: {
              tension: 0.1,

              pointRadius: 0, // disable for all `'line'` datasets
            },
          },
          scales: {
            y: {
              suggestedMax:
                (isImperial ? convertToFahrenheit(max + 20) : max + 50) || 100,
              suggestedMin:
                (isImperial ? convertToFahrenheit(min - 10) : min - 20) || 0,
              title: {
                display: true,
                text: isImperial
                  ? "Temperature (\u00b0F)"
                  : "Temperature (\u00b0C)",
              },
              grid: { display: false },
            },
            x: {
              grid: {
                color: styleConfig.daisyui.themes[0].lightTheme["neutral"],
              },
              ticks: {
                maxRotation: 0,
                maxTicksLimit: 8,
              },
              reverse: true,
            },
          },

          plugins: {
            legend: {
              display: false,
            },

            tooltip: {
              animation: {
                duration: 0,
              },
            },
            //@ts-ignore
            crosshair: {
              zoom: {
                enabled: "y", // enable zooming
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
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                drag: {
                  enabled: true,
                },
                mode: "y",
              },
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

export default SegmentOverviewChart;

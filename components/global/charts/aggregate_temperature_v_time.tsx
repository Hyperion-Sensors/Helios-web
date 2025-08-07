/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";
import { format } from "date-fns";

/*------------------------Library Components------------------- */
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import CrosshairPlugin from "chartjs-plugin-crosshair";

/*---------------------------Context----------------------*/
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------API---------------------------- */
import { get_range_aggregate } from "hooks/endpoints/temperature_services";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

type Props = {
  startDate: string | null;
  endDate: string | null;
};

Chart.register(CrosshairPlugin);

function AggregateSummaryChart({ startDate, endDate }: Props) {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);

  /*---------------------------Context Hooks-------------------------------- */
  const { currentAsset } = useContext(AssetContext);

  /*---------------------------State Hooks-------------------------------- */
  const [chartData, setChartData] = useState({
    // max: [],
    avg: [],
    times: [],
  });
  const [times, setTimes] = useState([]);

  /*---------------------------Ref Hooks-------------------------------- */

  const chartRef = useRef<Chart>();
  const styleConfig = tailwindConfig; //instatiates tailwind config as styleConfig object

  // useEffect(() => {
  //   const get_data = async () => {
  //     const result = await get_aggregate("1 hour", 48, currentAsset.id); //call get_aggreate API for the last 48 hours in 1 hour time buckets (intervals)

  //     if (result != null) {
  //       let max_agg = result.data.map((n) => {
  //         //max value processing
  //         return n.max;
  //       });

  //       let avg_agg = result.data.map((n) => {
  //         //average value processing
  //         return n.avg;
  //       });
  //       let time_agg = result.data.map((fiber) => {
  //         return moment(fiber.bucket).format("MM-DD HH:mm");
  //       });
  //       setChartData({
  //         max: max_agg,
  //         avg: avg_agg,
  //         times: time_agg,
  //       });

  //       setTimes(times);
  //     }
  //   };

  //   get_data();
  // }, [currentAsset.id, times]);

  useEffect(() => {
    const get_data = async () => {
      const result = await get_range_aggregate(
        currentAsset.id,
        startDate,
        endDate
      ); //call get_aggreate API for the last 48 hours in 1 hour time buckets (intervals)

      if (result != null) {
        let max_agg = result.data.map((n) => {
          //max value processing
          if (isImperial) {
            return convertToFahrenheit(n.max);
          }
          return n.max;
        });

        let avg_agg = result.data.map((n) => {
          //average value processing
          if (isImperial) {
            return convertToFahrenheit(n.avg);
          }
          return n.avg;
        });
        let time_agg = result.data.map((fiber) => {
          return format(new Date(fiber.bucket), "MM-dd | H:mm");
        });
        setChartData({
          // max: max_agg,

          avg: avg_agg,
          times: time_agg,
        });

        setTimes(times);
      }
    };

    get_data();
  }, [currentAsset.id, startDate, endDate, times]);

  const data = {
    labels: chartData.times,
    datasets: [
      // {
      //   label: "Max Temp",
      //   data: chartData.max,
      //   fill: false,
      //   borderColor: "rgba(255, 200, 200,1)",
      //   backgroundColor: "rgba(255, 125, 125,1)",
      // },

      {
        label: "Avg Temp",
        data: chartData.avg,
        fill: false,
        borderColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
        backgroundColor: styleConfig.daisyui.themes[0].lightTheme["secondary"],
      },
    ],
  };

  // const handleMouseMove = (event) => {
  //   if (chartRef.current) {
  //     const chartInstance = chartRef.current;
  //     const activeElements = chartInstance.getElementsAtEvent(event);
  //     if (activeElements.length > 0) {
  //       const xValue = activeElements[0].parsed.x;
  //       const yValue = activeElements[0].parsed.y;
  //       setHoverCoords({ x: xValue, y: yValue });
  //     } else {
  //       setHoverCoords({ x: null, y: null });
  //     }
  //   }
  // };

  return (
    <div className="flex w-full h-full">
      <Line
        id="Overview Aggregate Chart"
        //@ts-ignore
        ref={chartRef}
        data={data}
        options={{
          animation: {
            duration: 500,
            easing: "easeInOutQuad",
          },
          plugins: {
            datalabels: {
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
          elements: {
            point: {
              radius: 0,
            },
          },
          interaction: {
            mode: "index",
            axis: "x",
            intersect: false,
          },

          scales: {
            y: {
              suggestedMax: isImperial ? 150 : 100,
              suggestedMin: isImperial ? 25 : -10,
              title: {
                display: true,
                text: isImperial
                  ? "Temperature (\u00b0F)"
                  : "Temperature (\u00b0C)",
              },
              grid: {
                borderWidth: 4,
                borderColor:
                  styleConfig.daisyui.themes[0].lightTheme["neutral"],
              },
            },
            x: {
              grid: {
                borderWidth: 4,
                borderColor:
                  styleConfig.daisyui.themes[0].lightTheme["neutral"],
              },
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

export default AggregateSummaryChart;

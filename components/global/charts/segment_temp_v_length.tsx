import React, { useState, useContext, useEffect, useRef, useMemo } from "react";

/*--------------------------------Libraries---------------------------- */
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";
import CrosshairPlugin from "chartjs-plugin-crosshair";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

/*-----------------------------Components------------------------------- */
import { AssetContext } from "@/Context/asset_context";
import SegmentChartLegendItem from "./add-ons/segment_chart_legend";
import GradientLegend from "./add-ons/gradient_legend";
import OpenCloseLine from "../custom/open_close_line";

/*---------------------------API-----------------------------*/
import { getSegmentChartData } from "@/Queries/data_queries";
import { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

function SegmentFiberChart() {
  const { currentAsset } = useContext(AssetContext);

  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [legendElements, setLegendElements] = useState<any>(<></>);

  const [showSidebar, setShowSidebar] = useState(true);

  const colorConfig = tailwindConfig.daisyui.themes[0]; //instatiates tailwind config as styleConfig object
  const chartRef = useRef<Chart>();

  //get settings
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);

  //reusable isImperial check
  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);

  const { data: chartData, isLoading: isChartLoading } = getSegmentChartData(
    currentAsset,
    isImperial
  );
  const { data: fiberTemperatureData, isLoading: isFiberTemperatureLoading } =
    useAssetFiberTemperatures(currentAsset.id);

  const gradientArray = [
    "#1f97c0",
    "#23aaa9",
    "#26bd93",
    "#2ad07c",
    "#32f54e",
    "#f1f96f",
    "#fcb907",
    "#fba30e",
    "#fa8c15",
    "#f8761d",
    "#f75f24",
    "#e15924",
    "#f6492b",
    "#f53232",
  ];

  function handleChartClick(event, index: number) {
    let chart = chartRef.current;
    let meta = chart.getDatasetMeta(index);
    meta.hidden =
      meta.hidden === null ? !chart.data.datasets[index].hidden : null;

    chart.update();
  }

  function createLegend() {
    if (chartRef.current) {
      let chart = chartRef.current;

      setLegendElements(
        chart.legend.legendItems.map((items, index) => {
          if (items.text == undefined) return;
          const colour =
            chart.getDatasetMeta(index)["_dataset"].backgroundColor;
          let segmentMaxTemp = 0;

          if (
            fiberTemperatureData?.data?.fiber_data != undefined &&
            fiberTemperatureData?.data?.fiber_data.hasOwnProperty(items.text) &&
            !isFiberTemperatureLoading
          ) {
            segmentMaxTemp =
              fiberTemperatureData.data.fiber_data[items.text].max;
          }

          return (
            <SegmentChartLegendItem
              key={index}
              itemText={items.text}
              maxTemp={segmentMaxTemp}
              colour={colour}
              handleClick={(e: any, index: number) =>
                handleChartClick(e, index)
              }
              index={index}
            />
          );
        })
      );
    }
  }

  const mapValue = (value) => {
    let oldMin = 0;
    let oldMax = 100; // Need to replace with actual max temp
    const newMin = 0;
    const newMax = 13;

    if (isImperial) {
      oldMin = convertToFahrenheit(oldMin);
      oldMax = convertToFahrenheit(oldMax);
    }

    const newValue =
      ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    return newValue;
  };

  const getTempColor = (temp: number) => {
    // Maps the temperature to the gradient

    let mappedTemp = Math.round(mapValue(temp));
    mappedTemp = Math.min(Math.max(mappedTemp, 0), 13);

    return gradientArray[mappedTemp];
  };

  /*-------------CHART ZOOM CONFIGURATION------------*/
  useEffect(() => {
    if (typeof window !== "undefined") {
      Chart.register(zoomPlugin, CrosshairPlugin);
    }
  });

  /*------------------CHART CREATION-----------------*/
  useEffect(() => {
    setLoading(true);

    if (isChartLoading || !chartData.data) {
      return;
    }

    if (chartData.data.segments && colorConfig) {
      setConfig({
        labels: Array.from(
          { length: currentAsset.end - currentAsset.start + 1 },
          (_, i) => i + currentAsset.start
        ),
        datasets: chartData.data.segments.map((segment: any, index: number) => {
          let highestTemp = Math.max(
            ...chartData.data[`${segment.name}`].map((item: any) => item.y)
          );

          let current_color: string;

          if (segment.name === "Full Fiber") {
            current_color = colorConfig["accent-light"];
          } else {
            current_color = getTempColor(highestTemp);
          }

          return {
            type: "line",
            label: `${segment.name}`,
            data: chartData.data[`${segment.name}`],
            fill: false,
            borderColor: current_color,
            backgroundColor: current_color,
          };
        }),
      });
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, currentAsset]);

  /*------------------LEGEND CREATION------------------*/
  useEffect(() => {
    createLegend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, config]);

  return !loading ? (
    <div className="flex flex-row gap-1 h-full ">
      <div className="flex w-full h-full">
        <Line
          //@ts-ignore
          ref={chartRef}
          //@ts-ignore
          data={config}
          options={{
            elements: {
              point: {
                radius: 1,
              },
            },
            spanGaps: true,
            animation: false,
            datasets: {
              line: {
                pointRadius: 0, // disable for all `'line'` datasets
              },
            },
            scales: {
              y: {
                type: "linear",
                suggestedMax: isImperial ? 150 : 100,
                suggestedMin: isImperial ? 25 : -10,

                title: {
                  display: true,

                  text: isImperial
                    ? "Temperature (\u00b0F)"
                    : "Temperature (\u00b0C)",
                },
              },
              x: {
                type: "linear", //WILL NOT START FROM SEPARATE AXIS POINTS IF TAKEN OUT
                title: {
                  display: true,
                  text: isImperial ? "Length (ft)" : "Length (m)",
                },
                position: "bottom",
              },
            },
            maintainAspectRatio: false,

            plugins: {
              datalabels: {
                display: false,
              },
              tooltip: {
                position: "nearest",
                intersect: false,
                animation: {
                  duration: 0,
                },
              },
              //@ts-ignore
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
                  color: tailwindConfig.daisyui.themes[0].lightTheme.secondary, // crosshair line color
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
              decimation: {
                enabled: true,
                algorithm: "min-max",
              },
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>

      {/* Close/Open Button */}
      <OpenCloseLine
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "max-w-[40%] opacity-100"
            : "max-w-0 overflow-hidden opacity-0"
        } flex flex-col transition-all ease-in-out duration-300 mb-3 mt-5`}
      >
        <div className="relative flex basis-11/12 overflow-y-scroll overflow-x-hidden scrollbar w-full h-full">
          <ul id="legend" className="w-full h-full absolute top-0">
            {/*Must be absolute to allow overflow without breaking sizing*/}
            {legendElements}
          </ul>
        </div>
        <div className="flex flex-row h-1/12">
          <GradientLegend gradient={gradientArray} squares={7} />
        </div>
      </div>
    </div>
  ) : (
    <span className="flex text-secondary justify-center place-self-center loading loading-spinner loading-lg"></span>
  );
}

export default SegmentFiberChart;

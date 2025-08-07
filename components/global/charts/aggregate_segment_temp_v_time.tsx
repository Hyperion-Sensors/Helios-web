/*---------------------------Libraries----------------------*/
import React, { useState, useContext, useEffect, useMemo } from "react";
import tailwindConfig from "../../../tailwind.config";
import "chartjs-adapter-luxon";
import moment from "moment";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

/*------------------------Library Components------------------- */
import { Line } from "react-chartjs-2";

/*-------------------------------API---------------------------- */
import { get_fiber_aggregate } from "@/API/temperature_services";
import { StatsContext } from "@/Context/stats_context";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

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

function SegmentAggregateChart({
  selectedFiber,
  aggregateType = "max",
  interval = "1 hour",
  start = moment().format("YYYY-MM-DD"),
  end = moment().format("YYYY-MM-DD"),
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

  const { selectedDateRange } = useContext(StatsContext);

  const [chartData, setChartData] = useState({
    times: [],
    temps: [],
  });

  const styleConfig = tailwindConfig;

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
  }, [
    aggregateType,
    interval,
    selectedFiber.id,
    selectedDateRange,
    start,
    end,
  ]);

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
  );
}

export default SegmentAggregateChart;

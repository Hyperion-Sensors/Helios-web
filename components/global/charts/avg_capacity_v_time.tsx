import React, { useEffect, useMemo, useState } from "react";

/*------------------------Library Components------------------- */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { avg_capacity_hour_aggregate } from "hooks/endpoints/interval_service";
import tailwindConfig from "tailwind.config";
import { ResponsiveContainer } from "recharts";

/*---------------------------Libraries----------------------*/
import { format } from "date-fns";

/*---------------------------API----------------------*/
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const styleConfig = tailwindConfig;

export const options = {
  responsive: true,
  barThickness: 10,
  hoverBorderWidth: 2,
  borderRadius: 3,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    crosshair: false,
    title: {
      display: true,
      text: "Average RTTR of All Assets",
    },
  },
  scales: {
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: true,
        borderWidth: 3,
        borderRadius: 3,
      },
    },
  },
  maintainAspectRatio: false,
};

export function HalfDayCapacity() {
  /*---------------------------Settings-------------------------------- */
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  const isImperial = useMemo(() => {
    if (settingsData) {
      return settingsData.data_options.Unit_System == "imperial";
    }
    return false;
  }, [settingsData]);
  const [capAgg, setCapAgg] = useState([]);
  const [data, setData] = useState({ labels: [], datasets: [] });

  const get_half_day_cap = async () => {
    const result = await avg_capacity_hour_aggregate(1, 6);
    setCapAgg(result.data);
  };

  useEffect(() => {
    get_half_day_cap();
  }, []);

  useEffect(() => {
    if (capAgg) {
      setData({
        labels: capAgg.map((n) => {
          return format(new Date(n.bucket), "H:mm");
        }),
        datasets: [
          {
            data: capAgg.map((n, index) => {
              if (isImperial) {
                return convertToFahrenheit(n.avg_capacity);
              }
              return n.avg_capacity;
            }),
            backgroundColor: styleConfig.daisyui.themes[0].lightTheme.secondary,
          },
        ],
      });
    }
  }, [capAgg]);

  return (
    <ResponsiveContainer>
      <Bar options={options} data={data} />
    </ResponsiveContainer>
  );
}
// return capAgg ? <div>{JSON.stringify(capAgg)}</div> : <div>sss</div>;

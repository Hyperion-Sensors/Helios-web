import React from "react";
import { ResponsiveContainer } from "recharts";
import { Line } from "react-chartjs-2";
import tailwindConfig from "tailwind.config";

type Props = {
  chartData: {
    survivability: number[];
    age: number[];
  };
};

function SurvivabilityChart({ chartData }: Props) {
  const colorConfig = tailwindConfig.daisyui.themes[0]; //instatiates tailwind config as styleConfig object

  const data = {
    labels: chartData.age,
    datasets: [
      {
        label: `Survivability`,
        data: chartData.survivability,
        fill: true,
        backgroundColor: "rgba(24,62,100,0.2)",
        backgroundOpacity: 0.2,
        borderColor: colorConfig.lightTheme.secondary,
        tension: 0.3,
      },
    ],
  };
  return (
    <ResponsiveContainer>
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
          layout: {
            padding: {
              right: 10,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Survivability",
              },
              grid: {
                borderWidth: 4,
                borderColor: colorConfig.lightTheme["neutral"],
                display: false,
              },
              min: 0,
              max: 1,
            },
            x: {
              grid: {
                borderWidth: 4,
                borderColor: colorConfig.lightTheme["neutral"],
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
    </ResponsiveContainer>
  );
}

export default SurvivabilityChart;

/*------------------------Library ------------------- */
import React, { useContext, useEffect } from "react";
import "chartjs-adapter-luxon";
import Chart from "chart.js/auto";

/*------------------------Components------------------- */
import SurvivabilityChart from "@/Global/charts/forecast/survivability_chart";
import CardTitle from "@/Global/misc/card-title";

/*------------------------Context ------------------- */
import { ForecastContext } from "@/Context/forecast_context";

// @ts-ignore
Chart.register("Linear");

const assets = ["Asset 1", "Asset 2", "Cable 1", "Cable 2"];

const assetData = [
  { title: "Type", value: "Transformer" },
  { title: "Material", value: "Steel" },
  { title: "Age", value: "24 Years" },
  { title: "Maintenance Incidents", value: "5" },
];

const cableData = [
  { title: "Type", value: "Cable" },
  { title: "Material", value: "Copper" },
  { title: "Installation Type", value: "Underground Duct" },
  { title: "Length", value: "265m" },
  { title: "Age", value: "37 Years" },
  { title: "Maintenance Incidents", value: "4" },
];

export default function SurvivalAnalysis({}) {
  const { loadValue, setLoadValue, selectedLoadUnit, setSelectedLoadUnit } =
    useContext(ForecastContext);

  const [selectedAsset, setSelectedAsset] = React.useState(assets[0]);
  const [comboBoxQuery, setComboBoxQuery] = React.useState("");

  const [chartData, setChartData] = React.useState({
    survivability: [],
    age: [],
  });

  // const [loadValue, setLoadValue] = React.useState(0);
  // const [selectedLoadUnit, setSelectedLoadUnit] = React.useState("MV");

  useEffect(() => {
    let age = [];
    let survivability = [];
    console.log(loadValue);
    for (var i = 60; i >= 0; i--) {
      age.push(i);
    }

    // Generate a simple cos curve for survivability
    age.forEach((age) => {
      let loadFactor = loadValue <= 100 ? 1 : 100 / loadValue;
      survivability.push(
        (Math.cos(age / 40) / 2) * loadFactor + 0.5 * loadFactor
      );
    });
    setChartData({ survivability: survivability, age: age });
  }, [loadValue]);

  const handleLoadInput = (value: number) => {
    // let value = Number(val);

    value = Math.min(1000, Math.max(0, value));

    setLoadValue(value);
  };

  // Filter assets based on combobox query
  var filteredAssets = [];

  filteredAssets =
    comboBoxQuery === ""
      ? assets
      : assets.filter((asset) =>
          asset.toLowerCase().includes(comboBoxQuery.toLowerCase())
        );

  return (
    <div className="relative flex flex-col justify-between w-full h-full bg-primary gap-3 rounded-lg   overflow-auto">
      {/* Asset Life Indicator */}
      <div className="flex flex-row justify-between w-full h-15 p-2 gap-2 basis-1/12">
        <div className=" text-md xl:text-lg gap-2 w-full">
          <CardTitle
            content={"Asset Survivability Summary"}
            description={
              "This feature uses our most advanced AI algorithms to predict the remaining life of the asset."
            }
          />
        </div>
      </div>

      <div
        id="asset-information-container"
        className="relative flex flex-row bg-primary rounded-md  w-full h-full basis-6/12"
      >
        {/* Survival Analysis Chart */}
        <div
          id="Survivability-chart"
          className="flex flex-col items-center w-full h-full"
        >
          <span className="whitespace-nowrap flex items-center gap-2 text-secondary">
            Asset Life Remaining:
            <span className=" w-fit h-fit text-center  border-2 border-success rounded-lg px-1 place-self-center font-bold">
              60 Years
            </span>
          </span>
          <SurvivabilityChart chartData={chartData} />
        </div>
      </div>
      <div className="flex flex-row basis-3/12 m-1">
        {/* -------------------------Asset Information Table------------------------------------ */}
        <table
          id="asset-information-table"
          className="table-fixed w-full border border-secondary border-spacing-2 border-collapse"
        >
          <caption className="text-secondary text-sm xl:text-base font-bold border-b-2 border-secondary bg-neutral/30 rounded-t-sm ">
            Asset Information
          </caption>
          <tbody className="text-sm  font-bold border-2">
            <tr className="border-2">
              <td>Name</td>
              <td>{selectedAsset}</td>
            </tr>
            {selectedAsset[0] === "A"
              ? assetData.map((data, index) => (
                  <tr
                    key={index}
                    className={`border-2 ${
                      index % 2 === 0 ? "bg-base-100" : "bg-primary divide-x-2"
                    }
                      `}
                  >
                    <td>{data.title}</td>
                    <td>{data.value}</td>
                  </tr>
                ))
              : cableData.map((data, index) => (
                  <tr
                    key={index}
                    className={`border-2 ${
                      index % 2 === 0 ? "bg-neutral" : "bg-primary"
                    }`}
                  >
                    <td>{data.title}</td>
                    <td>{data.value}</td>
                  </tr>
                ))}
            <tr className="bg-accent text-primary border-2">
              <td>Highest Temperature</td>
              <td>45°C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*-------------------Library Imports-------------------- */
import React, { useContext, useEffect, useState } from "react";

/*-------------------Components and ComponentData Imports -------------------- */
import { ForecastContext } from "@/Context/forecast_context";

/*-------------------Components and ComponentData Imports -------------------- */
import { AgeTable, FactorsTable } from "./graded_tables";
import CardTitle from "@/Global/misc/card-title";
import dynamic from "next/dynamic";

const HealthWeightsChart = dynamic(
  () => import("@/Global/charts/forecast/health-weights-chart"),
  { ssr: false }
);

const weightColors = ["#FF9D0B", "#1245F7", "#E140D1", "#3CD423"];

export default function HealthIndex({}) {
  const { selectedWeightPreset, selectedGradePreset } =
    useContext(ForecastContext);

  const [health, setHealth] = useState(0);

  useEffect(() => {
    let tempHealth = 0;
    let totalWeight = selectedWeightPreset.weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < selectedWeightPreset.weights.length; i++) {
      tempHealth +=
        (((selectedWeightPreset.weights[i] / totalWeight) *
          selectedGradePreset.grades[i]) /
          5) *
        100;
    }

    setHealth(tempHealth);
  }, [selectedWeightPreset, selectedGradePreset]);

  const weightBarSections = () => {
    let totalWeight = selectedWeightPreset.weights.reduce((a, b) => a + b, 0);
    let weightBarSections = [];

    for (let i = 0; i < selectedWeightPreset.weights.length; i++) {
      weightBarSections.push(
        <div
          className={`absolute min-h-full ${
            i == 0
              ? "rounded-l-lg"
              : i == selectedWeightPreset.weights.length - 1
              ? "rounded-r-lg"
              : ""
          } transition-all duration-200`}
          style={{
            width: `${(selectedWeightPreset.weights[i] / totalWeight) * 100}%`,
            left: `${
              (selectedWeightPreset.weights
                .slice(0, i)
                .reduce((a, b) => a + b, 0) /
                totalWeight) *
              100
            }%`,
            backgroundColor: `${weightColors[i]}`,
          }}
        ></div>
      );
    }

    return weightBarSections;
  };

  return (
    <div className="flex flex-col  w-full h-full bg-primary gap-3 rounded-lg  p-1 overflow-y-auto">
      {/*---------------------------------------Weighted Health Scores---------------------------------------- */}
      <CardTitle
        content={"Asset Health Summary"}
        description={
          "Values that are considered in predicting the overall health of the chosen Asset"
        }
      />

      <div className="flex flex-row w-full items-center gap-1 h-full basis-7/12">
        {/*---------------------------------Factor Weights Bar-------------------------------*/}

        <HealthWeightsChart />

        {/*---------------------------------Overall Health --------------------------------*/}

        <div
          id="overall-health-container"
          className="flex flex-col justify-center items-center w-full gap-2 "
        >
          <h1 className="flex items-center whitespace-nowrap xl:text-lg text-secondary gap-2 ">
            Overall Health Score:
            <h1 className="border-2 border-success rounded-md p-1 text-lg text-secondary font-bold">
              {health}
            </h1>
          </h1>
          <div
            id="overall-health-bar"
            className="flex relative w-[85%] h-[2.5rem] bg-gradient-to-r from-error/50 via-warning 
            to-success/50 rounded-lg shadow-lg"
          >
            <div
              className="absolute w-[0.4rem] h-full bg-accent border border-y-4 border-secondary rounded-full"
              style={{ left: `${Math.min(health, 98.5) + "%"}` }}
            ></div>
          </div>
        </div>
      </div>

      {/*---------------------------------Weighted health scoring system --------------------------------*/}
      <div className="flex flex-col  gap-2 w-full basis-5/12 overflow-y-auto">
        {/*---------------------------Age and Factor Tables Table--------------------------- */}
        <FactorsTable selectedWeightPreset={selectedWeightPreset} />
        <AgeTable />
      </div>
    </div>
  );
}
/*

          <h1 className="xl:text-lg text-secondary font-bold">Weights</h1>
          <div className="flex relative w-4/5 h-6 bg-neutral rounded-lg">
            {weightBarSections().map((section) => section)}
          </div>

          <div className="flex flex-col w-5/6 h-fit gap-2">
            {factors.map((factor, index) => (
              <div
                key={factor + index + "legend"}
                className="flex flex-row flex-wrap w-full h-fit gap-1"
              >
                <div
                  className="w-10 h-2 place-self-center rounded-full"
                  style={{ backgroundColor: `${weightColors[index]}` }}
                ></div>
                <p className="text-secondary font-bold">
                  {factor} - Grade: {selectedGradePreset.grades[index]}
                </p>
              </div>
            ))}
          </div>
*/

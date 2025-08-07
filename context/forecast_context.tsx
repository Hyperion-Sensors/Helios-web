import React, { useState, createContext, useReducer } from "react";

/*-----------------------------Type  Imports---------------------------------- */
import { gradePresetType, weightedPresentType } from "@/Types/forecast_types";

/*-----------------------------Component Data  Imports---------------------------------- */
import presets from "../components/pages/forecast_page/presets.json";

//Copy presets from presets.json to memory
const factors = presets.factors;
const gradePresets = presets.gradePresets;
const weightPresets = presets.weightPresets;
type ForecastContextType = {
  loadValue: number;
  setLoadValue: (value: number) => void;
  selectedLoadUnit: string;
  setSelectedLoadUnit: (value: string) => void;
  selectedWeightPreset: weightedPresentType;
  setSelectedWeightPreset: (value: weightedPresentType) => void;
  selectedGradePreset: gradePresetType;
  setSelectedGradePreset: (value: gradePresetType) => void;
};

const ForecastContext = createContext<ForecastContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
};

// main function provider
const ForecastProvider: React.FC<Props> = ({ children }) => {
  const [loadValue, setLoadValue] = useState(0);
  const [selectedLoadUnit, setSelectedLoadUnit] = useState("A");
  const [selectedWeightPreset, setSelectedWeightPreset] = useState(
    weightPresets[0]
  );
  const [selectedGradePreset, setSelectedGradePreset] = useState(
    gradePresets[0]
  );
  return (
    <ForecastContext.Provider
      value={{
        loadValue,
        setLoadValue,
        selectedLoadUnit,
        setSelectedLoadUnit,
        selectedWeightPreset,
        setSelectedWeightPreset,
        selectedGradePreset,
        setSelectedGradePreset,
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};

export { ForecastProvider, ForecastContext };

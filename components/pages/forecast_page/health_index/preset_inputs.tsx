import React, { useContext } from "react";
/*-------------------Components and ComponentData Imports-------------------- */

import presets from "../presets.json";

/*------------------------Context ------------------- */
import { ForecastContext } from "@/Context/forecast_context";
import { Listbox } from "@headlessui/react";
import HeliosIcon from "@/Global/icons";

//Copy presets from presets.json to memory
const gradePresets = presets.gradePresets;
const weightPresets = presets.weightPresets;

function PresetInputs() {
  const {
    selectedWeightPreset,
    setSelectedWeightPreset,
    selectedGradePreset,
    setSelectedGradePreset,
  } = useContext(ForecastContext);
  return (
    <>
      <div className="flex items-center justify-center gap-2 border-primary h-full">
        {/*___________________Weight Preset Selector_______________*/}
        <p className="font-bold text-secondary  text-sm">Weight preset</p>
        <div className="relative w-fit h-fit place-self-center rounded-sm  cursor-pointer ">
          <Listbox
            value={selectedWeightPreset}
            onChange={setSelectedWeightPreset}
          >
            <Listbox.Button
              className={
                "flex flex-row text-accent text-sm group bg-primary border border-secondary rounded-md hover:border-accent px-1"
              }
            >
              {selectedWeightPreset.name}
              <div className="place-self-center w-4 h-4 xl:w-5 xl:h-5">
                <HeliosIcon
                  icon_class="chevron"
                  icon_type="up-down"
                  color="group-hover:stroke-accent"
                  stroke="stroke-2"
                />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={
                "absolute left-0 top-6 z-10 w-fit h-fit bg-primary rounded-sm border border-secondary"
              }
            >
              {weightPresets.map((preset) => (
                <Listbox.Option
                  className={`hover:text-accent  text-secondary cursor-pointer px-1`}
                  key={preset.name + "id"}
                  value={preset}
                >
                  {preset.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2  border-primary h-full">
        {/*________________Grade Preset Selector_______________*/}
        <p className="font-bold text-secondary text-sm"> Grade preset</p>

        <div className="relative w-fit h-fit place-self-center rounded-sm cursor-pointer ">
          <Listbox
            value={selectedGradePreset}
            onChange={setSelectedGradePreset}
          >
            <Listbox.Button
              className={
                "whitespace-nowrap flex flex-row text-accent text-sm group bg-primary border border-secondary rounded-md hover:border-accent px-1"
              }
            >
              {selectedGradePreset.name}
              <div className="place-self-center w-4 h-4 xl:w-5 xl:h-5">
                <HeliosIcon
                  icon_class="chevron"
                  icon_type="up-down"
                  color=" group-hover:stroke-accent"
                  stroke="stroke-2"
                />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={
                "absolute left-0 top-6  w-fit h-fit bg-primary rounded-sm border border-secondary"
              }
            >
              {gradePresets.map((preset) => (
                <Listbox.Option
                  className={`hover:text-accent  text-secondary cursor-pointer px-1`}
                  key={preset.name + "id"}
                  value={preset}
                >
                  {preset.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
    </>
  );
}

export default PresetInputs;

/*------------------------------Library Imports------------------------ */
import React from "react";

/*-------------------Components and ComponentData Imports-------------------- */
import LoadInput from "./survival_analysis/load_input";
import PresetInputs from "./health_index/preset_inputs";
import CardTitle from "@/Global/misc/card-title";

function ForecastInputs() {
  return (
    <div className="rounded-md  w-full h-fit">
      <div className="flex flex-row  w-full h-full rounded-md gap-6">
        <div className="w-1/2 h-full">
          {" "}
          <div className="hover:ring hover:ring-secondary/50  w-fit h-full rounded-lg hover:shadow-xl border-2 border-neutral bg-primary ">
            <h2 className="w-full h-full bg-secondary text-primary text-sm xl:text-base shadow-lg rounded-t-lg pl-3">
              Survivability Inputs
            </h2>
            <div className="flex gap-2 p-2">
              <LoadInput />
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full">
          {" "}
          <div className="hover:ring hover:ring-secondary/50  w-fit h-full rounded-lg hover:shadow-xl border-2 border-neutral bg-primary ">
            <h2 className="w-full h-full bg-secondary text-primary text-sm xl:text-base shadow-lg rounded-t-lg pl-3">
              Health Inputs
            </h2>
            <div className="flex gap-2 p-2">
              <PresetInputs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForecastInputs;

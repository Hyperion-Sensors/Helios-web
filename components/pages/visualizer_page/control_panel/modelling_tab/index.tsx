import React, { useContext, useEffect, useState } from "react";

/*--------------------Context------------------- */
import { AssetContext } from "@/Context/asset_context";

/*------------------Components------------------ */
import DataSlider from "./data_slider";
import BoundaryInputs from "@/Global/custom/boundary_inputs";
import Divider from "@/Global/custom/divider";

type Props = {};

function ModellingTab({}: Props) {
  const { ambient, setAmbient, loadDelta, setLoadDelta } =
    useContext(AssetContext);

  const [modelLoad, setModelLoad] = useState(0);
  const [tempRange, setTempRange] = useState<number[]>([0, 100]);
  const [loadRange, setLoadRange] = useState<number[]>([0, 1000]);
  const [loadCoeff, setLoadCoeff] = useState<number>(0.3);

  /*----------------------Input Handling---------------------- */
  const handleAmbientChange = (new_temp: number) => {
    setAmbient(new_temp);
  };

  const handleLoadchange = (new_load: number) => {
    setModelLoad(new_load);
    setLoadDelta(new_load * loadCoeff);
  }; //divide by how small an increment gain per loadDelta increase you want

  return (
    <div
      className={`items-center flex flex-col justify-around w-full h-full px-5 py-5 gap-1`}
    >
      <Divider title={"Temperature Bounds"} />
      <DataSlider
        min={tempRange[0]}
        max={tempRange[1]}
        value={ambient}
        type={"temp"}
        handleChange={(num) => handleAmbientChange(num)}
      />
      <BoundaryInputs
        type={"temp"}
        handleChange={(range: number[]) => {
          setTempRange(range);
          setAmbient(range[0]);
        }}
        range={tempRange}
      />

      <div className="mt-2">
        <Divider title={"Load Boundaries"} />
        <DataSlider
          min={loadRange[0]}
          max={loadRange[1]}
          type={"Load"}
          value={modelLoad}
          handleChange={(num) => handleLoadchange(num)}
        />
        <BoundaryInputs
          type={"load"}
          handleChange={(range: number[]) => {
            setLoadRange(range);
            setModelLoad(range[0]);
          }}
          range={loadRange}
        />
      </div>
      <div className=" self-start">
        <Divider title={"Load Delta Coefficient"} />
        <label className="input-group text-secondary text-md">
          <span className="input-group text-secondary text-start text-md">
            {"\u0394 Load"}
          </span>
          <input
            type="number"
            name="name"
            className="input input-secondary w-full p-2 rounded-md border border-neutral hover:border-neutral-focus"
            placeholder={String(loadCoeff)}
            onChange={(e) => {
              e.preventDefault;
              setLoadCoeff(Number(e.target.value));
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default ModellingTab;

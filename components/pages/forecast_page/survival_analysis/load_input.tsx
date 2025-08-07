/*------------------------Library ------------------- */
import React, { useContext } from "react";
import HeliosIcon from "@/Global/icons";
import { Listbox } from "@headlessui/react";

/*------------------------Context ------------------- */
import { ForecastContext } from "@/Context/forecast_context";

function LoadInput() {
  const { loadValue, setLoadValue, selectedLoadUnit, setSelectedLoadUnit } =
    useContext(ForecastContext);

  return (
    <>
      {" "}
      <div className="flex gap-2">
        <p className="w-fit h-fit font-bold place-self-center text-sm text-secondary">
          Avg load on asset
        </p>
        <input
          className="h-fit w-[5rem] border border-secondary rounded-md pl-1 place-self-center text-accent text-sm"
          type="number"
          value={loadValue}
          max={1000}
          onChange={(e) => setLoadValue(e.target.value as unknown as number)}
        />
      </div>
      <div className="flex gap-2">
        <p className="w-fit h-fit font-bold place-self-center text-sm text-secondary">
          Load unit
        </p>
        <div className="relative w-fit h-ful place-self-center rounded-md border bg-primary border-secondary cursor-pointer px-1 ">
          <Listbox value={selectedLoadUnit} onChange={setSelectedLoadUnit}>
            <Listbox.Button className={"flex flex-row text-accent text-sm "}>
              {selectedLoadUnit}
              <div className="place-self-center w-4 h-4">
                <HeliosIcon
                  icon_class="chevron"
                  icon_type="up-down"
                  color="stroke-secondary"
                  stroke="stroke-2"
                />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={
                "absolute z-10  left-0 top-6 bg-primary rounded-sm border border-secondary"
              }
            >
              <Listbox.Option
                className={`hover:bg-primary hover:text-secondary text-secondary cursor-pointer px-1`}
                key="OPTIONMVA"
                value="MVA"
              >
                MVA
              </Listbox.Option>
              <Listbox.Option
                className={`hover:bg-primary hover:text-secondary text-secondary cursor-pointer px-1`}
                key="OPTIONAMP"
                value="A"
              >
                A
              </Listbox.Option>
              <Listbox.Option
                className={`hover:bg-primary hover:text-secondary text-secondary cursor-pointer px-1`}
                key="OPTIONVOLT"
                value="V"
              >
                V
              </Listbox.Option>
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
    </>
  );
}

export default LoadInput;

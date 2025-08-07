import React, { useContext } from "react";

/*---------------------------Components-------------------------- */
import RadialChart from "@/Global/charts/radial_chart";

/*----------------------------Context----------------------------- */
import { VisualizerContext } from "@/Context/visualizer_context";
type Props = {};

function CapacityCharts({}: Props) {
  const { options } = useContext(VisualizerContext);
  return (
    <div
      className={`${
        options[4].checked ? "block" : "hidden"
      } flex flex-col gap-4 h-full w-full `} //if the "Capacity" option in context is false, hide this element
    >
      <RadialChart
        value={45}
        unit={"%"}
        type={"Capacity"}
        maxVal={100}
        size={150}
        guage={false}
      />

      <RadialChart
        value={60}
        unit={"C\u00b0"}
        type={"Max Temp"}
        maxVal={80}
        size={150}
        guage={false}
      />

      <RadialChart
        value={4}
        unit={"kA"}
        type={"Load"}
        maxVal={12}
        size={150}
        guage={false}
      />
    </div>
  );
}

export default CapacityCharts;

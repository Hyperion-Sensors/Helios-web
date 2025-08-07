import React, { useContext } from "react";

/*-----------------------------Components------------------------- */
import OptionsBox from "./options_box";
import ControlInfo from "./control_info";
import ResetView from "./reset_button";
import Divider from "@/Global/custom/divider";
import BoundaryInputs from "@/Global/custom/boundary_inputs";
import { VisualizerContext } from "@/Context/visualizer_context";

type Props = {};

function OptionsTab({}: Props) {
  // const [tempRange, setTempRange] = useState([0, 100]);
  const { tempRange, setTempRange } = useContext(VisualizerContext);
  return (
    <div
      id="options_tab"
      className={`items-center flex flex-row justify-around w-full h-full px-5 `}
    >
      <div className="w-fullflex flex-col justify-between">
        <Divider title={" Visualizer Control"} />
        <OptionsBox />
      </div>

      <div className="h-full">
        <Divider title={" Temperature Control"} />
        <BoundaryInputs
          type={"temp"}
          handleChange={(range: number[]) => {
            setTempRange(range);
          }}
          range={tempRange}
        />
      </div>

      <div className="h-full">
        <Divider title={"3D Controls"} />
        <ControlInfo />
        <div className="m-2">
          <ResetView />
        </div>
      </div>
    </div>
  );
}

export default OptionsTab;

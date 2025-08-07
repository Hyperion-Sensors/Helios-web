import React, { Suspense, useState, useEffect, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Selection,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import Gradient from "javascript-color-gradient";

/*-------------------------Context---------------------------- */
import { AssetContext } from "@/Context/asset_context";
import { VisualizerContext } from "@/Context/visualizer_context";

/*-------------------------Components---------------------------- */
import Model from "./models/main_model";
import ForecastModel from "./models/forecast_model";

/*-------------------------Util---------------------------- */
import Image from "next/image";

type Props = {
  currentAsset: object;
};

// Moved here from utils/helpers to remove forecast code that may be obsolete later
function getGradientTemp(
  ambient_temp: number,
  loadDelta: number,
  gradientArray: string[]
) {
  const colorSelector: number = Math.round(
    ambient_temp + Math.ceil(loadDelta / 10) * 10
  );
  switch (Math.ceil(colorSelector / 10) * 10) {
    case 10:
      return gradientArray[1];
    case 20:
      return gradientArray[2];
    case 30:
      return gradientArray[3];
    case 40:
      return gradientArray[4];
    case 50:
      return gradientArray[5];
    case 60:
      return gradientArray[6];
    case 70:
      return gradientArray[7];
    case 80:
      return gradientArray[8];
    case 90:
      return gradientArray[9];
    case 100:
      return gradientArray[10];
  }
}

function ThreeDScene({ currentAsset }: Props) {
  const { ambient, loadDelta } = useContext(AssetContext);
  const { options, currentTab, currentView } = useContext(VisualizerContext);

  const [color, setColor] = useState("black");
  const [gradientArray, setGradientArray] = useState([]);
  const [file] = useState(null); //used to hold 3d filezzzz

  useEffect(() => {
    const gradientArray = new Gradient()
      .setColorGradient("#4eeb17", "#e71515")
      .setMidpoint(10)
      .getColors();

    setGradientArray(gradientArray);
  }, []);

  useEffect(() => {
    /*2023-04-26 move useEffect contents to util function in helpers*/
    setColor(getGradientTemp(ambient, loadDelta, gradientArray));
  }, [ambient, loadDelta]);

  if (currentView == 1) {
    return (
      <div
        id="canvas-container"
        style={{ height: "100%", width: "100%" }}
        className={` cursor-grab postition-absolute  h-full w-full bg-secondary`}
      >
        <Canvas>
          {options[2].checked ? (
            <gridHelper args={[100, 10, 0xff0000, "teal"]} />
          ) : (
            <></>
          )}
          {options[3].checked ? <axesHelper args={[5]} /> : <></>}

          <Suspense fallback={null}>
            <ambientLight />

            <spotLight
              intensity={1}
              angle={0.9}
              penumbra={1}
              position={[30, 15, 10]}
              castShadow
            />

            {currentTab == 1 ? (
              <Selection>
                <EffectComposer multisampling={8} autoClear={false}>
                  <Outline
                    blur
                    visibleEdgeColor={255}
                    edgeStrength={100}
                    width={500}
                  />
                </EffectComposer>
                <ForecastModel
                  colors={color}
                  file={file}
                  asset={currentAsset}
                />
              </Selection>
            ) : (
              <Selection>
                <EffectComposer multisampling={8} autoClear={false}>
                  <Outline
                    blur
                    visibleEdgeColor={255}
                    edgeStrength={100}
                    width={500}
                  />
                </EffectComposer>
                <Model colors={color} file={file} asset={currentAsset} />{" "}
              </Selection>
            )}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full flex flex-row justify-center items-center gap-6">
        {" "}
        <div className="h-32 w-32 relative">
          {" "}
          <Image
            src={"/photon.gif"}
            fill={true}
            alt={""}
            className="rounded-md opacity-60"
          />
        </div>
        <span>
          <span className="text-md font-bold">Sorry...</span>
          <br />{" "}
          <span className="text-sm">
            this page is currently under development
          </span>
        </span>
      </div>
    );
  }
}

export default ThreeDScene;

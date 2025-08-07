import React, { Suspense, useState, useEffect, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./models/test_model";
import { OrbitControls, useGLTF, OrthographicCamera } from "@react-three/drei";

// /*-------------------------Context---------------------------- */
import { AssetContext } from "@/Context/asset_context";
import { VisualizerContext } from "@/Context/visualizer_context";

type Props = {
  currentAsset: object;
};

// {
//     "id": 13,
//     "time": "2022-09-12T19:14:30.023Z",
//     "fiber_id": 13,
//     "max": 60.46,
//     "min": 0,
//     "avg": 30.34,
//     "name": "Loop2",
//     "asset_id": 2,
//     "start": 71,
//     "end": 76
// },

function ThreeDScene({ currentAsset }: Props) {
  const { ambient, setAmbient, loadDelta, setLoadDelta } =
    useContext(AssetContext);

  const [file, setFile] = useState(null); //used to hold 3d file

  return (
    <div id="canvas-container" className={`cursor-grab  h-full w-full `}>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />

          <spotLight
            intensity={1}
            angle={0.9}
            penumbra={1}
            position={[30, 15, 10]}
            castShadow
          />

          <Model file={file} asset={currentAsset} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ThreeDScene;

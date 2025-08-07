import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./models/mini_model";
import { OrbitControls } from "@react-three/drei";

import { Vector3 } from "three";
import { EffectComposer, Outline } from "@react-three/postprocessing";

type Props = {
  currentAsset: object;
};

function ThreeDScene({ currentAsset }: Props) {
  const [file] = useState(null); //used to hold 3d file
  const [isZooming, setIsZooming] = useState(false);
  const [target, setTarget] = useState<Vector3>(new Vector3(0, 0, 0));
  const [selectedObject, setSelectedObject] = useState([]);

  return (
    <div
      id="canvas-container"
      className={`cursor-grab h-full w-full `}
      onMouseOver={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
    >
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />

          <spotLight
            intensity={1}
            angle={1}
            penumbra={1}
            position={[300, 15, 100]}
            castShadow
          />

          <spotLight
            intensity={1}
            angle={1}
            penumbra={1}
            position={[-300, 15, -100]}
            castShadow
          />

          <EffectComposer multisampling={8} autoClear={false}>
            <Outline
              selection={selectedObject}
              visibleEdgeColor={0xffffff}
              hiddenEdgeColor={0xffffff}
              edgeStrength={5}
              width={450}
              pulseSpeed={0.2}
              blur={true}
            />
            <Model
              file={file}
              asset={currentAsset}
              zooming={isZooming}
              setTarget={setTarget}
              setSelectedObject={setSelectedObject}
            />
          </EffectComposer>
          <OrbitControls
            enablePan={false}
            enableRotate={true}
            enableZoom={true}
            minDistance={2}
            onStart={() => setIsZooming(true)}
            target={target}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ThreeDScene;

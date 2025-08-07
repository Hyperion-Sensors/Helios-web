/*---------------------------Libraries--------------------------- */
import React, { useContext, useState } from "react";
import { Select } from "@react-three/postprocessing";
/*----------------------------Context---------------------------- */
import { VisualizerContext } from "@/Context/visualizer_context";

type Props = {
  name: string;
  geometry: any;
  colorTemp?: string;
};
function FiberMesh({ name, geometry, colorTemp }: Props) {
  const { options, setCurrentFiber } = useContext(VisualizerContext);

  const [hovered, setHovered] = useState<boolean>(null);

  const handleEnter = (fiber_name: string) => {
    // setFPOpen(true); //[1]
    setCurrentFiber(fiber_name);
  };

  return (
    <Select enabled={hovered}>
      <mesh
        castShadow
        receiveShadow
        //@ts-ignore
        geometry={geometry}
        // material={gltf.nodes[n].material}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)} //[1]
        onClick={() => {
          // [1]
          hovered ? handleEnter(name) : null;
        }}
      >
        <meshPhongMaterial
          attach="material"
          // vertexColors={colorTemp ? false : true}
          opacity={options[1].checked ? 1.0 : 0.0}
          color={colorTemp}
          transparent
        />
      </mesh>
    </Select>
  );
}

export default FiberMesh;

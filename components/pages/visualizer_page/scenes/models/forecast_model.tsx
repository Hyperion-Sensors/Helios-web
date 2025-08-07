import React, { useState, useEffect, useContext, useReducer } from "react";
import { useGLTF } from "@react-three/drei";

/*-------------------------Context---------------------------- */
import { VisualizerContext } from "@/Context/visualizer_context";
const CLIENT = process.env.NEXT_PUBLIC_CLIENT_ENV;

/*---------------------------API-----------------------------*/
import { get_3d_config } from "hooks/endpoints/3d_services";
import { useThree } from "@react-three/fiber";

/*--------------------Comments-------------------- */
import FiberMesh from "./meshes/fiber_mesh";

export default function ForecastModel(props) {
  const { options, setCurrentFiber } = useContext(VisualizerContext);

  const [hovered, setHovered] = useState<string>(null);
  const [scale, setScale] = useState<number>(1);
  const [objects, setObjects] = useState([[], []]); //save configuration arrays from fetch

  const state = useThree();
  /* Handler function for controlling the fiber panel state and current fiber properties */
  const handleEnter = (fiber_name: string) => {
    // setFPOpen(true); //[1]
    setCurrentFiber(fiber_name);
  };

  useEffect(() => {
    const get_config = async () => {
      const result = await get_3d_config(props.asset.name);
      const fibers = result.data["fibers"].map((n: string, index: number) => {
        return (
          <FiberMesh
            key={n + String(index)}
            name={n}
            //@ts-ignore
            geometry={gltf.nodes[n].geometry}
            colorTemp={props.colors}
          />
        );
      });

      const accessories = result.data["accessories"].map(
        (n: string, index: number) => {
          return (
            <mesh
              castShadow
              receiveShadow
              key={index}
              //@ts-ignore
              geometry={gltf.nodes[n].geometry}
              //@ts-ignore

              material={options[0].checked ? gltf.nodes[n].material : ""}
              position={[0, 0, -100]}
            >
              {options[0].checked ? (
                <></>
              ) : (
                <meshPhongMaterial
                  attach="material"
                  color={props.colors}
                  opacity={0.0}
                  transparent
                />
              )}
            </mesh>
          );
        }
      );

      setObjects([fibers, accessories]);
      setScale(result.data["scale"]);
    };

    get_config();
  }, [, props.asset, options]);

  const gltf = useGLTF(
    `https://hyperionhelios.s3.us-east-2.amazonaws.com/helios-models/${CLIENT}/${props.asset.name}.glb`
  );
  return (
    <group {...props} dispose={null} scale={scale} castShadow>
      {/* <mesh
        castShadow
        receiveShadow
        geometry={gltf.nodes.tFIT.geometry}
        // material={gltf.nodes[n].material}
        position={[0, 0, -100]}
      >
        <meshStandardMaterial attach="material" color={color} />
      </mesh> */}
      {objects[0]}
      {objects[1]}
    </group>
  );
}
function handleLeave(): void {
  throw new Error("Function not implemented.");
}

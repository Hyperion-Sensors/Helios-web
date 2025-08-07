import React, { useState, useEffect, useContext, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import Gradient from "javascript-color-gradient";
//color using American spelling :)))
/*-------------------------Context---------------------------- */
import { AssetContext } from "@/Context/asset_context";
import { VisualizerContext } from "@/Context/visualizer_context";

const CLIENT = process.env.NEXT_PUBLIC_CLIENT_ENV;

/*---------------------------API-----------------------------*/
import { get_3d_config } from "hooks/endpoints/3d_services";
import { Obj } from "@popperjs/core";
import { concat } from "lodash";

//GLOBALS
const colorRange = ["#23CE6B", "#f03333"];
const midpoint = 20;

export default function Model(props) {
  const [model, setModel] = useState<string>(); //this is the gltf file (model) to be used

  const [scale, setScale] = useState<number>(1);
  const [objects, setObjects] = useState([[], []]); //save configuration arrays from fetch

  const [fiberTemps, setFiberTemps] = useState<any>([]); // TEMPORARY - not sure what this file is for 

  useEffect(() => {
    get_config();
  }, [fiberTemps, props.asset]);

  const getTempColor = (temp: number) => {
    /*
    Formula for coloring:
    1. Get the temperature (T)
    2. Divide by 10 to get the index of the color in the gradient array (T/10)
    3. Round down to get the index of the color in the gradient array (Math.round(T/10)
    4. Return the color at that index in the gradient array

    Typically you want to take the max set point (M) and divide by 10 then add 1 to get the number of colors you want in the gradient array incase of round up errors:

    Target Setpoint = M/10 + 1

    For example, if the max setpoint is 140, you want 15 colors in the gradient array...(see below)
    
    */
    let gradientArray = concat(
      ["#1f97c0"], //add blue for cold temp
      new Gradient()
        .setColorGradient("#23CE6B", "#f53232")
        .setMidpoint(10) //set midpoints HERE
        .getColors()
    );

    let fiberColor: string;
    if (temp > 140) {
      //set this number to max of setpoint
      //if temp is too high for rounding back to 15 colors, set to max color
      fiberColor = gradientArray[gradientArray.length - 1];
    } else if (temp < 0) {
      //if temp is too low for rounding back to 15 colors, set to min color
      fiberColor = gradientArray[0];
    } else {
      fiberColor = gradientArray[Math.round(temp / 10)];
    }
    return fiberColor; //formula for coloring
  };

  const get_config = async () => {
    //get the 3D object configuration from the database for the current asset
    const result = await get_3d_config(props.asset.name);
    const unprocessed = result.data.fibers; //iterate through fibers and accessories and create meshes for each
    const fibers = unprocessed.map((n: string, index: number) => {
      //get the color for the fiber based on the temperature
      let colorTemp: string = "#23CE6B";
      if (fiberTemps.fiber_data != undefined) {
        colorTemp = getTempColor(
          fiberTemps.fiber_data[String(n)] != undefined
            ? fiberTemps.fiber_data[String(n)].max
            : 20
        );
      } else {
        colorTemp = "#ffffff";
      }

      //This sets the material for all fibers allowing programmable colours
      return (
        <mesh
          castShadow
          receiveShadow
          key={index}
          //@ts-ignore

          geometry={gltf.nodes[n].geometry}
          // material={gltf.nodes[n].material}
          position={[0, 0, -100]}
        >
          <meshPhongMaterial
            attach="material"
            color={colorTemp}
            opacity={1}
            transparent
          />
        </mesh>
      );
    });

    const accessories = result.data["accessories"].map(
      //This sets the material for each accessory as set by the GLTF file
      (n: string, index: number) => {
        return (
          <mesh
            castShadow
            receiveShadow
            key={index}
            //@ts-ignore

            geometry={gltf.nodes[n].geometry}
            //@ts-ignore

            material={gltf.nodes[n].material}
            position={[0, 0, -100]}
          ></mesh>
        );
      }
    );

    setObjects([fibers, accessories]);
    setScale(result.data["scale"]);
  };

  const gltf = useGLTF(
    `https://hyperionhelios.s3.us-east-2.amazonaws.com/helios-models/${CLIENT}/${props.asset.name}.glb`
  );
  return (
    <group {...props} dispose={null} scale={scale} castShadow>
      {objects[0]}
      {objects[1]}
    </group>
  );
}

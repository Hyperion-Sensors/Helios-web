import React, { useState, useEffect, useContext } from "react";
import { useGLTF } from "@react-three/drei";
import { Float32BufferAttribute } from "three";

//color using American spelling :)))
/*-------------------------Context---------------------------- */
import { AssetContext } from "@/Context/asset_context";
import { VisualizerContext } from "@/Context/visualizer_context";

/*---------------------------API-----------------------------*/
import { get_3d_config } from "hooks/endpoints/3d_services";
import { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import { getSegmentChartData } from "@/Queries/data_queries";

/*---------------------------Components-----------------------------*/
import FiberMesh from "./meshes/fiber_mesh";

//GLOBALS
const CLIENT = process.env.NEXT_PUBLIC_CLIENT_ENV;

const gradientArray = [
  "#1f97c0",
  "#23aaa9",
  "#26bd93",
  "#2ad07c",
  "#32f54e",
  "#f1f96f",
  "#fcb907",
  "#fba30e",
  "#fa8c15",
  "#f8761d",
  "#f75f24",
  "#e15924",
  "#f6492b",
  "#f53232",
];

export default function Model(props) {
  const { currentAsset } = useContext(AssetContext);
  const { options, tempRange } = useContext(VisualizerContext);

  const [scale, setScale] = useState<number>(1);
  const [objects, setObjects] = useState([[], []]); //save configuration arrays from fetch

  const { data: fiberTemps, isLoading: isFiberTemperatureLoading } =
    useAssetFiberTemperatures(currentAsset.id);
  const { data: segmentData, isLoading: isSegmentDataLoading } =
    getSegmentChartData(currentAsset);

  useEffect(() => {
    get_config();
  }, [
    fiberTemps,
    segmentData,
    isFiberTemperatureLoading,
    isSegmentDataLoading,
    props.asset,
    options,
    tempRange,
  ]);

  // From https://stackoverflow.com/a/5624139/
  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  const getTempColor = (temp: number) => {
    // This function calculates the percentage of the temperature between the min and max temperature
    // and returns the color based on that percentage.
    // It effectively maps the temperature in any range to any length of gradient.

    // let gradientArray = concat(
    //   ["#1f97c0"], //add blue for cold temp
    //   new Gradient()
    //     .setColorGradient("#23CE6B", "#f53232")
    //     .setMidpoint(10) //set midpoints HERE
    //     .getColors()
    // );

    if (temp == null || temp == undefined) {
      return "#FFFFFF";
    }

    const upperTemperatureBound = 130;
    const lowerTemperatureBound = 0;

    const indexOfTemperature = Math.round(
      ((temp - lowerTemperatureBound) /
        (upperTemperatureBound - lowerTemperatureBound)) *
        (gradientArray.length - 1)
    );

    return gradientArray[
      Math.max(0, Math.min(indexOfTemperature, gradientArray.length - 1))
    ];
  };

  // This function processes the vertices of the geometry and colors them based on the temperature
  const processGeometryColor = (geometry, segmentName) => {
    const positionCount = geometry.attributes.position.count;
    const colors = [];

    for (let i = 0; i < positionCount; ++i) {
      let currentPos = i / positionCount;
      let currentTemperaturePoint = Math.floor(
        segmentData.data[String(segmentName)].length * currentPos
      );

      // getTempColor returns a hex color, so we need to convert it to RGB
      // May change getTempColor to return RGB instead of hex later
      const temperatureColorRGB = hexToRgb(
        getTempColor(
          segmentData.data[String(segmentName)][currentTemperaturePoint].y
        )
      );

      colors.push(
        temperatureColorRGB.r / 255,
        temperatureColorRGB.g / 255,
        temperatureColorRGB.b / 255
      );
    }

    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    return geometry;
  };

  const get_config = async () => {
    //get the 3D object configuration from the database for the current asset
    const result = await get_3d_config(props.asset.name);
    const unprocessed = result.data.fibers; //iterate through fibers and accessories and create meshes for each
    const fibers = unprocessed.map((n: string, index: number) => {
      //get the color for the fiber based on the temperature

      let colorTemp: string = "#FFFFFF";
      if (
        !isFiberTemperatureLoading &&
        fiberTemps.data &&
        fiberTemps.data.fiber_data != undefined
      ) {
        const maxSegmentTemperature = fiberTemps.data.fiber_data[String(n)]
          ? fiberTemps.data.fiber_data[String(n)].max
          : 20;

        colorTemp = getTempColor(maxSegmentTemperature);
      }

      // Check if the accessory exists in the gltf file
      // @ts-ignore
      if (gltf.nodes[n] == undefined || !gltf.nodes[n]?.geometry) {
        return;
      }

      // Check if the fiber segment has associated temperature data
      // This handles cases where 3D may have fiber that is not in the fiber table for some reason
      if (
        !isSegmentDataLoading &&
        segmentData?.data[String(n)] != undefined &&
        segmentData?.data[String(n)].length != 0
      ) {
        // @ts-ignore
        // gltf.nodes[n].geometry = processGeometryColor(gltf.nodes[n].geometry, n);
        // return (
        //   <FiberMesh
        //     name={n}
        //     key={index}
        //     //@ts-ignore
        //     geometry={gltf.nodes[n].geometry}
        //   />
        // );
      }

      return (
        <FiberMesh
          name={n}
          key={index}
          //@ts-ignore
          geometry={gltf.nodes[n].geometry}
          colorTemp={colorTemp}
        />
      );
    });

    const accessories = result.data["accessories"].map(
      //This sets the material for each accessory as set by the GLTF file
      (n: string, index: number) => {
        // @ts-ignore
        if (gltf.nodes[n] == undefined || !gltf.nodes[n]?.geometry) {
          return;
        }

        return (
          <mesh
            castShadow
            receiveShadow
            key={index}
            //@ts-ignore

            geometry={gltf.nodes[n].geometry}
            //@ts-ignore

            material={options[0].checked ? gltf.nodes[n].material : ""}
            position={[0, 0, 0]}
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

import React, { useState, useEffect, useContext } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Box3, Float32BufferAttribute, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

//color using American spelling :)))
/*-------------------------Context---------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*---------------------------API-----------------------------*/
import { get_3d_config } from "hooks/endpoints/3d_services";
import { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import { getSegmentChartData } from "@/Queries/data_queries";

//GLOBALS
const CLIENT = process.env.NEXT_PUBLIC_CLIENT_ENV;

// Easing function for camera transition
// https://easings.net/#easeInOutCubic
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function Model(props) {
  const { currentAsset, currentSegment } = useContext(AssetContext);

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

  const [scale, setScale] = useState<number>(1);
  const [objects, setObjects] = useState([[], []]); //save configuration arrays from fetch
  const [objectList, setObjectList] = useState([]);

  const [zoomStopTime, setZoomStopTime] = useState<number>(-3);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const [currentObjectPosition, setCurrentObjectPosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const [currentObjectSize, setCurrentObjectSize] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const groupRef = React.useRef<Object3D>();
  const cameraRef = React.useRef<typeof PerspectiveCamera>();

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
  ]);

  useEffect(() => {
    if (objects[0].length == 0) {
      return;
    }

    const fiberObjects =
      groupRef.current.children.filter((n) => n.name != "") || [];
    setObjectList(fiberObjects);
  }, [objects]);

  useEffect(() => {
    let boxCentroid = new Vector3();
    let boxSize = new Vector3();

    if (currentSegment == undefined || currentSegment?.name == undefined) {
      objectList[0]?.geometry.boundingBox.getCenter(boxCentroid);
      objectList[0]?.geometry.boundingBox.getSize(boxSize);
    } else {
      for (let n = 0; n < objectList.length; n++) {
        if (objectList[n].name == currentSegment.name) {
          objectList[n]?.geometry.boundingBox.getCenter(boxCentroid);
          objectList[n]?.geometry.boundingBox.getSize(boxSize);

          props.setSelectedObject([objectList[n]])
        }
      }
    }

    setZoomStopTime(-3);
    setCameraPosition(
      new Vector3(boxCentroid.x + 50, boxSize.y + 50, boxCentroid.z)
    );
    setCurrentObjectPosition(boxCentroid);
    setCurrentObjectSize(boxSize);
  }, [objectList, currentSegment]);

  // This function is called every frame and calculates the camera position based on the current object
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // const timeSinceTransition = elapsedTime - transitionStartTime;
    const angle = 45 * (Math.PI / 180);
    const offset = 1.25;

    // Calculations to fit the object in the camera view
    // Code based off of https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
    // @ts-ignore
    const cameraFOV = cameraRef.current.fov * (Math.PI / 180);
    // @ts-ignore
    const cameraFOVH = 2 * Math.atan(Math.tan(cameraFOV / 2) * cameraRef.current.aspect);

    let dx = currentObjectSize.z / 2 + Math.abs(currentObjectSize.x / 2 / Math.tan(cameraFOVH / 2));
    let dy = currentObjectSize.y / 2 + Math.abs(currentObjectSize.y / 2 / Math.tan(cameraFOV / 2));
    let cameraDistance = Math.max(dx, dy) * offset;

    const height = cameraDistance * Math.sin(angle) + currentObjectPosition.y;
    // Distance needs to be split into x and z components for accurate positioning
    // Currently works fine as it is but may need to be changed later
    const distance = cameraDistance * Math.cos(angle);

    if (props.zooming) {
      setZoomStopTime(elapsedTime);
    }

    if (!props.zooming && elapsedTime - zoomStopTime > 3) {
      /*--------------------------Camera Rotation Handler--------------------------- */
      const offsetX = currentObjectPosition.x + Math.sin(elapsedTime / 16) * distance;
      const offsetZ = currentObjectPosition.z + Math.cos(elapsedTime / 16) * distance;

      let vec3 = cameraPosition;

      vec3.x = offsetX;
      vec3.z = offsetZ;

      // @ts-ignore
      // cameraRef.current.position.lerp(new Vector3(vec3.x, height, vec3.z), easeInOutCubic(Math.min(1, timeSinceTransition / transitionTime)));
      cameraRef.current.position.lerp(
        new Vector3(vec3.x, height, vec3.z),
        0.05
      );
    }

    // @ts-ignore
    cameraRef.current.lookAt(currentObjectPosition);
    props.setTarget(currentObjectPosition);
  });

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
  // const processGeometryColor = (geometry, segmentName) => {
  //   const positionCount = geometry.attributes.position.count;
  //   const colors = [];

  //   for (let i = 0; i < positionCount; ++i) {
  //     let currentPos = i / positionCount;
  //     let currentTemperaturePoint = Math.floor(
  //       segmentData.data[String(segmentName)].length * currentPos
  //     );

  //     // getTempColor returns a hex color, so we need to convert it to RGB
  //     // May change getTempColor to return RGB instead of hex later
  //     const temperatureColorRGB = hexToRgb(
  //       getTempColor(
  //         segmentData.data[String(segmentName)][currentTemperaturePoint].y
  //       )
  //     );

  //     colors.push(
  //       temperatureColorRGB.r / 255,
  //       temperatureColorRGB.g / 255,
  //       temperatureColorRGB.b / 255
  //     );
  //   }

  //   geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

  //   return geometry;
  // };

  const get_config = async () => {
    //get the 3D object configuration from the database for the current asset
    const result = await get_3d_config(props.asset.name);
    const unprocessed = result.data.fibers; //iterate through fibers and accessories and create meshes for each
    const fibers = unprocessed.map((n: string, index: number) => {
      //get the color for the fiber based on the temperature

      let colorTemp: string = "#FFFFFF";
      if (
        !isFiberTemperatureLoading &&
        fiberTemps?.data &&
        fiberTemps?.data?.fiber_data != undefined
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

        return (
          <mesh
            key={index}
            name={n}
            castShadow
            receiveShadow
            renderOrder={1}
            //@ts-ignore
            geometry={gltf.nodes[n].geometry}
            // material={gltf.nodes[n].material}
            position={[0, 0, 0]}
          >
            <meshPhongMaterial
              attach="material"
              // vertexColors={true}
              color={colorTemp}
              depthWrite={false}
              depthTest={false}
              opacity={1}
              transparent
              needsUpdate={true} // Force the material to update
            />
          </mesh>
        );
      }

      return (
        <mesh
          key={index}
          name={n}
          castShadow
          receiveShadow
          renderOrder={1}
          //@ts-ignore
          geometry={gltf.nodes[n].geometry}
          // material={gltf.nodes[n].material}
          position={[0, 0, 0]}
        >
          <meshPhongMaterial
            attach="material"
            color={colorTemp}
            depthWrite={false}
            depthTest={false}
            opacity={1}
            transparent
            needsUpdate={true} // Force the material to update
          />
        </mesh>
      );
    });

    const accessories = result.data["accessories"].map(
      //This sets the material for each accessory as set by the GLTF file
      (n: string, index: number) => {
        //check if the accessory exists in the gltf file
        if (gltf.nodes[n] == undefined) {
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
            material={gltf.nodes[n].material}
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
    <group {...props} dispose={null} scale={1} castShadow ref={groupRef}>
      <PerspectiveCamera makeDefault ref={cameraRef} />
      {objects[0]}
      {objects[1]}
    </group>
  );
}

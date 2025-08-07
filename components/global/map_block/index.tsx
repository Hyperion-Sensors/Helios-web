import React, { Suspense, useState, useEffect, useContext } from "react";
import Map, { Popup, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/legacy/image";
import { AssetContext } from "@/Context/asset_context";
import InfoCard from "../custom/info_card";
import useAssets from "@/Queries/asset_queries";
import StatusIndicator from "../custom/status_icon";

interface Asset {
  name: string;
  id: number;
  device: string;
  raw_table: string;
  tfit_id: number;
  settings_table: string;
  diagnostics_table: string;
  coordinates: number[];
  region: string;
  status: boolean;
  capacity: number;
  start: number;
  end: number;
}

type Props = {};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function NewMap({}: Props) {
  const [popupInfo, setPopupInfo] = useState<Asset | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const { currentAsset, changeCurrentAsset } = useContext(AssetContext);

  /*
  Purpose: Get data from the 'assets' query in react-query cache renamed as asset_data 

  How: The original cache has been preserved by dehydrating the QueryClient on server side and rehydrating it on the client side.
  This cache is subscribed to via the useAssets hook which returns a userQuery instance of the 'assets' query. However, data is available immediately even before 
  background fetch has started.
  
  */
  const { data: asset_data, isLoading: assets_loading } = useAssets();

  const [viewState, setViewState] = useState({
    latitude: currentAsset.coordinates[0],
    longitude: currentAsset.coordinates[1],
    zoom: 10,
  });

  useEffect(() => {
    setViewState({
      latitude: currentAsset.coordinates[0],
      longitude: currentAsset.coordinates[1],
      zoom: 10,
    });
  }, [currentAsset]);

  const markers = asset_data.map((asset, index) => (
    <Marker
      key={index}
      longitude={asset.coordinates[1]}
      latitude={asset.coordinates[0]}
      anchor="bottom"
      scale={1}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        // If we let the click event propagates to the map, it will immediately close the popup
        // with `closeOnClick: true`
        e.originalEvent.stopPropagation();
        //@ts-ignore
        setPopupInfo(asset);
        setShowPopup(true);
        changeCurrentAsset(asset);
      }}
    >
      <div className="w-7 h-7 2xl:w-14 2xl:h-14">
        {/* <Image src="/logo.png" layout="fill" objectFit="contain" /> */}
        <StatusIndicator
          value={asset.status}
          size={[5, 5]}
          styling={"bg-opacity-90 ring ring-secondary"}
        />
      </div>
    </Marker>
  ));

  if (assets_loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full w-full">
      {/* <div className="mb-1 flex flex-row">
        <h4 className="text-md font-medium">Asset Map</h4>

        <div className="h-5 w-5 group">
          <InfoCard
            title={"Map Instructions:"}
            description={
              " Map automatically re-centers when a new asset is in focus. Click on an asset to view more information. "
            }
            card_styles={
              "p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-10  bg-primary rounded-md shadow-lg top-5 -left-20 align-center "
            }
          />
        </div>
      </div> */}
      <div
        id="my-map"
        className=" justify-center h-full w-full items-center border border-accent-light rounded-md hover:border-accent-semi-light hover:border hover:shadow-inner"
      >
        <Suspense fallback={<div>bla...</div>}>
          <Map
            {...viewState}
            style={{
              borderRadius: "0.375rem",
            }}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/hossias/cl4mniuv9002614qle24fyi3c"
            mapboxAccessToken={MAPBOX_TOKEN}
            onRender={(event) => event.target.resize()}
            // onLoad={handleMapLoading}
          >
            {markers}
            {showPopup && (
              <Popup
                anchor="top"
                longitude={Number(currentAsset.coordinates[1])}
                latitude={Number(currentAsset.coordinates[0])}
                onClose={() => setShowPopup(false)}
              >
                <div className="p-2 rounded-md bg-primary">
                  <table className="table-auto ">
                    <tbody>
                      <tr>
                        <td className="font-bold">Assset Name:</td>
                        <td>{currentAsset.name}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Status:</td>
                        <td className="inline-flex">
                          <span className="text-md">
                            {currentAsset.status ? "Active" : "Offline"}
                          </span>
                          <div
                            className={`${
                              currentAsset.status ? "bg-success" : "bg-error"
                            } rounded-full w-2 h-2`}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Capacity:</td>
                        <td>{Math.round(currentAsset.capacity)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Popup>
            )}
          </Map>
        </Suspense>
      </div>
    </div>
  );
}

export default NewMap;

{
}

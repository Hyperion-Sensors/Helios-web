//Last edited by H.Ossias Aug 2023

/*------------------------Libraries--------------------------- */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Pool } from "pg";

import { QueryClient, dehydrate } from "@tanstack/react-query";

/*------------------------Components-------------------------- */
import ControlPanel from "@/3D/control_panel";
import ThreeDScene from "@/3D/scenes/main_scene";
import useAssets from "@/Queries/asset_queries";
import { get_all_assets } from "@/API/asset_services";

/*-------------------------Context-----------------------------*/
import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";
import { VisualizerProvider } from "@/Context/visualizer_context";

export default function Visualizer({ assets, latest_time }) {
  const { setLatestTimes, setSidePanelButtonVisible } = useContext(AppContext);
  const { currentAsset, changeCurrentAsset } = useContext(AssetContext);

  const { data: asset_data, isFetching: asset_isFetching } = useAssets();

  useEffect(() => {
    setSidePanelButtonVisible(true);
  });

  useEffect(() => {
    setLatestTimes(latest_time);
    if (!currentAsset && !asset_isFetching && asset_data) {
      changeCurrentAsset(asset_data[0]);
    }
  });

  return (
    <VisualizerProvider>
      {currentAsset ? (
        <div id="3D_page" className="h-full w-full relative">
          <div
            id="control_panel"
            className="flex flex-row  absolute gap-1 left-2 z-20 h-10  mt-5 rounded-lg p-1"
          >
            <ControlPanel />
          </div>

          <ThreeDScene
            currentAsset={{
              name: currentAsset ? currentAsset.name : "fiber_group_1",
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <span className="loading loading-spinner w-[7.5rem] h-[7.5rem] text-center text-secondary"></span>
        </div>
      )}
    </VisualizerProvider>
  );
}
export async function getServerSideProps() {
  const pool = new Pool({
    connectionString: process.env.DB_HOST,
  });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["assets"], () => get_all_assets());

  try {
    const latest_time_results = await pool.query(
      "SELECT DISTINCT ON (a.id) a.id, (lt.time::TEXT), lt.fiber_id FROM asset a LEFT JOIN fiber f ON f.asset_id = a.id LEFT JOIN latest_time lt ON f.id = lt.fiber_id WHERE time IS NOT NULL"
    );

    const latest_time = latest_time_results.rows;

    return {
      props: {
        latest_time,
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  } finally {
    pool.end();
  }
}

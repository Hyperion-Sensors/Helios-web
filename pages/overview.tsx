/*-----------------------------Library Imports------------------------------ */
import React, { Suspense, useContext, useEffect, useMemo } from "react";
import { subHours, format } from "date-fns";

/*-----------------------------Context Imports------------------------------ */
import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";
import { OverviewProvider } from "@/Context/overview_context";

/*-----------------------------Components Imports------------------------------ */
import ThreeDScene from "../components/pages/visualizer_page/scenes/mini_scene";
import SegmentsTable from "../components/global/tables/segments-table";
import NotificationsTable from "@/Global/tables/notifications-table";

/*-------------------------------API Imports------------------------------------- */
import { Pool } from "pg";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { get_all_assets } from "@/API/asset_services";
import useAssets from "@/Queries/asset_queries";
import { useSettings } from "@/Queries/settings_queries";
import { useSession } from "next-auth/react";
import AnalyticsTabs from "components/pages/overview_page/overview-tabs";
import HeliosIcon from "@/Global/icons";
import ExpandTab from "components/pages/overview_page/expand_tab";

export default function Overview({ latest_time }) {
  const { changeCurrentAsset, currentAsset, currentSegment } =
    useContext(AssetContext);
  const { setLatestTimes, setSidePanelButtonVisible, toggleSidePanelVisible } =
    useContext(AppContext);
  const { data: session } = useSession();

  /* 
  
  The line below uses the immediate data from the rehydrated cache. Then re-fetches the data in the background to ensure the data is the same. 
  we can use the isFetching boolean to determine to display a loading symbol or not as this happens. 
  */
  const { data: assetData, isFetching: asset_isFetching } = useAssets();
  //get settings from query client

  const { data: settingsData } = useSettings(session.user.id);

  useEffect(() => {
    setSidePanelButtonVisible(true);
  });

  useEffect(() => {
    if (assetData) {
      changeCurrentAsset(assetData[0]);
    }
    setLatestTimes(latest_time);
  }, [assetData]);

  // Get the date from 8 hours ago
  const now = new Date();
  const eightHoursAgo = subHours(new Date(), 24);

  if (currentAsset) {
    return (
      <OverviewProvider>
        <div className="grid grid-cols-7 grid-rows-5 h-[200vh] xl:h-[100vh] gap-6 px-5 pt-2 pb-10 w-full">
          <div
            id="segment-housing"
            className=" row-start-1 row-span-2 col-start-1 col-span-3 m-3"
          >
            <div
              id="segment-card"
              className="w-full h-full rounded-lg shadow-lg bg-primary p-2 "
            >
              <SegmentsTable />
            </div>
          </div>
          <div
            id="notifications-housing"
            className="row-start-3 row-span-4 col-start-1 col-span-3 m-3"
          >
            <div
              id="notifications-card"
              className="w-full h-full rounded-lg shadow-lg bg-primary p-2"
            >
              <NotificationsTable />
            </div>
          </div>
          {/*--------------------------------Three-D & Segment History / Map-------------------------------- */}
          <div
            id="overview-main-housing"
            className="row-start-1 row-span-6 col-start-4 col-span-4 m-3"
          >
            <div
              id="overview-main-card"
              className="w-full h-full rounded-lg shadow-2xl border-neutral bg-secondary flex flex-col p- relative group"
            >
              <div
                id="control-info"
                className="z-50 absolute w-1/2 rounded-md "
              >
                <span className="text-xs  2xl:text-sm text-primary  group-hover:block hidden font-medium w-full p-3 group-hover:bg-primary/20 border border-primary">
                  Select the desired sensor zones from the panel on the left to
                  visualize their precise locations within this 3D model
                </span>
                <div className="h-5 w-5 xl:h-7 xl:w-7 text-primary  group-hover:hidden block">
                  <HeliosIcon
                    icon_class={"info"}
                    icon_type={"basic"}
                    color={"fill-secondary/10"}
                    stroke={"stroke-primary"}
                  />
                </div>
              </div>

              {currentSegment == undefined ? (
                <div>No Current Segment</div>
              ) : (
                <ThreeDScene currentAsset={currentAsset} />
              )}
              <div className="w-full h-2/3 bg-primary rounded-b-lg flex flex-col gap-1 relative">
                <div className="absolute z-40 right-2 top-2">
                  <ExpandTab content={<AnalyticsTabs />} />
                </div>
                <AnalyticsTabs />
              </div>
            </div>
          </div>
        </div>
      </OverviewProvider>
    );
  }
}
export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await get_all_assets();
  // const assets = await res.data;

  // Set up a new PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DB_HOST,
  });
  const queryClient = new QueryClient();

  /*
  Purpose: Get data for the 'settings' 'assets' query in react-query cache renamed as asset_data and dehydrate for client-side use.

 This is where the original QueryClient cache is created and preserved for client side rehydration. Note, this method should only used
 universally throughout the application. Above, getServerSideProps was changed to getServerSideProps as the data will be background fetched on client side.

 Look above (~row 29) OR at global/map_block for more information. Or better yet, the Obsidian Software Docs in dev_guide if available. 
  */

  // EXAMPLE: The code below is a proper implementation of this method as it is static but can be updated dynamically on a background fetch client side.
  await queryClient.prefetchQuery(["assets"], () => get_all_assets());

  try {
    const latest_time_results = await pool.query(
      "SELECT DISTINCT ON (a.id) a.id, (lt.time::TEXT), lt.fiber_id FROM asset a LEFT JOIN fiber f ON f.asset_id = a.id LEFT JOIN latest_time lt ON f.id = lt.fiber_id WHERE time IS NOT NULL"
    );

    const latest_time = latest_time_results.rows;

    // Return the rows as props
    return {
      props: {
        //removed assets and query from props
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
    // Close the database pool when we're done with it
    pool.end();
  }
}

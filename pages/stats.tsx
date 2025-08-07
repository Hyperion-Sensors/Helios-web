import React, { useEffect, useContext } from "react";
/*-----------------------------Context------------------------------ */
import { StatsProvider } from "@/Context/stats_context";
import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";

/*-----------------------------Components------------------------------ */
import Dashboard from "components/pages/stats_page/dashboard/dashboard";

/*-------------------------------API------------------------------------- */
import { Pool } from "pg";
import { get_all_assets } from "@/API/asset_services";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import useAssets from "@/Queries/asset_queries";

const Analytics = ({ assets, latest_time }) => {
  const { latestTimes, setLatestTimes, setSidePanelButtonVisible } =
    useContext(AppContext);

  const { changeCurrentAsset, currentAsset } = useContext(AssetContext);

  const { data: assetData, isFetching: asset_isFetching } = useAssets();

  useEffect(() => {
    setSidePanelButtonVisible(true);
  });

  useEffect(() => {
    setLatestTimes(latest_time);
    if (assetData) {
      changeCurrentAsset(assetData[0]);
    }
  }, [assetData]);

  return currentAsset ? (
    <StatsProvider>
      <div className="w-full h-full py-3 px-3">
        <Dashboard />
      </div>
    </StatsProvider>
  ) : (
    <div className="flex flex-row justify-center items-center">
      <span>Data is Loading</span>
    </div>
  );
};

export default Analytics;

export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await get_all_assets();
  // const assets = await res.data;

  // Set up a new PostgreSQL connection pool
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

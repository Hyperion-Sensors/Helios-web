/*---------------------------------Libraries-------------------------------------*/
import React, { useContext, useEffect } from "react";
import { Pool } from "pg";
import { QueryClient, dehydrate } from "@tanstack/react-query";

/*----------------------------------Context--------------------------------------*/
import { AppContext } from "@/Context/app_context";
import { SettingsProvider } from "@/Context/settings_context";

/*---------------------------------API Hooks-------------------------------------*/
import { get_all_assets } from "@/API/asset_services";
import useAssets from "@/Queries/asset_queries";

/*---------------------------------Components------------------------------------*/
import SettingsTabs from "@/Settings/settings_tabs";

/*---------------Load tabs based on settings_types.json--------------------*/

export default function Settings({ latest_time }) {
  const { toggleSidePanelVisible, setSidePanelButtonVisible } =
    useContext(AppContext);
  //get asset data from query cache
  const { data: assetData, isError: assetErrored } = useAssets();

  useEffect(() => {
    setSidePanelButtonVisible(false);
  });

  /*-------------------------------On Mount--------------------------------- */
  return assetErrored ? (
    <div>error fetching assets</div>
  ) : (
    <SettingsProvider>
      <div className="w-full h-full my-3 ">
        <div className="card w-2/3 h-full m-auto rounded-md  px-10  gap-4 overflow-y-auto ">
          <SettingsTabs />
        </div>
      </div>
    </SettingsProvider>
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

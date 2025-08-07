import React, { useContext, useEffect, useState } from "react";

/*-----------------------------Context------------------------------ */
import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";

/*-------------------------------API Imports------------------------------------- */
import { Pool } from "pg";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { get_all_assets } from "@/API/asset_services";

/*-------------------------------Component Imports------------------------------------- */
import SurvivalAnalysis from "components/pages/forecast_page/survival_analysis";
import HealthIndex from "components/pages/forecast_page/health_index";
import Disclaimer from "components/pages/forecast_page/disclaimer";
import useAssets from "@/Queries/asset_queries";
import ForecastInputs from "components/pages/forecast_page/inputs";
import { ForecastProvider } from "@/Context/forecast_context";
import HeliosIcon from "@/Global/icons";

export default function Forecast({ latest_time }) {
  const { changeCurrentAsset } = useContext(AssetContext);
  const { data: assetData, isFetching: asset_isFetching } = useAssets();
  const { setLatestTimes, setSidePanelButtonVisible } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSidePanelButtonVisible(true);
  });
  useEffect(() => {
    if (assetData) {
      changeCurrentAsset(assetData[0]);
    }
    setLatestTimes(latest_time);
  }, [assetData]);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 10000); // Adjust the delay as needed (e.g., 1000ms = 1 second)
  }, []);

  return (
    <ForecastProvider>
      <div className="relative flex flex-col w-full h-full sm:gap-6 xl:gap-8 p-5">
        <div className="flex flex-row justify-center items-center w-full h-full basis-1/12">
          <ForecastInputs />
        </div>
        <div className="flex flex-row basis-9/12 gap-6 h-full w-full">
          <SurvivalAnalysis />
          <HealthIndex />
        </div>
        <Disclaimer isOpen={isOpen} setIsOpen={(v) => setIsOpen} />
      </div>
    </ForecastProvider>
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

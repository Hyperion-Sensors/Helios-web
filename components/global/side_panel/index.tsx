import React, { useContext, useEffect, useState } from "react";

/*----------------------------Context-------------------------------*/
import { AssetContext } from "@/Context/asset_context";
import { AppContext } from "@/Context/app_context";
import { AssetSelectionProvider } from "@/Context/app_context/asset_selection";

/*----------------------------Components-------------------------------*/
import AssetSummary from "./asset_summary";
import SubstationSummary from "./substation_summary";
import Divider from "@/Global/custom/divider";
import AssetSelectionMenu from "./asset_selection";
import PageChanger from "../navbar/page_changer";
import Greeting from "components/pages/overview_page/overview_summary/quick_info";
import useProblemFibers from "@/Queries/device_queries";

function SidePanel() {
  const { currentAsset } = useContext(AssetContext);
  const { latestTimes } = useContext(AppContext);

  const [summaryOpen, toggleSummary] = React.useReducer(
    (state) => !state,
    false
  );

  /*-------------------------------Process GET /problem-fibers data -------------------------------- */

  if (currentAsset) {
    return (
      <div className="flex flex-col justify-between w-full max-h-screen h-full px-2 overflow-y-auto">
        <div className="mb-2 mt-3 xl:mt-5">
          <PageChanger />
        </div>
        <div className="mb-2 mt-2">
          <div id="asset-selection-divider-container" className="w-full mb-2 ">
            <Divider
              title="Quick Info"
              toggle={() => toggleSummary()}
              state={summaryOpen}
            />
          </div>
          <div className="flex  w-full justify-between gap-2  rounded-md">
            <div
              className={`${
                summaryOpen ? "visible" : " truncate h-2 blur-sm"
              } w-full px-4 flex flex-col`}
            >
              <Greeting times={latestTimes} open={summaryOpen} />
            </div>
          </div>
        </div>

        <div className=" basis-5/12 flex flex-col justify-start gap-2  w-full overflow-y-auto">
          <div id="asset-selection-divider-container" className="w-full">
            <Divider title="Asset Selection" />
          </div>
          <AssetSelectionProvider>
            <AssetSelectionMenu />
          </AssetSelectionProvider>
        </div>

        <div className="basis-3/12 flex flex-col justify-between w-full ">
          <div id="asset-summary-container" className="flex flex-col h-full ">
            <AssetSummary />
          </div>
        </div>
        <div className="basis-3/12 flex flex-col justify-start  ">
          <div
            id="substation-summary-container"
            className="flex flex-col h-full "
          >
            <SubstationSummary />
          </div>
        </div>
      </div>
    );
  } else {
    <div>loading...</div>;
  }
}

export default SidePanel;

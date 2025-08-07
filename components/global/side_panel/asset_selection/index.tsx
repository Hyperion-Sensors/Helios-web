/*-------------------------Library-------------------------- */
import React, { useContext, useEffect, useState } from "react";

/*-------------------------API-------------------------- */
import {
  get_all_regions,
  get_all_tfits,
} from "hooks/endpoints/device_services";
import { useRegions, useTfits } from "@/Queries/asset_queries";

/*-------------------------Components-------------------------- */
import AssetFilter from "../asset_filter_bar/asset_filter";
import AssetCollection from "../asset_selection/asset_collection";
import DeviceCollection from "./device_collection";

/*-------------------------Context-------------------------- */
import { AssetSelectionContext } from "@/Context/app_context/asset_selection";

function AssetSelectionMenu() {
  const {
    setTfitNames,
    filters,
    setRegions,
    setFilters,
    setInitialFilters,
    initialFilters,
  } = useContext(AssetSelectionContext);

  const { data: allTfitData, isLoading: isAllTfitLoading } = useTfits();
  const { data: allRegionData, isLoading: isAllRegionLoading } = useRegions();

  useEffect(() => {
    if (!isAllTfitLoading && allTfitData) {
      const tfitNameMap = allTfitData.data.map((t) => {
        return t.name;
      });

      setTfitNames(tfitNameMap);
    }

    if (!isAllRegionLoading && allRegionData) {
      setRegions(allRegionData.data);
    }

    if (
      !isAllTfitLoading &&
      !isAllRegionLoading &&
      allTfitData &&
      allRegionData
    ) {
      const devData = {
        substations: allTfitData.data,
        regions: allRegionData.data,
      };

      if (initialFilters != devData) {
        setInitialFilters(devData);
      }

      setFilters({
        type: "change-all",
        payload: devData,
      });
    }
  }, [allTfitData, allRegionData]);

  return (
    <>
      <div
        id="asset-filter-container "
        className="px-2 bg-primary flex flex-row w-full gap-1 rounded-md border border-secondary bg-secondary/90 divide-x"
      >
        <AssetFilter position={"right-0"} filter_name="Regions" />
        <></>
        <AssetFilter position={"left-0 "} filter_name="Systems" />
      </div>
      <div id="asset-collection-container" className="h-full pl-2">
        {filters.regions.map((region, index) => (
          <DeviceCollection
            key={region + String(index)}
            region={region}
            defaultOpen={index == 0 ? true : false}
          />
        ))}
      </div>
    </>
  );
}

export default AssetSelectionMenu;

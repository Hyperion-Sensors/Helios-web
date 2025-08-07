/*-------------------------Library-------------------------- */
import React, { useContext, useState, useEffect, useReducer } from "react";
import { Disclosure } from "@headlessui/react";

/*-------------------------Components-------------------------- */
import Asset from "./asset";
import HeliosIcon from "@/Global/icons";

/*-------------------------Context-------------------------- */
import { AssetContext } from "@/Context/asset_context";
import { AssetSelectionContext } from "@/Context/app_context/asset_selection";
import useAssets, { useAssetCapacity } from "@/Queries/asset_queries";
import classNames from "classnames";

type Props = {
  region_input: string; //name of the region for whcih the asset collection is being rendered
};

function AssetsMenu({ region_input }: Props) {
  const { changeCurrentAsset, currentAsset } = useContext(AssetContext); //get the assets from the context
  const { tfitNames, regions, filters } = useContext(AssetSelectionContext); //get the tfits and regions from the context for the filtered substations and regions

  const [disclosure_items, setDisclosureItems] = useState([
    { name: "", component: () => <></> }, // this is the default value and also looks like a fish
  ]);

  const { data: asset_data } = useAssets();
  const { data: capacityData, isLoading: isCapacityLoading } =
    useAssetCapacity();

  /*-------------------------Asset_Collection Logic-------------------------- */

  useEffect(() => {
    const rows = (
      device: string //this function returns the rows of assets
    ) =>
      asset_data.map((asset, index) => {
        if (device !== undefined && device == asset.device)
          //if the device is not undefined and the tfit of the asset matches the device passed through context
          return (
            <div
              onClick={() => {
                asset;
                changeCurrentAsset(asset);
              }}
              className="w-full"
              key={index + "[" + asset.name + "]"}
            >
              {!isCapacityLoading && capacityData.data && (
                <Asset //render the asset component (each is a row in the asset selection menu under the substation)
                  notifications_amt={4}
                  assetName={asset.name}
                  capacity={capacityData.data[asset.name]}
                  id={asset.id}
                  status={asset.status}
                />
              )}
            </div>
          );
      });

    // render rows of assets based on the map method above from "rows" around line 31
    const asset_selector = (device: string) => (
      <div
        className=" text-center flex flex-col flex-grow  h-full  text-secondary text-xs overflow-x-hidden overflow-y-auto scrollbar 
      scrollbar-thumb-accent-semi-light scrollbar-track-accent-light ml-3 "
      >
        {rows(device)}
      </div>
    );

    const disclosure_items = filters.substations.map((tfit, index) => {
      if (tfit.location.region == region_input) {
        //if the tfits location region matches the region passed in through the context
        return { name: tfit.name, component: asset_selector(tfit.name) }; //passing asset_selector(region) as the component with rows of assets
      }
    });

    //@ts-ignore
    setDisclosureItems(disclosure_items);
  }, [tfitNames, regions, capacityData]);

  const discosure_items = disclosure_items.map(
    (
      item: { name: string; component: () => JSX.Element },
      index //type is inherited from passing asset_selector(region) as the component
    ) => {
      if (item != undefined) {
        let highlight_color =
          //multi-level coloring needed below
          currentAsset.device == item.name
            ? "bg-secondary/10 border hover:border-accent/50 shadow-lg border-l-accent font-bold text-xs "
            : "bg-primary text-xs";
        return (
          <Disclosure
            key={item.name + index}
            defaultOpen={currentAsset.device == item.name ? true : false}
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={classNames(
                    "group flex w-full justify-between  px-2 2xl:px-4 2xl:py-1 text-left  hover:bg-secondary/10  border-y border-secondary/10 rounded-md",
                    highlight_color
                  )}
                >
                  <span>{item.name}</span>
                  <div className="h-5 w-5">
                    <HeliosIcon
                      stroke={`stroke-1  group-hover:stroke-accent ${
                        open ? "stroke-accent" : "stroke-secondary"
                      }`}
                      icon_class="chevron"
                      icon_type={open ? "down" : "right"}
                      color="accent"
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className=" pb-2 text-sm text-secondary h-fit ">
                  {item.component}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      }
    }
  );

  return (
    <div className={`flex flex-col rounded-md  relative`}>
      {discosure_items}
    </div>
  );
}

export default AssetsMenu;

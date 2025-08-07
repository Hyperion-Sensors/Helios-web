/*-------------------------------Library--------------------------------- */
import React, { useContext, useEffect } from "react";

/*-------------------------------Component--------------------------------- */
import AssetCollection from "./asset_collection";

/*-------------------------------Library--------------------------------- */
import { Disclosure } from "@headlessui/react";
import HeliosIcon from "@/Global/icons";

type Props = {
  region: string;
  defaultOpen: boolean;
};

function DeviceCollection({ region, defaultOpen }: Props) {
  return (
    <>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button
              //multi-level coloring needed below
              className={
                `flex w-full justify-between rounded-md px-2 2xl:px-4 2xl:py-1 text-left text-xs font-medium text-secondary 
            hover:bg-secondary/30 border-x-2 border-l-secondary border-2 border-secondary/10` +
                (open ? " bg-secondary/10 " : "bg-secondary")
              }
            >
              <span>{region}</span>
              <div className="h-5 w-5">
                <HeliosIcon
                  stroke={`stroke-1 + ${
                    open ? "stroke-accent" : "stroke-secondary"
                  }`}
                  icon_class="chevron"
                  icon_type={open ? "down" : "right"}
                  color="secondary"
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="pl-2 pt-1 pb-2 text-secondary h-fit ">
              <AssetCollection region_input={region} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default DeviceCollection;

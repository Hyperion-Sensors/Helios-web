/*-------------------------------Library--------------------------------- */
import React, { useContext, useEffect } from "react";

/*-------------------------------Component--------------------------------- */
import AssetCollection from "./asset_collection";

/*-------------------------------Library--------------------------------- */
import { Disclosure } from "@headlessui/react";
import HeliosIcon from "@/Global/icons";

type Props = {
  region: string;
};

function DeviceCollection({ region }: Props) {
  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-sm bg-secondary px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 border-x-2 border-l-accent border-y border-accent/10 hover:bg-accent-light">
              <span>{region}</span>
              <div className="h-5 w-5">
                <HeliosIcon
                  stroke={"stroke-1 stroke-accent"}
                  icon_class="chevron"
                  icon_type={open ? "down" : "right"}
                  color="accent"
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="pl-2 pt-4 pb-2 text-sm text-gray-500 h-fit ">
              <AssetCollection region_input={region} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default DeviceCollection;

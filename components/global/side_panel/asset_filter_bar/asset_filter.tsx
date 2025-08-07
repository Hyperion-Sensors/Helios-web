/*-------------------------Library-------------------------- */
import { Fragment, useContext } from "react";
import HeliosIcon from "@/Global/icons";
import { Popover, Transition } from "@headlessui/react";
import FilterDropdown from "./filter_dropdown";

/*-------------------------Context-------------------------- */
import { AssetSelectionContext } from "@/Context/app_context/asset_selection";

type Props = {
  filter_name: string;
  position: string;
};

export default function AssetFilter({ filter_name, position }: Props) {
  const { tfitNames, regions, setFilters, initialFilters, setInitialFilters } =
    useContext(AssetSelectionContext);

  return (
    <div id="asset-filter" className=" w-full  ">
      <Popover className="">
        {({ open }) => (
          <>
            <Popover.Button
              className={`border-secondary/30 flex flex-row justify-between items-center gap-3 px-1 2xl:py-1 w-full group`}
            >
              <div className="text-xs 2xl:text-sm font-semibold text-primary">
                {filter_name}
              </div>
              <div className="w-5 h-5">
                <HeliosIcon
                  stroke="stroke-1"
                  icon_class="chevron"
                  icon_type={"down"}
                  color="stroke-primary group-hover:stroke-accent"
                />
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute ${position} z-10 transform  sm:px-0 w-full `}
              >
                {({ close }) => (
                  <div className="w-full px-3">
                    <div
                      id="dropdown"
                      //multi-level coloring needed below
                      className={
                        "divide-y divide-neutral-100 rounded shadow-lg border bg-primary border-secondary/50 w-full p-2 h-fit"
                      }
                    >
                      <FilterDropdown
                        close={() => close()}
                        /*if dropdown name for Systems changes, this also needs a change*/
                        content={
                          filter_name == "Systems"
                            ? tfitNames
                            : initialFilters.regions
                        }
                        /*if dropdown name for Systems changes, this also needs a change*/
                        filter_type={
                          filter_name == "Systems" ? "system(s)" : "region(s)"
                        }
                      />
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

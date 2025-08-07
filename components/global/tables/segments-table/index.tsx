//H.Ossias (August 2023)
/*-----------------------------------Library Imports------------------------------------ */
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";

/*------------------------------------API Imports--------------------------------------- */
import { useAssetFiberTemperatures, useFibers } from "@/Queries/asset_queries";

/*----------------------------------Context Imports------------------------------------- */
import { AssetContext } from "@/Context/asset_context";

/*----------------------------------Custom Imports------------------------------------- */
import Columns from "./columns";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";
import { convertToFahrenheit } from "@/Helpers/unit_helper";
import StatusIndicator from "@/Global/custom/status_icon";
import HeaderTitle from "@/Global/misc/card-search-title";
import HeliosIcon from "@/Global/icons";

type Props = {};

function SegmentsTable({}: Props) {
  /*------------------------- Context Retrieval ------------------------- */
  const { currentAsset, changeCurrentSegment, currentSegment } =
    useContext(AssetContext);
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);
  const isImperial = settingsData?.data_options.Unit_System == "imperial";

  /*------------------------- State Logic ------------------------- */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  /*------------------- Fiber Segment Data Retrieval -------------------- */
  const { data: fiberTemps, isLoading: isFiberTempsLoading } =
    useAssetFiberTemperatures(currentAsset.id);

  const { data: fibers, isLoading: isFibersLoading } = useFibers(
    currentAsset.id
  );
  /*--------------------------- Main Logic ----------------------------- */

  useEffect(() => {
    if (currentAsset && fibers) {
      // Update state2 when state1 becomes undefined
      changeCurrentSegment({
        id: fibers.data[0].id as number,
        name: fibers.data[0].name as string,
      });
    }
  }, [fibers]);

  const data = useMemo(() => {
    //check if fiberTemps has loaded and if so map the data to that in which react-table can compare against columns.js
    /*
      Required Structure => [{accessor_key:______, other_info:....}, {accessor_key:______, other_info:....},  ...   ]
    
    */
    if (
      !isFiberTempsLoading &&
      !isFibersLoading &&
      fiberTemps &&
      fibers &&
      fiberTemps?.data?.fiber_data
    ) {
      return fibers.data.map((item: any, index) => {
        const fiber_data = fiberTemps.data.fiber_data[item.name];
        const tempMax = fiber_data != undefined ? fiber_data.max : null;
        const tempAvg = fiber_data != undefined ? fiber_data.avg : null;
        return {
          ...item,
          max: isImperial //check if imperial or metric from settings
            ? Math.round(convertToFahrenheit(tempMax) * 10) / 10 //convert to imperial if needed and round
            : Math.round(tempMax * 10) / 10,
          avg: isImperial //check if imperial or metric from settings
            ? Math.round(convertToFahrenheit(tempAvg) * 10) / 10 //convert to imperial if needed and round
            : Math.round(tempAvg * 10) / 10,
          status: tempMax < 50, //required for status indicator
          fiber_id: item.id, //needs to be included for table "Onclick => changeCurrentSegment" to work
        };
      });
    } else if (!isFibersLoading && fibers) {
      // if fiberTemps has not loaded, just map the fiber data so we can still select segments
      return fibers.data.map((item: any, index) => {
        return {
          ...item,
          max: "Unknown",
          avg: "Unknown",
          status: false,
          fiber_id: item.id, //needs to be included for table "Onclick => changeCurrentSegment" to work
        };
      });
    }

    return [];
  }, [fiberTemps, fibers, isFiberTempsLoading, isFibersLoading]);

  //Create the table logic using the react-table library
  const table = useReactTable({
    // 1) assign the data created above with useMemo
    data,

    // 2) assign the columns defined in columns.tsx
    columns: Columns,

    // 3) get the core row model to parse data render out rows of the table
    getCoreRowModel: getCoreRowModel(),

    // 4) get the sorted row model to  render out rows of the table in ascending or descending order
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    // any necessary state changes to in here, assign the state value to this attribute
    state: {
      sorting,
      globalFilter: filtering,
    },

    // the function(s) below are imported and are given hooks to run when the state changes
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  //if the fiberTemps are loading, show a loading icon
  if (isFiberTempsLoading) {
    return (
      <span className="loading loading-spinner loading-md text-secondary"></span>
    );
  }

  if (currentSegment) {
    return (
      <div className=" h-full  flex flex-col overflow-y-auto p-2">
        <HeaderTitle
          content={"Sensor Zones"}
          description={
            "These are the most important components of the asset. Select one to view it on the 3D tool to the right."
          }
          search={true}
          searchPlaceholder={"Search zones..."}
          searchFunction={setFiltering}
          searchValue={filtering}
        />

        <table
          id="segments-table"
          className="min-w-full text-left font-light w-full "
        >
          <thead className="border-b-2 bg-primary font-medium shadow-lg dark:border-neutral-500 dark:text-neutral-800 sticky -top-2 z-10 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {
                  //generic @tanstack/react-tables syntactic sugar
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 2xl:px-6 sm:py-1 "
                      id="segments-table-header"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex flex-row ">
                        {header.isPlaceholder ? null : (
                          <span
                            id="segments-header-title"
                            className="text-xs 2xl:text-sm "
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                        )}
                        <div id="sorting-icon" className="w-5 h-5 ">
                          {
                            //Following logic checks the sort order and renders the appropriate icon
                            {
                              //short for switch to check which type of sort is being used
                              asc: (
                                <HeliosIcon
                                  icon_class={"chevron"}
                                  icon_type={"up"}
                                  color={"fill-secondary"}
                                  stroke={"stroke-primary stroke-1"}
                                />
                              ),
                              desc: (
                                <HeliosIcon
                                  icon_class={"chevron"}
                                  icon_type={"down"}
                                  color={"fill-secondary"}
                                  stroke={"stroke-primary stroke-1"}
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null
                          }
                        </div>
                      </div>
                    </th>
                  ))
                }
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b dark:border-neutral-500 hover:bg-secondary/10 ${
                  currentSegment.id == row.original.fiber_id
                    ? "bg-secondary/20"
                    : ""
                }`}
                onClick={() =>
                  changeCurrentSegment({
                    id: row.original.fiber_id as number,
                    name: row.original.name as string,
                  })
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-2 2xl:px-6 py-2 2xl:py-4 font-medium text-xs 2xl:text-sm"
                  >
                    {/* react table magic renderer*/}
                    {[
                      flexRender(cell.column.columnDef.cell, cell.getContext()),
                    ]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SegmentsTable;

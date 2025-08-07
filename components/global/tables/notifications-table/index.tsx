//H.Ossias (August 2023)
/*-----------------------------------Library Imports------------------------------------ */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

/*------------------------------------API Imports--------------------------------------- */
import { getNotifications } from "@/Queries/notification_queries";

/*----------------------------------Context Imports------------------------------------- */
import { AssetContext } from "@/Context/asset_context";
/*----------------------------------Custom Imports------------------------------------- */
import Columns from "./columns";

import useAssets, { useAssetFiberTemperatures } from "@/Queries/asset_queries";
import HeaderTitle from "@/Global/misc/card-search-title";

export default function NotificationsTable() {
  // const [notifications, setNotifications] = useState([]);
  const { currentAsset } = useContext(AssetContext);
  /*--------------------------- State Logic ----------------------------- */
  const [filtering, setFiltering] = useState("");

  /*------------------- Notification Segment Data Retrieval -------------------- */
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isFetching: isNotificationsFetching,
    refetch,
  } = getNotifications();

  /*--------------------------- Main Logic ----------------------------- */

  const processNotifications = (notifications: any) => {
    if (notifications) {
      return notifications.map((item: any) => {
        const { key, ...rest } = item;
        return {
          ...rest,
        };
      });
    }
  };

  let data = useMemo(() => {
    if (!isNotificationsLoading && notifications) {
      return processNotifications(notifications);
    } else {
      return [];
    }
  }, [notifications, isNotificationsLoading]);

  const table = useReactTable({
    //more info in segment-table/index.tsx
    data,
    columns: Columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  if (isNotificationsLoading || isNotificationsFetching) {
    return (
      <span className="loading loading-dots loading-md text-secondary"></span>
    );
  }

  return (
    <div className="h-full  flex flex-col overflow-y-auto  p-2">
      <HeaderTitle
        content="Notifications"
        description={"Recent Notifications from all systems"}
        search={true}
        searchPlaceholder={"Search notifications..."}
        searchFunction={setFiltering}
        searchValue={filtering}
      />

      <table
        id="segments-table"
        className="min-w-full text-left sm:text-[0.6rem] xl:text-sm font-light w-full "
      >
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b dark:border-neutral-500 hover:bg-secondary/20 "
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="whitespace-nowrap px-2 2xl:px-6 py-2 2xl:py-4 font-medium  "
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
      <button onClick={() => refetch()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}

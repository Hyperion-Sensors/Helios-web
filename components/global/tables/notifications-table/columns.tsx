import * as React from "react";
import { format } from "date-fns";
import { RowSelection } from "@tanstack/react-table";
const Columns = [
  {
    header: "Message",
    accessorFn: (row: any) => {
      return JSON.stringify({
        fiber_name: row.fiber_name,
        message: row.message,
      });
    },
    cell: (info: any) => {
      const val = JSON.parse(info.getValue());
      return (
        <div className="flex flex-col ">
          <span className="text-sm 2xl:text-base 3xl:text-lg  font-bold">
            {val.fiber_name}
          </span>
          <span className=" text-[0.6rem] 2xl:text-xs 3xl:text-sm">
            {val.message}
          </span>
        </div>
      );
    },
  },
  // {
  //   header: "Zone",
  //   accessorKey: "fiber_id",
  // },
  {
    header: "Asset",
    accessorFn: (row: any) => {
      return JSON.stringify({
        assetName: row.asset_name,
        alertLevel: row.alert_level,
      });
    },
    cell: (info: any) => {
      const val = JSON.parse(info.getValue());
      return (
        <span
          className={`text-[0.5rem] 2xl:text-xs 3xl:text-sm border-2 px-2 rounded-full ${
            val.alertLevel == "Medium"
              ? "bg-warning/20 border-warning"
              : "bg-error/50 border-error"
          } `}
        >
          {val.assetName}
        </span>
      );
    },
  },
  {
    header: "Alert Time",
    accessorFn: (row: any) =>
      format(new Date(row.time), "MMM-dd hh:mm") as string,
    cell: (info: any) => {
      const val = info.getValue();
      return <span className="text-xs 2xl:text-sm 3xl:text-base">{val}</span>;
    },
  },

  // ... Add other columns as needed
];
export default Columns;

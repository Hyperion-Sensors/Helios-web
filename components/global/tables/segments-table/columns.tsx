import StatusIndicator from "@/Global/custom/status_icon";

const Columns = [
  {
    header: "ID",
    accessorKey: "name",
    cell: (info: any) => {
      return <span className="text-xs font-extrabold">{info.getValue()}</span>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info: any) => {
      return info.getValue() == true ? (
        <span className="flex flex-row items-center gap-2">
          <span className="text-xs">normal</span>

          <StatusIndicator value={true} />
        </span>
      ) : (
        <span className="flex flex-row items-center gap-2">
          <span className="text-xs">warning</span>
          <StatusIndicator value={false} />
        </span>
      );
    },
    enableSorting: false,
  },
  {
    header: "Average Temp",
    accessorKey: "avg",
    enableSearch: false,
  },
  {
    header: "Max Temp",
    accessorKey: "max",
    enableSearch: false,
  },

  // ... Add other columns as needed
];
export default Columns;

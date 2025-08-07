/*--------------------------------Library Imports---------------------------*/
import React from "react";
import HeliosIcon from "@/Global/icons";
import { isEmpty } from "lodash";

/*--------------------------------Component Imports---------------------------*/
import { useS3Files } from "@/Queries/data_queries";

function RecentUploads() {
  const { data: s3Files } = useS3Files();
  return (
    <div className=" flex flex-row flex-wrap rounded-md border-4 border-secondary/50 border-dashed h-fit p-6 gap-y-2 overflow-y-auto">
      {s3Files && s3Files.length ? (
        s3Files.map((file, index) => (
          <span
            key={index}
            className="flex flex-col text-xs font-bold items-center gap-1 w-1/2 text-clip overflow"
          >
            <button
              className="btn btn-square  bg-primary ring ring-secondary/50 rounded-md "
              onClick={() => alert("Quick access downloads coming soon....")}
            >
              <div className="h-5 w-5">
                <HeliosIcon
                  icon_class={"table"}
                  icon_type={"basic"}
                  color={""}
                  stroke={"stroke-1 stroke-secondary"}
                />
              </div>
            </button>
            <p className="break-all"></p>
            {file.Key}
          </span>
        ))
      ) : (
        <div className="text-xs font-bold text-center">No recent uploads</div>
      )}
    </div>
  );
}

export default RecentUploads;

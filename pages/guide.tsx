import React, { useContext, useEffect } from "react";
import Image from "next/image";

import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";
export default function DataIO() {
  const { currentPage, changeCurrentPage } = useContext(AppContext);
  const { currentAsset } = useContext(AssetContext);

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-6">
      {" "}
      <div className="h-32 w-32 relative">
        {" "}
        <Image
          src={"/photon.gif"}
          fill={true}
          alt={""}
          className="rounded-md opacity-60"
        />
      </div>
      <span>
        <span className="text-md font-bold">Sorry...</span>
        <br />{" "}
        <span className="text-sm">
          this page is currently under development
        </span>
      </span>
    </div>
  );
}

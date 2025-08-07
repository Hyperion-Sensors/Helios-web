import React, { ReactElement, useContext, useEffect } from "react";

/*----------------------COMPONENTS----------------------*/
import UploadPage from "components/pages/dataio_page/upload_page/upload";
import DownloadPage from "components/pages/dataio_page/download_page/download";
import { AppContext } from "../context/app_context";
import GeneralTabs from "@/Global/misc/general_tabs";
import HeliosIcon from "@/Global/icons";
import RecentUploads from "components/pages/dataio_page/download_page/recent_uploads";

type tab = { name: string; component: ReactElement; description: string };

export default function DataIO() {
  const { toggleSidePanelVisible, setSidePanelButtonVisible } =
    useContext(AppContext);

  useEffect(() => {
    setSidePanelButtonVisible(false);
  });

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabs: tab[] = [
    {
      name: "Upload",
      component: <UploadPage />,
      description:
        "Upload historical asset data for increased detail in analytics.",
    },
    {
      name: "Download",
      component: <DownloadPage />,
      description:
        "Download system specific data such as temperature history, sensor_zones, etc..",
    },
  ];

  return (
    <div className="grid grid-rows-6 grid-cols-6 w-full h-full p-6 gap-6 ">
      <div className="card row-start-1 row-span-full col-start-1 col-span-4 rounded-md gap-4">
        <GeneralTabs tabs={tabs} title={"Data I/O"} />
      </div>
      <div className="flex flex-col row-start-1 row-span-full col-start-5 col-span-2 gap-4">
        <div className="bg-primary w-full p-2 rounded-md shadow-lg font-bold">
          Recent Uploads
        </div>
        <RecentUploads />
      </div>
    </div>
  );
}

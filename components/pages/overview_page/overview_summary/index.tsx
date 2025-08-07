import { get_all_tfits } from "hooks/endpoints/device_services";
import MapBlock from "@/Global/map_block";
import React, { useContext, useEffect, useState } from "react";

import NotificationsTable from "@/Global/notifications";

type Props = {
  times: { id: number; time: string; fiber_id: number }[];
};

const OverviewSummary = (props: Props) => {
  const [numTfits, setNumTfits] = useState<number>(0);

  /*get the total number of tfit devices owned by client */
  const getNumTfits = async () => {
    const result = await get_all_tfits();
    setNumTfits(result.data.length);
  };

  /*On mount get the number of tfits and set in state*/
  useEffect(() => {
    getNumTfits();
  }, []);

  return (
    <div
      id="overview_summary"
      className=" flex flex-col justify-between gap-8 h-full "
    >
      {/* In order of left to right  */}
      {/* Overview Greeting */}

      <div className="basis-7/12 ">
        <NotificationsTable />
      </div>

      {/* <div className="col-start-1 col-span-5 row-start-2 row-span-3 pt-3">
      </div> */}

      <div className="basis-5/12">
        <MapBlock />
      </div>
    </div>
  );
};

export default OverviewSummary;

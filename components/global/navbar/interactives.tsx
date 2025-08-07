/*------------------------Libraries------------------------- */
import React, { useState } from "react";

/*------------------------Context------------------------- */
import { AppContext } from "@/Context/app_context";

/*------------------------Components------------------------- */
import HeliosIcon from "../icons";
import HeaderDropdown from "../header/header_dropdown";
import { signOut } from "next-auth/react";

type Props = { name: string };

function Interactives({ name }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  //if the current page is the same as the page id, then add the border to the left and right of the page. Right div to avoid icon potisioning issues
  return (
    <div onMouseLeave={() => setOpen(false)}>
      {/* <div
        className="relative items-center my-auto group"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
      >
        <div className=" group-hover:text-accent-orange-500 border border-accent-light shadow-lg inline-flex items-center w-8 h-8 xl:w-9 xl:h-9 xl:text-xl text-bold bg-secondary text-text text-center justify-center rounded-full">
          {name[0]}
          <div
            className={`absolute left-32 top-0 h-5 w-5  ${
              open ? "block" : "hidden"
            }`}
          >
            <HeaderDropdown />
          </div>
        </div>
      </div> */}
      <div className=" flex flex-row justify-center items-center h-14 w-full my-auto  group">
        <div className="h-5 w-5 xl:h-7 xl:w-7 relative">
          <HeliosIcon
            icon_class={"bell"}
            icon_type={"basic"}
            stroke={" stroke-accent group-hover:stroke-accent-orange-500/50 "}
            color={" group-hover:fill-accent-orange-500/50 fill-secondary"}
          />
          <div className="text-xs text-center w-2 h-2 rounded-full absolute bottom-6 left-6 bg-success"></div>
        </div>
      </div>
      <div
        id="logout"
        className={`group flex flex-row items-center justify-center py-6 border-error`}
        data-tip
        data-for={"logout-tooltip"}
        onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
      >
        <div className="h-5">
          <HeliosIcon
            icon_class={"auth"}
            icon_type={"logout"}
            color={"stroke-accent hover:stroke-accent-orange-500"}
            stroke={"stroke-2"}
          />
        </div>
      </div>
    </div>
  );
}

export default Interactives;

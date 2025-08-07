/*------------------------Libraries------------------------- */
import React, { useContext, useReducer } from "react";
import Image from "next/image";

/*------------------------Context------------------------- */
import { AppContext } from "@/Context/app_context";

/*------------------------Components------------------------- */
import { MainPages, UserPages } from "./main_pages";
import HeaderDropdown from "../header/header_dropdown";
import HeliosIcon from "../icons";

import { useSession } from "next-auth/react";

type Props = {
  name: string;
};
function Navbar({ name }: Props) {
  const { toggleSidePanelVisible, sidePanelButtonVisible } =
    useContext(AppContext);

  const { data: session, status } = useSession();

  const [open, changeOpen] = useReducer((state, action) => {
    switch (action) {
      case "toggle":
        return !state;
      case "open":
        return true;
      case "close":
        return false;
      default:
        return false;
    }
  }, false);

  //@ts-ignore
  const username = session?.user?.name || "User";

  return (
    <div
      className="grid grid-cols-1 grid-rows-6 h-full bg-secondary ease-in-out group group/navbar transition-all delay-500 duration-500"
      onMouseLeave={() => {
        setTimeout(() => changeOpen("close"), 5000);
      }}
    >
      <span className="col-span-1 row-span-1 flex flex-col gap-4 items-center hover:box-border">
        <div className="group-hover/navbar:hidden relative h-8 w-8 lg:h-10 lg:w-10 mt-4">
          <Image src="/logo.png" alt="image" fill={true} />
        </div>
        <div className="flex flex-row justify-between items-center gap-2 group-hover/navbar:visible invisible mt-2">
          <div className="relative h-8 w-full lg:h-12 lg:w-32 ">
            <Image
              src="https://hyperionhelios.s3.us-east-2.amazonaws.com/global_static_images/helios-logo.png"
              alt="image"
              fill={true}
            />
          </div>
          {sidePanelButtonVisible ? (
            <button
              className="w-5 h-8 lg:h-12"
              onClick={() => {
                toggleSidePanelVisible({ type: "toggle", payload: null });
              }}
            >
              <HeliosIcon
                icon_class={"bars"}
                icon_type={"basic"}
                color={"stroke-accent"}
                stroke={"stroke-2"}
              />
            </button>
          ) : (
            <></>
          )}
        </div>

        <input
          type="text"
          id="first"
          name="first"
          className="text-center bg-tertiary h-7 rounded-md group-hover/navbar:block hidden group-hover/navbar-item:border-accent border border-secondary/10 w-4/5"
          placeholder="Search..."
        />
      </span>

      <div className="col-span-1 row-span-4 flex flex-col justify-start mx-2 border-secondary/10">
        <MainPages />
        {/*use list component to render navbar options */}
        <div className="mx-4">
          <hr className="border border-tertiary" />
        </div>
        <UserPages />
      </div>

      <div className="col-span-1 row-span-1 flex flex-col items-center justify-end h-full  my-auto group py-3 ">
        <div className="flex flex-row justify-between items-center group-hover/navbar:text-accent w-full h-1/2 px-2 ">
          <div className="flex flex-row justify-center gap-2 items-center group-hover/navbar:text-accent-orange-500  w-full h-1/2  ">
            <div
              className=" group-hover:text-accent-orange-500 border-2 border-accent-semi-light shadow-lg inline-flex 
          items-center w-8 h-8 xl:w-9 xl:h-9 xl:text-xl text-bold bg-tertiary text-accent justify-center rounded-lg"
            >
              <p>{username[0]}</p>
            </div>
            <div className={`font-bold group-hover/navbar:block hidden`}>
              <h4 className="text-sm font-bold group-hover/navbar:block hidden transition delay-100">
                {username}
              </h4>
              <p className="text-xs">Toronto - CA</p>
            </div>
          </div>
          <button
            className="relative h-6 w-5 group-hover/navbar:block hidden "
            onClick={() => changeOpen("toggle")}
          >
            <HeliosIcon
              icon_class={"ellipsis"}
              icon_type={"vertical"}
              color={"stroke-primary"}
              stroke={"stroke-2"}
            />
            <div
              className={`absolute right-0 bottom-0 ${
                open ? "block" : "hidden"
              }`}
            >
              <HeaderDropdown />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

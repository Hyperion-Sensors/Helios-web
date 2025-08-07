/*------------------------Libraries------------------------- */
import React, { useContext } from "react";
import Link from "next/link";
/*------------------------Context------------------------- */
import { AppContext } from "@/Context/app_context";

/*------------------------Components------------------------- */
import HeliosIcon from "../icons";

type Props = {
  page_title: string;
  page_id: string;
  page_link: string;
  icon_class: string;
  icon_type: string;
  icon_scale: string;
};

function NavItem({
  page_id,
  page_link,
  page_title,
  icon_class,
  icon_type,
  icon_scale,
}: Props) {
  const { currentPage, changeCurrentPage } = useContext(AppContext);

  //use map function to turn array of the main application pages (main_page_data.json) into list components

  return (
    // The css adds a border to the left of the page that is currently selected
    // In order to not make the content move when the border is added, the border is added to the left and right of the page
    <li
      className={`group`}
      onClick={() => {
        changeCurrentPage(page_title);
      }}
      data-tip
      data-for={page_id ? page_id : "dashboard"}
    >
      <Link href={page_link}>
        {/* <div className="flex flex-row  justify-center items-center h-20 w-full my-auto group hover:bg-accent-light"> */}
        <div className="flex flex-row w-full rounded-md justify-center  h-10 my-6 group/navbar-item hover:bg-accent-orange-500 transition ease-in-out hover:transition-all delay-50 hover:-translate-y-1">
          <div className=" flex flex-row w-full justify-center group-hover/navbar:justify-start group-hover/navbar:ml-2 items-center gap-3 ">
            <div className={`h-${icon_scale} w-${icon_scale}`}>
              <HeliosIcon
                icon_class={icon_class}
                icon_type={icon_type}
                color={""}
                stroke={"stroke-2 stroke-primary "}
              />
            </div>
            <div className=" text-sm text-primary font-bold group-hover/navbar:block hidden group-hover/navbar-item:text-accent w-1/2">
              <p className="w-full ">{page_title}</p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default NavItem;

import React from "react";

/*---------------------Components-------------------*/
import HeliosIcon from "../icons";

/*---------------------Props-----------------------*/

type Props = {
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
};

function OpenCloseLine({ showSidebar, setShowSidebar }: Props) {
  return (
    <div className="w-4 h-full items-center flex border-r border-neutral">
      <div
        className="flex w-4 h-12 group/paneltab place-self-center items-center rounded-tl rounded-bl border-l border-y border-neutral-focus cursor-pointer"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <div className="w-4 h-4 place-self-center align-middle">
          <HeliosIcon
            icon_class={"chevron"}
            icon_type={`${showSidebar ? "right" : "left"}`}
            color={"stroke-secondary group-hover/paneltab:stroke-accent"}
            stroke={"stroke-2 stroke-linecap-round"}
          />
        </div>
      </div>
    </div>
  );
}

export default OpenCloseLine;

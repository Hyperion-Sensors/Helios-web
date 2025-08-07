import { StringNullableChain } from "lodash";
import React from "react";
import HeliosIcon from "../icons";

type Props = {
  title: string | null;
  toggle?: () => void;
  state?: boolean;
  besideContent?: JSX.Element;
};

const Divider = ({ title, toggle, state, besideContent }: Props) => {
  return (
    <div className="flex flex-row justify-center items-center w-full group">
      <hr className=" w-full border-secondary/50 border " />
      <span
        className=" text-center z-1 px-3 font-medium text-[0.5rem] text-xs 2xl:text-sm text-gray-900   
    dark:text-white dark:bg-gray-900 whitespace-nowrap flex flex-row gap-2 items-center"
      >
        {title || "or"}
        {besideContent}
        <button
          className={` ${
            toggle != undefined ? "block" : "hidden"
          } h-5 w-5 bg-secondary-light rounded-md border border-secondary-light group-hover:border-secondary`}
          onClick={() => toggle()}
        >
          <HeliosIcon
            icon_class={"chevron"}
            icon_type={state ? "down" : "up"}
            color={""}
            stroke={"stroke-2 stroke-secondary"}
          />
        </button>
      </span>

      <hr className=" w-full border-secondary/50 border " />
    </div>
  );
};

export default Divider;

//Created At: 9/12/2021, 11:06:00 PM By H.Ossias

import { useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import HeliosIcon from "../../global/icons";
/*
This component exists as a warning for users that the page they are viewing is 
under construction and may not be representative of the final product.
*/
type Props = {
  isOpen: boolean;
  setIsOpen: (boolean) => void;
};

function Disclaimer({ isOpen, setIsOpen }: Props) {
  return (
    <>
      <div className={`${isOpen ? "block" : "hidden"}`}>
        <Transition in={isOpen} timeout={500}>
          {(state) => (
            <div
              className={`${
                state === "entered" ? "scale-100" : "scale-0"
              } transform transition-transform duration-500 ease-in-out w-[75%] h-fit border-2 border-error/50 bg-error/20 m-2 p-2 text-sm xl:text-md rounded-lg`}
            >
              <h1 className="text-text text-lg xl:text-xl font-bold">
                This page is currently under construction
              </h1>
              <p></p>
              <p>
                The content on this page is a preview of a feature in
                development. While interactive, it is not representative of any
                real data or functionality and may be different on release.
              </p>
            </div>
          )}
        </Transition>
      </div>
      <div
        className={`flex items-center w-fit h-fit border-2 border-error/50 bg-error/20 p-1 rounded-sm ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <div className="h-fit w-6">
          <HeliosIcon
            icon_class={"warning"}
            icon_type={"triangle"}
            color={""}
            stroke={"stroke-2 stroke-error"}
          />
        </div>

        <h1 className="text-text text-xs font-bold">
          This page is currently under development and is meant for preview only
        </h1>
      </div>
    </>
  );
}

export default Disclaimer;

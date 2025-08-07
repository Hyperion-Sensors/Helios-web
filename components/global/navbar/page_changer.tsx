/*----------------------------------Library------------------------------- */
import React from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

/*----------------------------------Context------------------------------- */
import { AppContext } from "@/Context/app_context";

/*----------------------------------Context-a------------------------------ */
import HeliosIcon from "../icons";
import Pages from "./navbar_data.json";
import Link from "next/link";

function combineArrayVals(obj) {
  const arrays = Object.values(obj);
  return [].concat(...arrays);
}

type Props = {};

function PageChanger({}: Props) {
  const { currentPage, changeCurrentPage } = React.useContext(AppContext);

  const processed_pages = combineArrayVals(Pages);

  return (
    <Listbox value={currentPage} onChange={(value) => changeCurrentPage(value)}>
      <div
        className="relative  shadow-sm rounded-md bg-secondary/90 
       hover:bg-accent text-primary font-bold"
      >
        <Listbox.Button className="relative w-full cursor-default rounded-lg pl-3 pr-10 text-left ">
          <span className="block truncate text-xs 2xl:text-sm">
            {currentPage}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 w-7 xl:w-10">
            <HeliosIcon
              icon_class={"chevron"}
              icon_type={"up-down"}
              color={""}
              stroke={"stroke-1 stroke-primary"}
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md border-2 border-secondary/10 
          bg-base-100 py-1 text-secondary shadow-lg focus:outline-none sm:text-sm"
          >
            {processed_pages.map((page, index) => (
              <Link key={page + String(index)} href={page.link}>
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    ` relative cursor-default select-none py-2 pl-10 pr-4  ${
                      active ? "bg-secondary/10 text-accent" : "text-text"
                    }`
                  }
                  value={page.title}
                >
                  {({ selected }) => (
                    <div className="">
                      <span
                        className={`block truncate  ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div className="h-full w-full flex flex-row justify-center gap-5">
                          <div className="h-full w-5">
                            <HeliosIcon
                              icon_class={page.icon_class}
                              icon_type={page.icon_type}
                              color={""}
                              stroke={"stroke-2 stroke-secondary"}
                            />
                          </div>
                          <p className="flex flex-col w-1/2 justify-start">
                            {page.title}
                          </p>
                        </div>
                      </span>
                      {selected ? (
                        /* This is where the background of acive menu component is */
                        <div className="absolute inset-y-0  left-0 flex items-center text-amber-600 border-l-4 w-full bg-secondary-light "></div>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              </Link>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default PageChanger;
2;

import HeliosIcon from "@/Global/icons";
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

type Props = {
  title: string;
  data: any[];
  optLogic?: (new_data: any) => void;
};

function Select({ title, data, optLogic }: Props) {
  const [selected, setSelected] = useState(data[0]);

  useEffect(() => {
    if (optLogic) {
      //if there is optional on change functionality passed in through props
      optLogic(selected);
    }
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative z-10 w-full flex justify-center">
        <Listbox.Button className="w-fit group relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ">
            <div className="h-5 w-5">
              <HeliosIcon
                icon_class={"chevron"}
                icon_type={"down"}
                color={""}
                stroke={"stroke-secondary stroke-2 group-hover:stroke-accent"}
              />
            </div>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-secondary shadow-lg ring-1 ring-accent/20 focus:outline-none sm:text-sm">
            {data.map((n, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "text-secondary bg-secondary/50" : "text-secondary"
                  }`
                }
                value={n}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {n.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default Select;

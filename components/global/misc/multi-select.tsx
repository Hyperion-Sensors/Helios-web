import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import HeliosIcon from "../icons";

type Props = {
  title: string;
  data: number[] | string[];
  default_data?: number[] | string[];
  optLogic?: (new_data: number[] | string[]) => void;
  clear?: boolean | null;
};

export function MultiSelect({
  title,
  data,
  default_data,
  optLogic,
  clear,
}: Props) {
  const [selectedData, setSelectedData] = useState(default_data || []);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (optLogic) {
      //if there is optional on change functionality passed in through props
      optLogic(selectedData);
    }
  }, [selectedData]);

  const filteredData =
    query === ""
      ? data
      : //@ts-ignore
        data.filter((n) =>
          String(n)
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="w-full">
      {clear ? (
        <button
          className="btn btn-sm hover:btn-error absolute right-1 top-1"
          onClick={() => {
            optLogic([]);
            setSelectedData([]);
          }}
        >
          Clear
        </button>
      ) : (
        <> </>
      )}

      {/*@ts-ignore */}
      <Combobox value={selectedData} onChange={setSelectedData} multiple>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral focus:ring-0 group"
              displayValue={(data) => data.map((item) => item).join(",")}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Select or search..."
            />
            <Combobox.Button className="flex justify-end absolute inset-y-0 right-0 h-4/5 my-auto w-full">
              {" "}
              {/*w-full to ensure clicking the entire input opens the dropdown */}
              <div className="h-full w-1/6">
                {" "}
                {/*Need this to position the icon to the right side */}
                <HeliosIcon
                  icon_class={"chevron"}
                  icon_type={"up-down"}
                  color={"stroke-secondary"}
                  stroke={""}
                />
              </div>
            </Combobox.Button>
          </div>
        </div>

        <Combobox.Options>
          <div className=" shadow-lg bg-base-100 absolute z-50 rounded-lg border border-1 accent-light max-h-30 overflow-y-auto">
            {filteredData.map((option, index) => (
              <Combobox.Option key={index} value={option}>
                <div className="border-y p-1 hover:bg-neutral h-full ">
                  {option}
                </div>
              </Combobox.Option>
            ))}
          </div>
        </Combobox.Options>
      </Combobox>
    </div>
  );
}

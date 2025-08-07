/*-------------------------Library------------------------ */
import React, { useContext, useEffect, useRef } from "react";

/*-------------------------Context------------------------ */
import { AssetContext } from "@/Context/asset_context";
import { AssetSelectionContext } from "@/Context/app_context/asset_selection";

type Props = {
  content: string[];
  filter_type: string;
  close: () => void;
};

export default function FilterDropdown({ content, filter_type, close }: Props) {
  // Creating the initial filter options map for tracking checkbox changes quickly
  const filterOptions = useRef(null);
  const { filter, change_filter } = useContext(AssetContext);
  const { setTfits, setFilters, initialFilters, tfitNames, filters } =
    useContext(AssetSelectionContext);

  const handleClose = () => {
    //this function calls the close method passed in as a prop. Contains headless ui closing logic
    close();
  };

  useEffect(() => {
    //populating inital filter object with all false
    //copy data of filter object to different variable in different memory location
    let temp_filter = filter;
    temp_filter[filter_type] = content; //update filter options with new choices
    change_filter(temp_filter);

    let initObj = {};
    for (let i = 0; i < content.length; i++) {
      initObj[content[i]] = false; // this is the object to be changed by checkbox
      filterOptions.current = initObj;
    }
  }, [content]);

  /*Method to handle the state of the radio form */
  function handle_change(
    option: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    //when checked, update filter object
    filterOptions.current[option] = e.target.checked;
  }

  /*Function to handle the submit of radio form */
  function handle_submit(option: string, e: React.FormEvent<HTMLFormElement>) {
    //on submit button press
    e.preventDefault();
    let new_filter = filter; //new filter settings
    let choices = []; //user filter choices

    for (const [key, value] of Object.entries(filterOptions.current)) {
      //looping through filter object to form filter array of options type (tfit, region, or status)
      if (value) {
        choices.push(key); //for each option marked true by user, push that choice to choices array
      }
    }

    new_filter[option] = choices; //update filter options with new choices
    change_filter(new_filter);
    if (option === "regions") {
      setFilters({ type: "change-regions", payload: choices });
    } else {
      setTfits(choices);
      setFilters({
        type: "change-substations",
        payload: initialFilters.substations.filter((item) =>
          choices.includes(item.name)
        ),
      });
    }

    //changeFilters({ type: "change-" + option, payload: choices });
    // filter_assets();
    handleClose();
  }

  const options = content.map((n, index) => {
    return (
      <div className="flex items-center py-1 " key={index}>
        <input
          id="checked-checkbox"
          type="checkbox"
          defaultChecked={
            // tfitNames.includes(n) || filters.regions.includes(n) ? true : false
            false
          }
          onChange={(e) => {
            handle_change(n, e);
          }}
          className="w-4 h-4 text-blue-600 bg-neutral-100 rounded border-neutral-300 focus:ring-blue-500  focus:ring-2"
        />
        <label className="ml-2 text-sm font-medium text-text ">{n}</label>
      </div>
    );
  });

  return (
    <div>
      <div className=" w-full flex flex-row items-start justify-between">
        <p className="text-xs xl:text-sm font-bold text-left text-text">
          Select {filter_type}
        </p>
      </div>
      <form
        onSubmit={(e) => handle_submit(filter_type, e)}
        className="overflow-y-auto max-h-52 rounded-md border-accent-light flex flex-col relative"
      >
        {options}
        <input
          type="submit"
          value="Submit"
          className=" bottom-0 sticky bg-neutral text-accent  px-2 py-1 rounded-md shadow-lg h-1/2 text-sm
          border border-accent-light bg-accent text-secondary hover:text-accent-orange-500 focus:border-accent-orange-500"
          onClick={() => handleClose()}
        />
        <p className=" w-full text-sm font-bold text-center text-accent-orange-300">
          {"Select none for all assets"}
        </p>
      </form>
    </div>
  );
}

//need to restructure this into a form and do one batch filter update

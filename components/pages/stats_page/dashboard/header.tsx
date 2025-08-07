/*--------------------------Library Imports------------------------- */
import React, { useContext, useRef, useReducer, useState } from "react";
import { Menu, Popover, Switch } from "@headlessui/react";

/*----------------------------Context----------------------------- */
import { StatsContext } from "@/Context/stats_context";

/*--------------------------Component Imports------------------------- */
import HeliosIcons from "@/Global/icons";
import DateRanger from "@/Global/charts/add-ons/date-ranger";
import DateLocker from "@/Global/charts/add-ons/date_locker";
import HeliosModal from "@/Global/misc/modal";

type Props = {
  getFromLS: (key: any) => any;
  saveToLS: (key: any, value: any) => void;
};

function DashboardHeader({ getFromLS, saveToLS }: Props) {
  const {
    widgetsDraggable,
    toggleWidgetsDraggable,
    selectedDateRange,
    setSelectedDateRange,
  } = useContext(StatsContext);

  const storageDialogText = useRef("");
  const inDevelopmentDialogText = useRef("");

  const [storageDialogOpen, setStorageDialogOpen] = useState<boolean>(false);
  const [inDevelopmentDialogOpen, setInDevelopmentDialogOpen] =
    useState<boolean>(false);

  /*
  this function creates the storage dialog. It takes in a string and sets it to the storageDialogText ref
  */
  function prepModal(text: string) {
    storageDialogText.current = text;
    setStorageDialogOpen(true);
  }

  function prepInDevelopmentModal(text: string) {
    inDevelopmentDialogText.current = text;
    setInDevelopmentDialogOpen(true);
  }

  const icon_size: string = "w-6 h-6";

  const buttonStyling: string = "rounded-md hover:bg-neutral";

  // Grabs current layout from local storage and saves it to saved_layout
  function saveLayout() {
    let loaded_layout = getFromLS("current_layout");
    saveToLS("saved_layout", loaded_layout);
    prepModal("Dashboard Saved");
  }

  function saveWidgetsDraggable() {
    // Having it in both context and local storage makes it easier to
    // use in RGL and keep track of state respectively
    localStorage.setItem("widgetsDraggable", (!widgetsDraggable).toString());
    toggleWidgetsDraggable();
  }

  return (
    <>
      <div className={`flex w-full justify-start place-self-start py-2`}>
        <div className="flex p-1 gap-3 place-items-center">
          {/* Dashboard Options */}
          <Popover className="relative flex items-center">
            <Popover.Button className="inline-flex w-full group text-md hover:bg-neutral rounded-md px-1">
              <div className="w-6 h-6">
                <HeliosIcons
                  icon_class={"adjustments"}
                  icon_type={"horizontal"}
                  color={"stroke-secondary"}
                  stroke={"stroke-2"}
                />
              </div>

              <p className="text-sm text-secondary font-medium text-center place-self-center w-full h-full">
                Options
              </p>

              <div className="w-6 h-6">
                <HeliosIcons
                  icon_class={"chevron"}
                  icon_type={"down"}
                  color={"stroke-secondary"}
                  stroke={"stroke-2"}
                />
              </div>
            </Popover.Button>

            <Popover.Panel className={"absolute top-8 left-0"}>
              <div className="flex flex-col gap-1 p-2 shadow-md bg-primary border border-neutral rounded-md divide-y divide-neutral">
                <div className="flex-row flex w-max place-content-between">
                  {/* Dashboard Locking */}
                  <p className="text-sm text-secondary place-self-center mr-3 select-none">
                    Lock Dashboard
                  </p>
                  <Switch
                    checked={widgetsDraggable}
                    onChange={saveWidgetsDraggable}
                    className={`${
                      widgetsDraggable ? "bg-neutral" : "bg-secondary"
                    } relative inline-flex items-center h-6 w-16 rounded-full px-1 shadow-inner`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        widgetsDraggable
                          ? "translate-x-0 bg-secondary"
                          : "translate-x-10 bg-primary"
                      }
                  pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>

                <div className="flex flex-col pt-1 gap-1">
                  {/* Save to Cloud */}
                  <button
                    className={`flex flex-row w-full hover:bg-neutral rounded-md px-1 transition-all duration-50 ease-in-out`}
                    onClick={() =>
                      prepInDevelopmentModal(
                        "This feature is currently in development."
                      )
                    }
                  >
                    <p
                      className={`text-secondary text-md place-self-center w-full h-full`}
                    >
                      Cloud Save
                    </p>
                    <div className="w-6 h-6">
                      <HeliosIcons
                        icon_class={"cloud"}
                        icon_type={"arrow-down"}
                        color={"stroke-secondary"}
                        stroke={"stroke-2 "}
                      />
                    </div>
                  </button>

                  {/* Load From Cloud */}
                  <button
                    className={`flex flex-row w-full hover:bg-neutral rounded-md px-1 transition-all duration-50 ease-in-out`}
                    onClick={() =>
                      prepInDevelopmentModal(
                        "This feature is currently in development."
                      )
                    }
                  >
                    <p
                      className={`text-secondary text-md place-self-center w-full h-full`}
                    >
                      Cloud Load
                    </p>
                    <div className="w-6 h-6">
                      <HeliosIcons
                        icon_class={"cloud"}
                        icon_type={"arrow-up"}
                        color={"stroke-secondary"}
                        stroke={"stroke-2 "}
                      />
                    </div>
                  </button>
                </div>

                <div className="flex flex-col pt-1 gap-1">
                  {/* Save to Local Storage*/}
                  <button
                    className={`flex flex-row w-full hover:bg-neutral rounded-md px-1 transition-all duration-50 ease-in-out`}
                    onClick={() => saveLayout()}
                  >
                    <p
                      className={`text-secondary text-md place-self-center w-full h-full`}
                    >
                      Local Save
                    </p>
                    <div className="w-6 h-6">
                      <HeliosIcons
                        icon_class={"inbox"}
                        icon_type={"arrow-down"}
                        color={"stroke-secondary"}
                        stroke={"stroke-2 "}
                      />
                    </div>
                  </button>

                  {/* Load from Local Storage */}
                  <button
                    className={`flex flex-row w-full hover:bg-neutral rounded-md px-1 transition-all duration-50 ease-in-out`}
                    onClick={() =>
                      prepInDevelopmentModal(
                        "This feature is currently in development."
                      )
                    }
                  >
                    <p
                      className={`text-secondary text-md place-self-center w-full h-full`}
                    >
                      Local Load
                    </p>
                    <div className="w-6 h-6">
                      <HeliosIcons
                        icon_class={"inbox"}
                        icon_type={"arrow-up"}
                        color={"stroke-secondary"}
                        stroke={"stroke-2 "}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Popover>

          {/* Open date locking modal */}
          <DateLocker />

          {/* Choose dates */}
          <div className={`${icon_size} ${buttonStyling}`}>
            <DateRanger changeDates={setSelectedDateRange} />
          </div>
        </div>
      </div>

      <HeliosModal
        storageDialogOpen={storageDialogOpen}
        setStorageDialogClosed={() => setStorageDialogOpen(false)}
        setStorageDialogOpen={() => setStorageDialogOpen(true)}
        content={
          <p className="text-md text-text z-50">
            {
              "Your dashboard layout has been saved to local storage. You can load it at any time by clicking the load button or by refreshing the page."
            }
          </p>
        }
        title={storageDialogText.current}
      />

      <HeliosModal
        storageDialogOpen={inDevelopmentDialogOpen}
        setStorageDialogClosed={() => setInDevelopmentDialogOpen(false)}
        setStorageDialogOpen={() => setInDevelopmentDialogOpen(true)}
        content={
          <p className="text-md text-text z-50">
            {"Please stay tuned for updates."}
          </p>
        }
        title={inDevelopmentDialogText.current}
      />
    </>
  );
}

export default DashboardHeader;

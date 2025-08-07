import React from "react";
import HeliosIcon from "@/Global/icons";
import { isDateComponent } from "./widget_tools";

function Addition({ name, setValue, isDateComponent = false }) {
  return (
    <div
      draggable={true}
      unselectable="on"
      // this is a hack for firefox
      // Firefox requires some kind of initialization
      // which we can do by adding this attribute
      // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
      onDragStart={() => setValue(name)}
      className="flex flex-row rounded-lg border-2 border-secondary  text-sm py-[0.15rem] px-2 text-secondary font-medium self-end truncate cursor-move transition-all duration-50 ease-in-out hover:bg-neutral hover:text-accent hover:border-accent"
    >
      {isDateComponent && (
        <div className="flex w-4 h-4 place-self-center mr-1">
          <HeliosIcon
            icon_class={"clock"}
            icon_type={"basic"}
            color={"stroke-secondary"}
            stroke={"stroke-2"}
          />
        </div>
      )}
      {name}
    </div>
  );
}

export default Addition;

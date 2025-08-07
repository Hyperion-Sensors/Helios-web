import HeliosIcon from "@/Global/icons";
import HeliosModal from "@/Global/misc/modal";
import React, { useState } from "react";

type Props = {
  title?: string;
  content: React.ReactElement;
};

function ExpandTab({ title, content }: Props) {
  const [storageDialogOpen, setStorageDialogOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className="w-6 h-6"
        onClick={() => {
          setStorageDialogOpen(true);
        }}
      >
        <HeliosIcon
          icon_class={"expand"}
          icon_type={"basic"}
          color={"stroke-secondary hover:stroke-accent"}
          stroke={"stroke-2"}
        />
      </button>
      <HeliosModal
        storageDialogOpen={storageDialogOpen}
        setStorageDialogClosed={() => setStorageDialogOpen(false)}
        setStorageDialogOpen={() => setStorageDialogOpen(true)}
        height={"h-2/3"}
        width={"w-2/3"}
        content={
          <div className="h-full w-full relative p-3 border-secondary/10 border hover:shadow-inner hover:border-neutral rounded-md bg-primary">
            {content}
          </div>
        }
        title={title ? title : undefined}
      />
    </>
  );
}

export default ExpandTab;

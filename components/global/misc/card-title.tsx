import React from "react";
import InfoCard from "../custom/info_card";

type Props = {
  content: string;
  description: string;
};

function CardTitle({ content, description }: Props) {
  return (
    <div
      id={content + "-card-TITLE"}
      className="mb-3 w-full flex flex-row justify-between items-center text-base "
    >
      <h1 className="text-lg font-bold  text-secondary">{content}</h1>
      <div className="flex gap-3">
        <div className="h-4 w-4 group">
          <InfoCard
            title={content}
            description={description}
            card_styles={
              "p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-50  bg-primary rounded-md shadow-lg top-5 right-20 align-center border-2"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default CardTitle;

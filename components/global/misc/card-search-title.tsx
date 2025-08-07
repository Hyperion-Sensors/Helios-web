import React from "react";
import InfoCard from "../custom/info_card";

type Props = {
  content: string;
  description: string;
  search?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  searchFunction?: any;
};

function HeaderTitle({
  content,
  description,
  search,
  searchFunction,
  searchPlaceholder,
  searchValue,
}: Props) {
  return (
    <div
      id={content + "-card-TITLE"}
      className="mb-3 flex flex-row justify-between items-center text-base "
    >
      <h1 className="text-lg font-bold  text-secondary">{content}</h1>
      <div className="flex self-end gap-3">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => searchFunction(e.target.value)}
          className={`${
            search ? "block" : "hidden"
          } input  input-xs input-ghost w-full max-w-xs border-1`}
          placeholder={searchPlaceholder}
        />
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

export default HeaderTitle;

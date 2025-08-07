import React from "react";

/*--------------------------Custom------------------------------ */
import HeliosIcons from "../icons";

type Props = {
  title: string;
  description: string;
  card_styles: string;
  id?: number;
};
//component will take on size of container
function InfoCard({ title, description, card_styles, id }: Props) {
  return (
    <div className="h-full w-full relative group">
      <HeliosIcons
        icon_class={"info"}
        icon_type={"basic"}
        color={"fill-primary"}
        stroke={"stroke-secondary stroke-2"}
      />
      <div className={card_styles}>
        <h1 className="font-bold text-md">{title}</h1>
        <p className="inline-block text-sm text-left text-text w-72">
          {description}
        </p>
        {id ? (
          <p className="font-normal text-accent text-left text-sm">
            {"Widget ID: " + id}
          </p>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
}

export default InfoCard;

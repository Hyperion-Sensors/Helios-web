import React from "react";

type Props = {
  title: string;
  // background: string;
  // location: string; //text location
};

function TitleCard({ title }: Props) {
  return (
    <div className={`text-md px-2 font-semibold text-title `}>{title}</div>
  );
}

export default TitleCard;

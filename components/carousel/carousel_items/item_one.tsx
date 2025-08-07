import React from "react";

type Props = {
  counter: number;
};

function ItemOne({ counter }: Props) {
  return <div>{counter}</div>;
}

export default ItemOne;

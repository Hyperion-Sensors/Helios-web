import React from "react";

type Props = {
  counter: number;
};

function ItemTwo({ counter }: Props) {
  return <div>{counter}</div>;
}

export default ItemTwo;

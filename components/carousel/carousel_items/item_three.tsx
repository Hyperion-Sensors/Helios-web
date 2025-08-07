import React from "react";

type Props = {
  counter: number;
};

function ItemThree({ counter }: Props) {
  return <div>{counter}</div>;
}

export default ItemThree;

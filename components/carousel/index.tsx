import React, { useEffect, useState } from "react";

import ItemOne from "./carousel_items/item_one";
import ItemTwo from "./carousel_items/item_one";
import ItemThree from "./carousel_items/item_one";

type Props = {};

function Carousel({}: Props) {
  const [counter, setCounter] = useState(0);

  // function increment(counter: number): number {
  //   return counter + 1;
  // }

  // runs on mount
  useEffect(() => {
    let timer1 = setInterval(
      () =>
        setCounter((counter) => (counter == 2 ? (counter = 0) : counter + 1)),
      1000
    );

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearInterval(timer1);
    };
  }, []);

  return (
    <div>
      <div className={`${counter == 0 ? "block" : "hidden"}`}>
        {" "}
        <ItemOne counter={counter} />
      </div>
      <div className={`${counter == 1 ? "block" : "hidden"}`}>
        <ItemTwo counter={counter} />
      </div>
      <div className={`${counter == 2 ? "block" : "hidden"}`}>
        <ItemThree counter={counter} />
      </div>
    </div>
  );
}

export default Carousel;

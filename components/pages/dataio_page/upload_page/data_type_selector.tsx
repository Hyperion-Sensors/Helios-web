import React, { useState } from "react";

import { Listbox } from "@headlessui/react";

const dataTypes = [{ name: "Load" }];

export default function DataTypeSelector() {
  const [selected, setSelected] = useState(dataTypes[0]);

  const options = dataTypes.map((dataType) => (
    <Listbox.Option key={dataType.name} value={dataType}>
      {dataType.name}
    </Listbox.Option>
  ));

  return (
    <div className="flex flex-col min-w-10 w-max">
      <h1 className="flex font-bold">Select Data Type</h1>
      <Listbox value="selected">
        <Listbox.Button className="flex">{selected.name}</Listbox.Button>

        <Listbox.Options>{options}</Listbox.Options>
      </Listbox>
    </div>
  );
}

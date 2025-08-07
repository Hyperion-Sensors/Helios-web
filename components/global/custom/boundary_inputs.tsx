import React from "react";

type Props = {
  type: string;
  handleChange: (range: number[]) => void;
  range: number[];
};

function BoundaryInputs({ type, handleChange, range }: Props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const minVal = (document.getElementById("min" + type) as HTMLInputElement)
      .value;
    const maxVal = (document.getElementById("max" + type) as HTMLInputElement)
      .value;

    handleChange([Number(minVal), Number(maxVal)]);
  };

  return (
    <form
      className="flex gap-4 flex-col w-full text-center text-secondary"
      onChange={(e) => handleSubmit(e)}
    >
      <label className="input-group text-secondary text-start text-sm">
        <span>Min {type}</span>

        <input
          type="number"
          id={"min" + type}
          placeholder={String(range[0])}
          className="input input-secondary w-full p-2 rounded-md border border-neutral hover:border-neutral-focus"
        />
      </label>
      <label className="input-group text-secondary text-start text-sm">
        <span>Max {type}</span>
        <input
          type="number"
          id={"max" + type}
          placeholder={String(range[1])}
          className="input input-secondary w-full p-2 rounded-md border border-neutral hover:border-neutral-focus"
        />
      </label>
    </form>
  );
}

export default BoundaryInputs;

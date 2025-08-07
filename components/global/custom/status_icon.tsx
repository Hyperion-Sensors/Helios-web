import classNames from "classnames";
import React from "react";

type Props = {
  value: boolean;
  size?: [number, number];
  styling?: string | "bg-opacity-30";
};

function StatusIndicator({ value, size, styling }: Props) {
  let status_color = value
    ? `bg-success border border-success/70 `
    : "bg-error border border-error/70";

  let status_size =
    size != undefined ? "h-" + size[0] + " w-" + size[1] : "h-2 w-2"; //TODO: How to use this

  return (
    <div
      className="flex self-start relative"
      data-tip
      data-for="status-tooltip"
    >
      <span
        className={classNames(
          " animate-ping absolute rounded-full opacity-75",
          status_color,
          status_size
        )}
      ></span>

      <span
        className={classNames(
          ` inline-flex rounded-full `,
          status_color,
          status_size,
          styling
        )}
      ></span>
    </div>
  );
}

export default StatusIndicator;

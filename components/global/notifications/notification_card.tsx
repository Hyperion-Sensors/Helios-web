import React from "react";
import { format } from "date-fns";

type notification = {
  id: number;
  message: string;
  timestamp: string;
  level: string;
};

export default function NotificationCard(notification: notification) {
  if (notification.level === "Medium") {
    var title = "Warm Asset Warning";
    var borderColor = "border-warning";
    var bgHighlight = "hover:bg-warning/5";
    var hoverBorderColor =
      "hover:border hover:border-warning/50 hover:rounded-sm hover:border-l-warning";
  } else {
    var title = "Hot Asset ALERT";
    var borderColor = "border-error";
    var bgHighlight = "hover:bg-error/5";
    var hoverBorderColor =
      " hover:border hover:border-error/50 hover:rounded-sm hover:border-l-error";
  }
  // after:w-full after:border-b-2 after:border-accent-semi-light after:item-center
  return (
    <li
      className={`grid grid-rows-1 grid-cols-6 relative w-full h-12 align-center  justify-center overflow-hidden  pr-3 
      pl-3 py-2 border-l-2 hover:border-l-[3px] hover:rounded-md hover:pl-[11px]    ${hoverBorderColor}
       ${borderColor} ${bgHighlight}`}
    >
      <div className="flex flex-row row-start-1 col-start-1 col-span-6 row-span-1 justify-between items-center">
        <div>
          <h3 className="text-[0.9rem] text-secondary font-medium ">{title}</h3>

          <p className="row-start-2 col-start-1 row-span-2 col-span-5 text-sm">
            {notification.message}
          </p>
        </div>

        <h4 className="text-sm font-medium place-items-center">
          {format(new Date(notification.timestamp), "MMM-dd hh:mm")}
        </h4>
      </div>
    </li>
  );
}

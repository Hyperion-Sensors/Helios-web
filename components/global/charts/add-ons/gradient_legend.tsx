import React from "react";
import { useSession } from "next-auth/react";
import { useSettings } from "@/Queries/settings_queries";

type Props = {
  gradient: Array<string>;
  squares: number;
};

function GradientLegend({ gradient, squares }: Props) {
  const { data: session } = useSession();
  const { data: settingsData } = useSettings(session.user.id);

  const step = gradient.length / (squares - 1); // length / (number of colours - 1)

  let filteredArray: Array<string> = [];

  for (let i = 0; i < gradient.length; i += step) {
    filteredArray.push(gradient[Math.floor(i)]);
  }

  if (
    filteredArray[filteredArray.length - 1] !== gradient[gradient.length - 1]
  ) {
    filteredArray.push(gradient[gradient.length - 1]);
  }

  const colourBars = filteredArray.map((colour, index) => {
    return (
      <li
        key={index}
        className={`w-4 h-4`}
        style={{ backgroundColor: colour }}
      ></li>
    );
  });

  return (
    <div className="flex flex-row justify-center gap-0.5 items-center w-full">
      <span className=" text-xs text-center  h-1 text-text font-bold">
        {settingsData.data_options.Unit_System == "imperial" ? "32°F" : "0°C"}
      </span>

      <ul className="flex justify-center items-center mt-4 rounded-md overflow-hidden">
        {colourBars}
      </ul>
      <span className="text-xs text-center h-1 text-text font-bold">
        {settingsData.data_options.Unit_System == "imperial"
          ? "212°F"
          : "100°C"}
      </span>
    </div>
  );
}

export default GradientLegend;

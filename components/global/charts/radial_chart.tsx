import React, { useEffect, useState } from "react";

/*--------------------------------Libraries---------------------------- */
import resolveConfig from "tailwindcss/resolveConfig"; //for to get theme colors programmatically out of tailwind.config.js
import tailwindConfig from "../../../tailwind.config";

/*--------------------------------Components---------------------------- */
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/*---------------THIS FUNCTION IS VALLED IN asset_panel COMPONENT----------------*/

type Props = {
  type: string;
  value: number;
  unit: string;
  maxVal: number;
  size: number;
  guage: boolean;
};

function RadialChart({ type, value, unit, maxVal, size, guage }: Props) {
  const [color, setColor] = useState("");
  const [animateValue, setAnimateValue] = useState(0); //set to zero for animation
  const styleConfig = tailwindConfig; //instatiates tailwind config as styleConfig object

  useEffect(() => {
    const percentage = (value / maxVal) * 100; // Use this function to control how different percentages affect the coloring of the progress bar
    if (guage) {
      if (percentage < 0) {
        setColor(styleConfig.daisyui.themes[0].lightTheme.error);
      } else if (percentage >= 0 && percentage < 60) {
        setColor(styleConfig.daisyui.themes[0].lightTheme.warning);
      } else {
        setColor(styleConfig.daisyui.themes[0].lightTheme.success);
      }
    } else {
      if (percentage < 0) {
        setColor(styleConfig.daisyui.themes[0].lightTheme.primary);
      } else if (percentage >= 0 && percentage < 60) {
        setColor(styleConfig.daisyui.themes[0].lightTheme.success);
      } else if (percentage >= 60 && percentage < 70) {
        setColor(styleConfig.daisyui.themes[0].lightTheme.warning);
      } else {
        setColor(styleConfig.daisyui.themes[0].lightTheme.error);
      }
    }
  }, [
    guage,
    maxVal,
    styleConfig.daisyui.themes[0].lightTheme.error,
    styleConfig.daisyui.themes[0].lightTheme.primary,
    styleConfig.daisyui.themes[0].lightTheme.success,
    styleConfig.daisyui.themes[0].lightTheme.warning,
    value,
  ]);

  useEffect(() => {
    //This acts as a component did mount and triggers animation from 0 to props.value
    if (isNaN(value) || value == null) {
      setAnimateValue(0);
    } else {
      setAnimateValue(value); 
    }
  }, [, value]);

  return (
    <div style={{ width: "100%", height: "100%" }} className="h-fit">
      <CircularProgressbarWithChildren //from react-circular-progress library
        background
        backgroundPadding={1}
        value={animateValue}
        maxValue={maxVal}
        styles={buildStyles({
          // Colors
          backgroundColor: `${styleConfig.daisyui.themes[0].lightTheme.primary}`, //tailwind theme styling
          pathTransitionDuration: 0.5,
          pathColor: `${color}`,
          trailColor: `${styleConfig.daisyui.themes[0].lightTheme["base-100"]}`,
        })}
      >
        <span
          className={`${
            size > 100 ? "text-xl" : "text-xs"
          }  text-secondary font-bold`}
        >
          {type}
        </span>
        <span
          className={`${
            size > 100 ? "text-xl" : "text-xs"
          }  text-lg text-secondary font-bold`}
        >
          {animateValue + unit}
        </span>
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default RadialChart;

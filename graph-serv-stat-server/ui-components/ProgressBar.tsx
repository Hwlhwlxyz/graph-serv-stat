/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { style } from "twind/style";
import { statusData } from "../models/statusData.ts";

interface progressbarProps {
  percentNumber: number;
  toFixed?: number | undefined;
}

export default function ProgressBar(props: progressbarProps) {
  // const barClass = `text-xs font-medium text-gray-600 text-center leading-none rounded text-center h-5 py-[1px]`;
  const barClass = ` rounded text-xs font-medium py-[1px] text-center text-gray-600`
  const greenClass = tw(`bg-green-400 `+barClass);
  const yellowClass = tw(`bg-yellow-300`+barClass);
  const redClass = tw(`bg-red-600 `+barClass);
  // const redClass = tw`bg-indigo-400 rounded text-xs font-medium py-[1px] text-indigo-400 text-center`
  let displayClass = greenClass;
  if (props.percentNumber < 60) {
    displayClass = greenClass;
  } else if (props.percentNumber < 90) {
    displayClass = yellowClass;
  } else {
    displayClass = redClass;
  }
  console.log(props.percentNumber);

  function toFixNumber(num: number) {
    if (props.toFixed != null) {
      return num.toFixed(props.toFixed);
    } else {
      return num;
    }
  }

  return (
    <div>
      <div class={tw`w-full bg-gray-200 rounded-full`}>
        <div class={displayClass} style={`width: ${props.percentNumber}%`}>
          {toFixNumber(props.percentNumber)}%
        </div>
      </div>
    </div>
  );
}

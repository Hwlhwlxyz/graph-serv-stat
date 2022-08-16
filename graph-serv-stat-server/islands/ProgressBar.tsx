/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { style } from 'twind/style'
import { statusData } from "../models/statusData.ts";


interface progressbarProps {
  percentNumber: number;
}

export default function progressBar(props: progressbarProps) {
    const [number, setNumber] = useState(props.percentNumber);

    const blueClass = tw`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full`;
    const yellowClass = tw`bg-yellow-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full`
    const redClass = tw`bg-red-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full`
    let displayClass = blueClass;
    if (number<60) {
      displayClass = blueClass;
    }
    else if (number<90) {
      displayClass = yellowClass;
    }
    else {
      displayClass = redClass;
    }
    console.log(number)
    return (
<div>
    <div class={tw`w-full bg-gray-200 rounded-full`}>
  <div class={displayClass} style={`width: ${number}%`}> {number}%</div>
</div>

</div>

    )
    
    
}


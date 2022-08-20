/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { statusData } from "../models/statusData.ts";
import display from "../resources/display.json" assert { type: "json" };
import ProgressBar from "./ProgressBar.tsx";

export default function StatusRowRender(head: string[], data: statusData) {
    const rowtdClass = `border py-4 px-6 text-rose-600`;
    let rowContent = [];
    let keyArray = head.map(s=>s as (keyof typeof data));
    for (const k of keyArray) {
        rowContent.push(<td class={tw`${rowtdClass}`}>{cellRender(k, data)}</td>)
    }
    console.log('not exist key', data.get('not exist key'))
    return rowContent;
    
}

function cellRender(key: string, data: statusData) {
    switch (key) {
        case "host":
            return <p>{data.get(key)?.toString()}</p>
        case "load":
            return (data.load * 100).toFixed(1) + '%'
        case "hdd_percentage":
            return ((data.get(key) as number) * 100).toFixed(1) + '%'
        case "hdd_percentage_bar":
            return  <ProgressBar percentNumber={parseFloat(((data.get("hdd_percentage") as number) * 100).toFixed(1))} toFixed={1} />
        case "memory_percentage":
            return ((data.get(key) as number) * 100).toFixed(1) + '%'
        case "memory_percentage_bar":
            return  <ProgressBar percentNumber={parseFloat(((data.get("memory_percentage") as number) * 100).toFixed(1))} toFixed={1} />
        case "cpu_percentage":
            return ((data.get(key) as number)) + '%'
        case "cpu_percentage_bar":
            return  (data.get("cpu_percentage")? <ProgressBar percentNumber={parseFloat((data.get("cpu_percentage") as number).toFixed(1))} toFixed={1} />:undefined)
        case "uptime_day":
            return data.get(key) as number + display.uptime_day_unit;
        default:
            return data.get(key);
    }
}
/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { statusData } from "../models/statusData.ts";


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
        case "memory_percentage":
            return ((data.get(key) as number) * 100).toFixed(1) + '%'
        case "cpu_percentage":
            return ((data.get(key) as number)) + '%'
        default:
            return data.get(key);
    }
}
/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { bytesToSize, statusData } from "../models/statusData.ts";
import display from "../resources/display.json" assert { type: "json" };

export default function DetailRow(keys: string[], data: statusData) {
  const rowtdClass = `py-2 px-6 text-center`;
  const rowContent = [];
  const keyArray = keys.map((s) => s as keyof typeof data);
  for (const k of keyArray) {
    rowContent.push(<p class={tw`${rowtdClass}`}>{detailRender(k, data)}</p>);
  }
  console.log(keys, rowContent)
  return rowContent;
}

function detailRender(key: string, data: statusData) {
  switch (key) {
    case "memory":
      return display.memory + ": " + bytesToSize(data.memory_used, 2) + "/" + bytesToSize(data.memory_total, 2);
    case "swap":
      return display.swap + ": " + bytesToSize(data.swap_used, 2) + "/" + bytesToSize(data.swap_total, 2);
    case "hdd":
        return display.hdd + ": " + bytesToSize(data.hdd_used, 2) + "/" + bytesToSize(data.hdd_total, 2);
    default:
      return data.get(key);
  }
}

/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState, useLayoutEffect } from "preact/hooks";
import { tw } from "@twind";
import { statusData } from "../models/statusData.ts";
import StatusRowRender from "../ui-components/StatusRowRender.tsx";
import display from "../resources/display.json" assert { type: "json" };
import config from "../config.json" assert { type: "json" };
import serverConfiguration from "../models/config.ts";
import DetailRow from "../ui-components/DetailRow.tsx";


interface statusTable {
  host: string;
  value: any; // {"load": 0.02, "memory_used": 391080, "uptime": 28248919, "online0": false, "swap_total": 524284, "swap_used": 246776, "memory_total": 494800, "network_tx": 0, "hdd_used": 6658, "network_rx": 80, "cpu": 0.0, "hdd_total": 9513}
}

const defaultTableHead = [
  "host",
  "name",
  "uptime_day",
  "load",
  "network_tx_rx_calc",
  "netio_recv_sent",
  "cpu_percentage_bar",
  "memory_percentage_bar",
  "hdd_percentage_bar",
  "countdown_circle"
];

const detailKeys = [
  "memory",
  "swap",
  "hdd"
];

export default function ServerStatusTable() {
  console.log(serverConfiguration.serversMap);
  const [statusMap, setStatusMap] = useState<Map<string, statusData>>(
    new Map()
  );

  const [expandMap, setExpandMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    // for test only
    // updateMap("test", new statusData("test", {"load": 0.02, "memory_used": 391080, "uptime": 28248919, "online0": false, "swap_total": 524284, "swap_used": 246776, "memory_total": 494800, "network_tx": 0, "hdd_used": 6658, "network_rx": 80, "cpu": 0.0, "hdd_total": 9513}))
    for (const [key, value] of serverConfiguration.serversMap) {
      updateMap(key, new statusData(key, {
        load: NaN,
        memory_used: NaN,
        uptime: NaN,
        online0: false,
        swap_total: NaN,
        swap_used: NaN,
        memory_total: NaN,
        network_tx: NaN,
        hdd_used: NaN,
        network_rx: NaN,
        cpu: NaN,
        hdd_total: NaN,
        netio_recv: NaN,
        netio_sent: NaN}, value));
    }
  }, []);

  let head = defaultTableHead;
  if (config!=undefined && Array.isArray(config.tableHeader) && config.tableHeader.length>0) {
    head = config.tableHeader;
  }

  

  const [body, setBody] = useState<(number | boolean | string)[][]>([]);

  const ws = useRef<WebSocket | null>(null);


  useLayoutEffect(() => {
    console.log("window.location.href:", window);
    console.log(
      "window.location.href:",
      window.location.href,
      window.location.origin
    );
    const urlObject = new URL(window.location.origin);
    console.log(urlObject.host);
    if (config.wsserver != null && config.wsserver.length > 0) {
      ws.current = new WebSocket(config.wsserver);
    } else {
      console.log(`ws:${window.location.href.substring(window.location.protocol.length)}/ws`)
      let pathWithSlash;
      if (urlObject.pathname.endsWith('/')) {
        pathWithSlash = urlObject.pathname;
      }
      else {
        pathWithSlash = urlObject.pathname+'/';
      }
      if (location.protocol === 'https:') {
        ws.current = new WebSocket(`wss://${urlObject.host}${pathWithSlash}wsfrontend`);
      }
      else {
        ws.current = new WebSocket(`ws://${urlObject.host}${pathWithSlash}wsfrontend`);
      }
      
    }

    ws.current.onopen = (e) => {
      ws.current?.send("frontend");
    };

    ws.current.onmessage = (e) => {
      let j = null;
      try {
        j = JSON.parse(e.data);
      } catch {
        console.log("received data is not JSON", e.data);
      }
      console.log(j);
      if (j != null && j["status"] != null) {
        console.log("j:", j);
        const host = j["host"];
        const receivedData = new statusData(
          host,
          j["status"],
          serverConfiguration.serversMap.get(host)
        );
        // console.log(receivedData);
        // statusMap.set(host, receivedData);
        // setStatusMap(new Map(statusMap));
        updateMap(host, receivedData);
        let newBody: (number | boolean | string)[][] = [];
        for (const [key, value] of statusMap) {
          // console.log(key, value);
          newBody.push(value.toArray());
        }
        setBody(newBody);
        // console.log("statusMap", statusMap);
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [ws]);

  const updateMap = (k: string, v: statusData) => {
    setStatusMap(new Map(statusMap.set(k, v)));
  };

  function onclickOneRow(host: string) {
    const oldValue = expandMap.get(host) || false;
    setExpandMap(new Map(expandMap.set(host, !oldValue)));
  }

  const tableClass = `w-full text-sm text-left text-gray-700 dark:text-gray-400`;
  const theadClass = `text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400`;
  const tbodytrClass = `bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`;
  const rowtdClass = `border py-4 px-6`;
  const thClass = `border py-3 px-6 text-center`;

  const tdShow = {
    opacity: "1",
    padding: "10px",
    "line-height": "20px",
    transition: "all 0.1s ease-in-out",
  };

  const tdHide = {
    opacity: "0",
    "line-height": "0px",
    padding: "0 0px",
  };

  function getDetailedtbodytrClass(host: string, statusdata: statusData) {
    console.log(expandMap);
    if (expandMap.get(host)) {
      return (
        <tr class={tw`tbodytrClass`}>
          <td colSpan={head.length} class={tw`${rowtdClass}`} style={tdShow}>
            {DetailRow(detailKeys, statusdata)}
          </td>
        </tr>
      );
    } else {
      return (
        <tr class={tw`tbodytrClass`}>
          <td colSpan={head.length} class={tw`${rowtdClass}`} style={tdHide}>
            {" Details not found "}
            
          </td>
        </tr>
      );
    }
  }

  return (
    <div
      class={tw`overflow-x-auto overflow-y-hidden relative shadow-md sm:rounded-lg border-2`}
    >
      <table class={tw`${tableClass}`}>
        <thead class={tw`${theadClass}`}>
          <tr>
            {head.map((element: string) => {
              return (
                <th scope="col" class={tw`${thClass}`}>
                  {(display[element as keyof typeof display] as string) ||
                    element}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {[...statusMap.keys()].map((host) => {
            if (statusMap.get(host) != undefined) {
              return [
                <tr
                  key={host}
                  class={tw`${tbodytrClass}`}
                  onClick={() => onclickOneRow(host)}
                >
                  {StatusRowRender(head, statusMap.get(host) as statusData)}
                </tr>,
                getDetailedtbodytrClass(
                  host,
                  statusMap.get(host) as statusData
                ),
              ];
            } else {
              return (
                <tr>
                  <p>null</p>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

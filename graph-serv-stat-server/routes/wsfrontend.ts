/** @jsx h */
import { Handlers } from "$fresh/server.ts";
import { db } from "../database/sqlite.ts";
import { statusMessage } from "../models/statusMessage.ts";

import serverConfiguration from "../models/config.ts";
import { ConnInfo } from "https://deno.land/x/fresh@1.0.2/src/server/deps.ts";
import websocketPool from "../storage/websocketPool.ts";

function getRemoteAddress(connInfoRemoteAddr: any) {
  if ("hostname" in connInfoRemoteAddr) {
    return connInfoRemoteAddr["hostname"];
  } else {
    console.error("no host name in connInfo.remoteAddr", connInfoRemoteAddr);
    return null;
  }
}

export const handler: Handlers = {
  GET(req: Request, connInfo: ConnInfo) {
    const remoteAddress = getRemoteAddress(connInfo.remoteAddr);
    if (req.headers.get("upgrade") == "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.onopen = () => {
        console.log(remoteAddress + " connected");
        websocketPool.frontendPool.push(socket);
      };
      socket.onmessage = (e: MessageEvent) => {
        console.log(remoteAddress, e.data)
      }

      socket.onerror = (e) => console.log("socket errored:", e);
      socket.onclose = () => {
        console.log("socket closed");
        const index = websocketPool.frontendPool.indexOf(socket);
        if (index > -1) {
          websocketPool.frontendPool.splice(index, 1);
        }
        console.log( websocketPool.frontendPool.length,  websocketPool.frontendPool);
      };

      return response;
    } else {
      return new Response();
    }
  },
};


/** @jsx h */
import { Handlers } from "$fresh/server.ts";
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
    console.log(connInfo);
    const first3SocketMessages = [];
    let authenticated = false;
    const remoteAddress = getRemoteAddress(connInfo.remoteAddr);
    if (req.headers.get("upgrade") == "websocket") {
      console.log(req.headers.get("host"));

      const serverCfg = serverConfiguration.getConfigByHost(remoteAddress);
      if (serverCfg) {
        console.log(
          remoteAddress,
          "serverCfg",
          serverCfg?.needAuth(),
          serverCfg?.getUserPassToReceive()
        );
      } else {
        console.log("serverCfg is null:", serverCfg);
      }

      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.onopen = () => {
        if (serverCfg && serverCfg.needAuth()) {
          socket.send("need authentication");
        }
      };
      socket.onerror = (e) => console.log("socket errored:", e);
      socket.onclose = () => {
        console.log("socket closed");
        const index = websocketPool.clientPool.indexOf(socket);
        if (index > -1) {
          websocketPool.clientPool.splice(index, 1);
        }
        console.log(websocketPool.clientPool.length, websocketPool.clientPool);
      };

      socket.onmessage = (e: MessageEvent) => {
        console.log(remoteAddress, e.data);

        if (remoteAddress == null) {
          console.log("error", remoteAddress, ", origin is null");
          socket.send("no origin in header, close");
          socket.close();
        } else {
          // communicate with other hosts (clients)
          if (first3SocketMessages.length < 3) {
            first3SocketMessages.push(e.data);
            if (authenticated == false) {
              socket.send("Authentication required");
            }
          } else {
            if (authenticated == false) {
              socket.send("authentication failed " + remoteAddress);
              socket.close();
            }
          }

          if (serverCfg == null) {
            // authenticated = true; // allow unknown hosts if authenticated = true
            console.log("do not allow unknown server:" + remoteAddress);
            socket.send("do not allow unknown server:" + remoteAddress);
            socket.close();
          } else {
            console.log(serverCfg.needAuth(), serverCfg.getUserPassToReceive());
            if (serverCfg.needAuth()) {
              if (serverCfg.getUserPassToReceive() == e.data) {
                authenticated = true;
                socket.send("authentication succeeded");
              }
            } else {
              // do not need autentication
              authenticated = true;
            }
          }
          if (authenticated == true) {
            websocketPool.sendToFrontend(e, remoteAddress);
          }
        }
      };
      return response;
    } else {
      return new Response();
    }
  },
};

/*
received message example
{"load": 0.0, "memory_used": 393120, "uptime": 27639002, "online0": false, "swap_total": 524284, "swap_used": 244128, "memory_total": 494800, "network_tx": 0, "hdd_used": 6712, "network_rx": 27, "cpu": 0.0, "hdd_total": 9513}
*/

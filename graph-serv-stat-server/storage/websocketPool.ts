import { statusMessage } from "../models/statusMessage.ts";

class WebSocketPool {
    clientPool: WebSocket[];
    frontendPool: WebSocket[];

    constructor() {
        this.clientPool = [];
        this.frontendPool = [];
    }

    sendToFrontend(e: MessageEvent, origin: string) {
        let statusData = null;
          try {
            statusData = JSON.parse(e.data);
          } catch (e) {
            console.log(e.data, "is not a valid JSON");
          }
        if (statusData != null) {
            const messageToSend = new statusMessage(origin, statusData);
            for (let i=0; i<this.frontendPool.length; i++) {
                const s = this.frontendPool[i];
                if (s.readyState==1) {
                    s.send(JSON.stringify(messageToSend.toJSON()));
                }
            }
        }
        else {
            console.log("not a valid JSON, not sent,", statusData);
        }
      }
}

let websocketPool: WebSocketPool;

function createWebsocketPool() {
    if (!websocketPool) {
        websocketPool = new WebSocketPool();
    }
    return websocketPool;
}

export default createWebsocketPool();
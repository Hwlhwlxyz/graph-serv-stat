import { DB } from "https://deno.land/x/sqlite/mod.ts";

export const db = new DB("data/data.db");
export const TABLENAME = Object.freeze({
  server: "server",
  status: "status"
});


export function initialize() {

  db.query(`
  CREATE TABLE IF NOT EXISTS status (
    host TEXT PRIMARY KEY,
    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  )
`);
}


/**
 * {
  "load": 0.0,
  "memory_used": 393120,
  "uptime": 27639002,
  "online0": false,
  "swap_total": 524284,
  "swap_used": 244128,
  "memory_total": 494800,
  "network_tx": 0,
  "hdd_used": 6712,
  "network_rx": 27,
  "cpu": 0.0,
  "hdd_total": 9513
}
 */
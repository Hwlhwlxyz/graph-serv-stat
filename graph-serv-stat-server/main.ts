/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { InnerRenderFunction, RenderContext, start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import { config, setup } from "@twind";
import { virtualSheet } from "twind/sheets";
import projectconfig from "./config.json"  assert { type: "json" };


const sheet = virtualSheet();
sheet.reset();
setup({ ...config, sheet });


function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twind", newSnapshot);
}

let port;
if (Number.isInteger(projectconfig.port)) {
  port = parseInt(projectconfig.port);
}
else {
  port = 8000;
}
await start(manifest, {port: port, render });

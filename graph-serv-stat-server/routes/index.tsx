/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";

import Clock from "../islands/Clock.tsx";
import ServerStatusTable from "../islands/ServerStatusTable.tsx";
import ProgressBar from "../islands/ProgressBar.tsx";


export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-lg`}>
      <Clock />
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <ServerStatusTable />
    </div>
  );
}

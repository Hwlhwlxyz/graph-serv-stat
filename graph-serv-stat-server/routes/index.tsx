/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Clock from "../islands/Clock.tsx";
import ServerStatusTable from "../islands/ServerStatusTable.tsx";



export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-2xl`}>
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

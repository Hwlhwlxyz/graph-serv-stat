/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Clock from "../islands/Clock.tsx";
import ServerStatusTable from "../islands/ServerStatusTable.tsx";
import NavBar from "../ui-components/NavBar.tsx";
import CircularProgress from "../ui-components/CircularProgress.tsx";
import CountDownCircle from "../islands/CountDownCircle.tsx";




export default function Home() {
  return (
    <div>
    <NavBar />
    <div class={tw`p-4 mx-auto max-w-screen-2xl`}>
      {/* <CountDownCircle lastUpdateTimestamp={new Date().getTime()}/> */}
      <Clock />
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <ServerStatusTable />
    </div>
    </div>
  );
}

import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { css } from 'twind/css'
import { style } from "twind/style";
import { statusData } from "../models/statusData.ts";
import CircularProgress from "../ui-components/CircularProgress.tsx";


interface CountDownCircleProps {
  lastUpdateTimestamp: number;
  key?: number|string;
}


export default function CountDownCircle(props: CountDownCircleProps) {
  const [millisecond, setMillisecond] = useState(100);

  useEffect(()=>{
    let timerId: number|undefined;
    // if (props.lastUpdateTime != undefined) {
    //   console.log(props.lastUpdateTime, typeof props.lastUpdateTime)
    //   setMillisecond(new Date().getTime() - new Date(props.lastUpdateTime).getTime());
    // }
    
    if (getPercentNumber(millisecond)>0) {
      timerId = setInterval(()=>setMillisecond((new Date().getTime() - props.lastUpdateTimestamp)), 10);
    }
    return () => { if (timerId) {clearInterval(timerId)}};
  })

  function getPercentNumber(num: number) {
    return 100-num/10; // set 0.01 second is 1%
  }


  return (<CircularProgress key={props.key} percentNumber={getPercentNumber(millisecond)}/>);
}




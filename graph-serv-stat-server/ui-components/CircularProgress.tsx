/** @jsx h */
import { h } from "preact";

import { tw } from "@twind";
import { css } from 'twind/css'

interface progressbarProps {
  percentNumber: number;
  toFixed?: number | undefined;
}

// https://stackoverflow.com/a/72365036
export default function CircularProgress(props: progressbarProps) {
  const percent = Math.round(props.percentNumber);

  function percentNumToDeg(num: number) {
    return (num*360/100)
  }


  const circleclass = tw(
    css({
      'div': {
        'display': 'flex',
        // 'width': '50px',
        // 'height': '50px',
        'width': '20px',
        'height': '20px',
        'border-radius': '50%',
        'background': 'conic-gradient(lightgreen var(--progress),  #F8F9F9 0deg)',
        'font-size': 0
      },
      
      'div::after': {
        // 'content': "attr(data-progress) '%'",
        'content': "attr(data-progress)",
        'display': 'flex',
        'justify-content': 'center',
        'flex-direction': 'column',
        'width': '100%',
        'margin': '5px',
        'border-radius': '50%',
        'background': 'white',
        'font-size': '1rem',
        'text-align': 'center'
      }
    }),
  )

  return (<div class={circleclass}>
    <div  data-progress={''} style={`--progress: ${percentNumToDeg(percent)}deg;`}> </div>
    </div>);
}




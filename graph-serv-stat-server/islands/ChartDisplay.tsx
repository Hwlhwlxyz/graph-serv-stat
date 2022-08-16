/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import {Chart, ChartConfiguration, ChartItem, ChartTypeRegistry, ChartType, registerables  } from "https://esm.sh/chart.js@3.8.2"

interface ChartProps {
  type: string; // line, bar
}


export default function ChartDisplay(props: ChartProps) {
  

  
  const btn = tw`px-2 py-1 border(gray-100 1) hover:bg-gray-200`;
  // let myChart2: Chart<"line",number[],string>|null = null;
  let myChart2;
  useEffect(() => {
    Chart.register(...registerables);
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];
    const data2 = {
        labels: labels,
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45],
        }]
      };

    const lineChartType: ChartType = props.type as ChartType;
    const config = {
        type: lineChartType,
        data: data2,
        // options: {}
      };

    var chartExist = Chart.getChart("myChart9")
    if (chartExist != undefined)  
      chartExist.destroy(); 
    let c = document.getElementById('myChart9') as ChartItem;
    let myChart2 = new Chart(
      c,
      config
    );
    console.log('Triggered only once, on mount', "1")

  })

  return (
    <div class={tw`flex gap-2 w-full`}>
      
      <div class={tw`mx-auto max-w-screen-xl`} style="width:100%">
      <canvas id="myChart9" ></canvas>
  
    </div>
    </div>
  );
}

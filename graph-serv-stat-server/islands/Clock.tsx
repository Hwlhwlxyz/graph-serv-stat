import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Clock() {

    const [date, setDate] = useState(new Date());
    
    function refreshClock() {
      setDate(new Date());
    }  
    
    useEffect(() => {
      const timerId = setInterval(refreshClock, 1000);
      return function cleanup() {
        clearInterval(timerId);
      };
    }, []);  
    
  return (
    <div class="flex gap-2 w-full">
      <span>
        {date.toLocaleTimeString()}
      </span>

    </div>
  );
}
  
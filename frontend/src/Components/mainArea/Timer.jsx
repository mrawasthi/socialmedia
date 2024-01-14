import React from 'react'
import './Timer.css'

export default function Timer(props){
    const setRunning=props.setRunning
    const setTimer=props.setTimer
    let time=props.timer
    let minute=Math.floor(time/60)
    let second=time%60

    
        React.useEffect(()=>{
            const intervalId = setInterval(() => {
                setTimer((prev) => {
                  if (prev==0) {
                    clearInterval(intervalId);
                    return 0;
                  }
                  return prev - 1;
                });
            }, 1000);
            return () => {
                setRunning(false)
                clearInterval(intervalId)
            };
        },[props.running])
    
    return (
        <div  className="timer-area">
            <div className="timer-area-inner">
                <div className="timer">{minute<10 && `0`}{minute}</div>
                <div className="timer">{second<10 && `0`}{second}</div>
            </div>
        </div>
    )
}
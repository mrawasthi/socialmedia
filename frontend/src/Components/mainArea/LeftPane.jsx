import React from 'react'
import './LeftPane.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from "../../data.js"
import Timer from './Timer.jsx'

const leftPane = (props)=>{
    const [toggleButtonDifficulty, setToggleButtonDifficulty]=React.useState(false);
    const [toggleButtonTimer, setToggleButtonTimer]=React.useState(false);
    const {setVisibleButtonDiff, setVisibleButtonTimer,visibleButtonTimer,visibleButtonDiff, setFirstTimer}=props

    let randomInt=(Math.floor(Math.random()*10))%5;
    function handleToggleDifficulty(){
        setToggleButtonTimer(false);
        setToggleButtonDifficulty(!toggleButtonDifficulty);
    }
    function handleToggleTimer(){
        setToggleButtonDifficulty(false);
        setToggleButtonTimer(!toggleButtonTimer);
    }
    function changeStateTimer(e){
        const eventid=e.target.id;
        handleToggleTimer();
        const setTimerToggle=props.setTimerToggle
        setTimerToggle(true)
        if(eventid==1){
            setVisibleButtonTimer((prev)=>{
                return {...prev, text: "1 MINUTE"};
            })
            const setTimer=props.setTimer
            setTimer(60)
            setFirstTimer(60)
        }
        else if(eventid==2){
            setVisibleButtonTimer((prev)=>{
                return {...prev, text: "2 MINUTE"};
            })
            const setTimer=props.setTimer
            setTimer(120)
            setFirstTimer(120)
        }
        else if(eventid==3){
            setVisibleButtonTimer((prev)=>{
                return {...prev, text: "5 MINUTE"};
            })
            const setTimer=props.setTimer
            setTimer(300)
            setFirstTimer(300)
        }
    }
    function changeStateDiff(e){
        const eventid=e.target.id;
        handleToggleDifficulty();
        const setDifficultyToggle=props.setDifficultyToggle
        setDifficultyToggle(true)
        if(eventid==4){
            setVisibleButtonDiff((prev)=>{
                return {...prev, color: "success", text: "Easy"};
            })
            const setTextData=props.setTextData
            setTextData(dummyData.easy[randomInt])
        }
        else if(eventid==5){
            setVisibleButtonDiff((prev)=>{
                return {...prev, color: "warning", text: "Medium"};
            })
            const setTextData=props.setTextData
            setTextData(dummyData.medium[randomInt])
        }
        else if(eventid==6){
            setVisibleButtonDiff((prev)=>{
                return {...prev, color: "danger", text: "Hard"};
            })
            const setTextData=props.setTextData
            setTextData(dummyData.hard[randomInt])
        }
    }
    
    return(
        <>
            <div className="timer-area-text">Judge Your Speed</div>
            <Timer 
              timer={props.timer}
              setTimer={props.setTimer}
              running={props.running}
              setRunning={props.setRunning}
            />
            <p class="d-inline-flex gap-1 left-toggle">
                <a class={`btn btn-${visibleButtonDiff.color} leftpaneout`} onClick={handleToggleDifficulty} data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" >
                    {visibleButtonDiff.text}
                </a>
                {toggleButtonDifficulty && 
                    <div className="card menulist">
                        <button type="button" class="btn btn-success btn-option" id="4" onClick={changeStateDiff}>Easy</button>
                        <button type="button" class="btn btn-warning btn-option" id="5" onClick={changeStateDiff}>Medium</button>
                        <button type="button" class="btn btn-danger btn-option" id="6" onClick={changeStateDiff}>Hard</button>
                    </div>  
                }
                <a class={`btn btn-${visibleButtonTimer.color} leftpaneout`} onClick={handleToggleTimer} data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" >
                    {visibleButtonTimer.text}
                </a>
                {toggleButtonTimer && 
                    <div className="card menulist">
                        <button type="button" class="btn btn-success btn-option" id="1" onClick={changeStateTimer}>1 MINUTE</button>
                        <button type="button" class="btn btn-warning btn-option" id="2" onClick={changeStateTimer}>2 MINUTE</button>
                        <button type="button" class="btn btn-danger btn-option" id="3" onClick={changeStateTimer}>5 MINUTE</button>
                    </div>  
                }
            </p>
        </>
    )
}

export default leftPane;
import React from 'react';
import './mainArea.css';
import LeftPane from './LeftPane.jsx';
import dummyData from "../../data.js";
import Modal from "./popupMainArea.jsx"

export default function MainArea() {
  const [textData, setTextData] = React.useState("Kindly Enter Difficulty and Timer first");
  const [state, setState] = React.useState([]);
  const [currInd, setCurrInd] = React.useState(0);
  const [correctCharCount, setCorrectCharCount] = React.useState(0);
  const [errorCharCount, setErrorCharCount] = React.useState(0);
  const [errWordCount, setErrWordCount] = React.useState(0);
  const [errorCount, setErrorCount]=React.useState(0);
  const [correctWord, setCorrectWord] = React.useState(0);
  const [wordInd, setWordInd] = React.useState(0);
  const [backspace,setBackspace]=React.useState(false)
  const [timer, setTimer] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [difficultyToggle, setDifficultyToggle]=React.useState(false)
  const [timerToggle, setTimerToggle]=React.useState(false)
  const [showPopup,setShowPopup]=React.useState(false)
  const [firstTimer, setFirstTimer]=React.useState(0)
  const [visibleButtonTimer, setVisibleButtonTimer]=React.useState({
    color: "dark",
    text: "Timer"
})
const [visibleButtonDiff, setVisibleButtonDiff]=React.useState({
    color: "dark",
    text: "Difficulty"
})
const [timerTrue,setTimerTrue]=React.useState(0)

  const dataArray = textData.split(" ").filter(Boolean);
  function updateText() {
    if (!running) {
      setRunning(true);
      setTimer(timer)
      setFirstTimer(firstTimer)
    }
  }
   console.log(errWordCount)
   console.log(state)
   console.log(firstTimer)
   
  function handleLastKey(e) {
    const currText = e.target.value
    const lastKey = currText[currText.length-1]
    if(state.length>currText.length){
      if(!backspace){
      console.log("here")
      const temporaryState=state
      const lastState=temporaryState[temporaryState.length-1]
      if(lastState.color==="col-green"){
        setCorrectCharCount(prev=>prev-1)
      }else if(lastState.color==="col-red"){
        setErrorCount(prev=>prev-1)
        setErrorCharCount(prev=>prev-1)
      }
      setState(prevState => prevState.slice(0, -1));
         console.log(state.length)
      
      if(wordInd!==1){
        setWordInd(prev => prev-1)
        console.log(wordInd+"AyushChutiya")
      }else{
        setWordInd(0)
        setBackspace(true)
      }
     }else{
      const chartoAdd='!';
      const original=currText;
      const result=original.concat(chartoAdd)
      e.target.value=result
     }
    }else if (wordInd < dataArray[currInd].length && dataArray[currInd][wordInd] === lastKey) {
      setCorrectCharCount(prev => prev + 1);
      setWordInd(prev => prev + 1);
      setBackspace(false)
      setState([...state, { color: "col-green", content: lastKey}]);
    } else if (wordInd < dataArray[currInd].length && dataArray[currInd][wordInd] !== lastKey && lastKey !== " ") {
      setErrorCount(prev => prev+1)
      setErrorCharCount(prev => prev + 1);
      setWordInd(prev => prev + 1);
      setBackspace(false)
      setState([...state, { color: "col-red", content: lastKey}]);
    } else if(wordInd < dataArray[currInd].length && dataArray[currInd][wordInd] !== lastKey && lastKey === " "){
      const original=currText.slice(0, -1);
      e.target.value=original
    } else if (lastKey === " " && wordInd === dataArray[currInd].length) {
      if (errorCharCount) {
        setErrWordCount(prev => prev + 1);
      } else {
        setCorrectWord(prev => prev + 1);
      }
      setWordInd(0);
      setCurrInd(prev => prev + 1);
      setErrorCharCount(0);
      setBackspace(true)
      setState([...state, { color: "no-color", content: lastKey }]);
    }else if(lastKey === " " && wordInd < dataArray[currInd].length){
        setcursorStop(false)
    }else if(wordInd === dataArray[currInd].length && lastKey !== " "){
      const original=currText.slice(0, -1);
      e.target.value=original
    }
  }
  console.log([correctCharCount, errorCount, errorCharCount, errWordCount, correctWord])
  if(difficultyToggle && timerToggle && !timer){
    setShowPopup(true)
    setDifficultyToggle(false)
    setTimerToggle(false)
  }
  return (
    <div className="uppercontainer">
      <div className="containerArea">
        {showPopup &&
          <Modal 
            results={{correctCharCount, errorCount, errWordCount, correctWord,
            setTextData,setState,setCurrInd,setCorrectCharCount,setErrorCharCount,
            setErrorCount,setCorrectWord,setWordInd,setBackspace,setTimer,setRunning,
            setVisibleButtonDiff, setVisibleButtonTimer,firstTimer,currInd}}
            setShowPopup={setShowPopup}
          />
        }
        <div className="leftPane">
          <LeftPane
            setTextData={setTextData}
            setTimer={setTimer}
            timer={timer}
            running={running}
            setRunning={setRunning}
            setDifficultyToggle={setDifficultyToggle}
            setTimerToggle={setTimerToggle}
            setVisibleButtonDiff={setVisibleButtonDiff}
            setVisibleButtonTimer={setVisibleButtonTimer}
            visibleButtonTimer={visibleButtonTimer}
            visibleButtonDiff={visibleButtonDiff}
            setFirstTimer={setFirstTimer}
          />
        </div>
        <div className="stageArea">
          <div className="textarea-div">
            <div className="super-list">
              {state.map((item, index) => (
                <li key={index} className={item.color}>
                  {item.content}
                </li>
              ))}
              <li className="guiding-text">
                {dataArray[currInd].slice(wordInd, dataArray[currInd].length) +
                  " " +
                  dataArray.slice(currInd + 1, dataArray.length).join(" ")}
              </li>
            </div>
          </div>
          {
            difficultyToggle && timerToggle && 
            <textarea 
              className="main-textarea" 
              onClick={updateText} 
              onInput={handleLastKey} 
              spellCheck="false"
            >
          </textarea>
          }
        </div>
      </div>
    </div>
  );
}

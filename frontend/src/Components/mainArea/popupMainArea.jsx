import React from 'react';
import './popupMainArea.css';
import './LeftPane.css'
import { useAuth } from '../../store/auth';

const Modal = (props) => {
    const {correctCharCount, errorCount, errWordCount, correctWord,
        setTextData,setState,setCurrInd,setCorrectCharCount,setErrorCharCount,
        setErrorCount,setCorrectWord,setWordInd,setBackspace,setTimer,setRunning,
        setVisibleButtonDiff, setVisibleButtonTimer,firstTimer,currInd
    }=props.results
    console.log(firstTimer)
    const setShowPopup=props.setShowPopup
    const {user,token} =useAuth()
    console.log(user.image)
    console.log(user._id)
    const id=user._id
    let accuracy=Math.floor((correctWord/currInd)*100)
    if(!currInd){
      accuracy=0
    }
    const minute=firstTimer/60
    const WPM=Math.floor(correctWord/minute)
    const errors=currInd-correctWord
    const totalcnt=errorCount+correctCharCount
    let score=WPM
    console.log(token)
    const onClose=async()=>{
        try {
            const res = await fetch(`http://localhost:3000/highscore`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({
              score
            })
          });
          if(res.ok){
            const data=await res.json();
            console.log(data)
           } 
          
          else{
           console.log("some error")
          }
          } catch (error) {
            console.error('Error:', error);
          }
        setShowPopup(false)
        setTextData("Kindly Enter Difficulty and Timer first")
        setState([])
        setCurrInd(0)
        setCorrectCharCount(0)
        setErrorCharCount(0)
        setErrorCount(0)
        setCorrectWord(0)
        setWordInd(0)
        setBackspace(false)
        setTimer(0)
        setRunning(false)
        setVisibleButtonDiff({
            color: "dark",
            text: "Difficulty"
        })
        setVisibleButtonTimer({
            color: "dark",
            text: "Timer"
        })
    }
    
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="data-heading">Typing Test Results</div>
        <div className="modal-data">
          <div className="data">WPM: {WPM}</div>
          <div className="data">Accuracy: {accuracy}%</div>
          <div className="data">Errors: {errors}</div>
          <div className="data">Characters Typed: {totalcnt}</div>
        </div>
        <button className="btn btn-dark cancel-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;

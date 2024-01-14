import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Scss/Home.scss';
import { useAuth } from '../store/auth';
import Topbar from "../Components/topbar/Topbar";
import MainArea from "../Components/mainArea/mainArea.jsx"
import dummyData from "../data.js"

const HomePage = () => {
  const navigate = useNavigate();
  const {LogoutUser,user} =useAuth()
  console.log(user._id)
  //const {islogged}=useAuth()
 // if(islogged==false){
   // navigate("/Login")
  //}
  /*
  
  const callhomepage = async () => {
    try {
      const res = await fetch("http://localhost:3000/check", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials:"include"
      });
      const data = await res.json();
  
      console.log('Response Status:', res.status);
      console.log('Response Data:', data);
  
      if (res.status !== 200) {
        navigate("/login");
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      navigate("/login");
    }
  };
  
  React.useEffect(()=>{
    callhomepage()
  },[])
     
 */
  
   console.log(dummyData)
   
  const logout=()=>{
    console.log("hello world")
    LogoutUser()
    
    navigate("/Login")
  }
  

  return (
    
    <div className="mainHome">
     <Topbar />
     <MainArea />
    </div>
  )
};

export default HomePage;

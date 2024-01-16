
// friends.jsx
import React, { useState ,useRef,useEffect} from 'react';
import '../Scss/Chat.scss';
import search1 from "../image/search1.png";
import { useAuth } from '../store/Auth';
import {io} from "socket.io-client"
import Welcome from '../Components/ChatArea/Welcome.jsx'
import ChatContainer from '../Components/ChatArea/ChatContainer.jsx'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

  const Friends = () => {
  const [currFriend, setCurrFriend] = useState([])
  const [currChat, setCurrChat] = useState(undefined)
  const [msg, setMsg] = useState("");
  //const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currFriendChat,setCurrFriendChat]=useState([])
  const [arrivalmsg,setArrivalmsg]=useState([])


  // const handleEmojiPickerhideShow = () => {
  //   setShowEmojiPicker(!showEmojiPicker);
  // };

  // const handleEmojiClick = (event, emojiObject) => {
  // let message = msg;
  // message += emojiObject.emoji;
  // setMsg(message);
  // };

  const sendChat = (event) => {
  event.preventDefault();
  if (msg.length > 0) {
    handleSendMsg(msg);
    setMsg("");
  }
  };
  
  const socket=useRef();
  const { token,setUser,user } = useAuth()
  console.log(user)
  console.log(token)
  const id = user._id

  useEffect(()=>{
    socket.current=new io("http://localhost:3000", {
      autoConnect: true,
      withCredentials: true
    })
    console.log(socket.current)
    socket.current.emit("add-user",id)
    console.log("here i am boii")
  },[])
  const sendMessage=async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/sendmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ide:currChat,
          content:msg
        })
      })
      if (response) {
        const data = await response.json()
        console.log("all done bhai")
        socket.current.emit("send-msg",{
          to:currChat,
          from:id,
          message:msg
        })
        setCurrFriendChat([...currFriendChat,{fromUser:true,message:msg}])


      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-receive",(msg)=>{
        console.log(msg)
        setArrivalmsg({fromUser:false,message:msg})
      })
    }
  },[])

  useEffect(()=>{
       arrivalmsg && setCurrFriendChat((prevChat) => [...prevChat, arrivalmsg])
  },[arrivalmsg])

  const chatFriend=async(ide)=>{
    setCurrChat(ide)
    try {
      const response = await fetch(`http://localhost:3000/getmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ide
        })
      })
      if (response) {
        const data = await response.json()
        let obj = data.msg
        console.log(obj)
        setCurrFriendChat(obj)
      }
    } catch (error) {
      console.log(`${error}`)
    }

  }
  const firstRender = async () => {
    try {
      const response = await fetch(`http://localhost:3000/myfriends`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response) {
        const data = await response.json()
        socket.current=io(`http://localhost:5173`)
        socket.current.emit("add-user", user._id)
        let obj = data.msg
        console.log(obj)
        setCurrFriend(obj)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  

  React.useEffect(() => {
    firstRender()
  }, [])

  return (
    <div className="upper-container">
      <div className="upper-container-friend">
        <div className="left-friend">
          <div className="form-group">
            <div className="timer-area-text2">FRIENDS</div>
          </div>
          
            <div className="friends-area-container">
              <div className="friends-area">
                {currFriend.map((friend, index) => (
                  <div key={index} className="search-box search-friend-out" onClick={()=>chatFriend(friend._id)}>
                    <div className="search-out">
                      <div className="search-item">{friend.name}</div>
                      <div className="search-item">{friend.email}</div>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
        </div>
        <div className="right-friend">
          <div className="heading">PROFILE FRIEND</div>
          <div className="friends-area-container right-friend-request">
              {currChat ? <ChatContainer currFriendChat={currFriendChat} socket={socket}/> : <Welcome />}
          </div>
          {currChat && <div className="button-container">
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <div className="form-group">
                <input
                  type="text"
                  className="form-control input-message"
                  placeholder="Type Message here"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-dark search-button submit-button"
                  onClick={sendMessage}
                >
                  SEND
                </button>
              </div>
            </form>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Friends;

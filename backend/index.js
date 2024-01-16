//require('dotenv').config();
const express=require("express");
const mongoose =require("mongoose")
const cors=require("cors")
const multer=require("multer")
const cookieparser=require("cookie-parser")
const app=express()
const PORT=3000;

const socket=require("socket.io")


//import userSchema
const User=require("./model/userSchema")
app.use(express.json())
app.use(cors())
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(require('./routers/useroutes'))
const path = require('path')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/images");
    },
    filename: function(req,file,cb){
        const uniqueSuffix=Date.now();
        cb(null,uniqueSuffix+file.originalname);
    },
});
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({
    storage:storage
})

app.post("/upload-image/:id",upload.single("image"),async(req,res)=>{
    console.log(req.body);
    const imageName=req.file.filename;
    const id=req.params.id
    
    try {
        const tm= await User.findByIdAndUpdate(id,
            {$set:{image:imageName}},
            {new:true});
        res.send("ok");
    } catch (error) {
        res.send("err");
    }

});


mongoose.connect("mongodb+srv://ayush1234567890:ILIKEMANGO@cluster0.gone4jf.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection successfull we are here")
}).catch((err)=> console.log(`${err}`+ "failed"))

app.get("/",(req,res)=>{
    res.status(200).send("hello world");
})
const server=app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})
const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    console.log("ok")
    socket.on("add-user", (userId) => {
        console.log("hello guys")
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers)
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to)
        if(sendUserSocket){
            console.log(data.msg)
            socket.to(sendUserSocket).emit("msg-receive",data.msg)
        }
    })
})

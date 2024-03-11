//require('dotenv').config();
const express=require("express");
const mongoose =require("mongoose")
const cors=require("cors")
const multer=require("multer")
const cookieparser=require("cookie-parser")
const app=express()
const PORT=3000;
const socket=require("socket.io")

const authenticate=require("./middlewares/authenticate.js")
//import userSchema
const User=require("./model/userSchema")
const Post=require("./model/postModel")
const Group=require("./model/group")
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
app.post('/sendpost',authenticate,upload.single("image"),async(req,res)=>{
    try{
      const fromUser=req.userID
      const image=req.file.filename
      const title=req.body.title
      const currUser=await User.findOne({_id:fromUser})
      const name=currUser.name
      const post=new Post({original:fromUser,image,title,originalName:name})
      await post.save()
      res.status(200).json({msg:"all ok"})
    }catch(err){
     console.log(`${err}`)
    }
})
app.put('/updatepost',authenticate,upload.single("image"),async(req,res)=>{
    try{
       const postId=req.body.postId
       const title=req.body.title
       const image=req.file.filename
       const updatePost = await Post.findByIdAndUpdate(postId, { title: title, image: image }, { new: true });

       res.status(200).json({msg:updatePost})
    }catch(err){
       console.log(`${err}`)
    }
 })

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
global.onlineGroupUsers = new Map(); 
io.on("connection", (socket) => {
    console.log("A user connected");

    // Add user to onlineUsers map
    socket.on("add-user", (userId) => {
        console.log("bbb")
        onlineUsers.set(userId, socket.id);
        console.log(userId)
        console.log(socket.id)
    });
    socket.on("add-grp-user", (userId) => {
        console.log("User added:", userId);
        console.log("bbbb")
        onlineGroupUsers.set(userId, socket.id);
        console.log("Online Users:", onlineGroupUsers);
    });
    socket.on("send-msg", (data) => {
        console.log("Message data:", data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data);
        } else {
            console.log("User not found");
        }
    });
    socket.on("send-video-call", (data) => {
        console.log("Message data:", data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("video-call-receive", data);
        } else {
            console.log("User not found");
        }
    });
    socket.on("send-grp-msg", async (data) => {
        console.log("Group message data:", data);
        const groupId = data.to;
        const group = await Group.findById(groupId);
        const member = group.members;
        console.log("Group members:", member);
        for(let i=0;i<member.length;i++){
            const memberId = member[i].toString();
            const sendUser=onlineGroupUsers.get(memberId);
            if(sendUser && data.from!==memberId){
                console.log("bbbbbbbbbbbb")
            socket.broadcast.to(sendUser).emit("msg-grp-receive", data);
            }
            else{
                console.log("not found")
            }
        }
        
    });
});



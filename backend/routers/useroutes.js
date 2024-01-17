const express=require('express')
const app=express()
const jwt= require("jsonwebtoken")
const router = express.Router()
const User=require("../model/userSchema")
const Message=require("../model/message")
const Post=require('../model/postModel')
const bcrypt=require('bcryptjs')
const cors = require('cors');
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const authenticate=require("../middlewares/authenticate.js")

router.get("/",(req,res)=>{
    res.send("ok")
})

router.post('/Register',async(req,res)=>{
      console.log(req.body)
      const {name,email,password,cpassword}=req.body
      if(!name || !email || !password || !cpassword){
        return res.status(422).json({error:"please fill all the fields"})
      }
      try{
        const userExist=await User.findOne({email})
        if(userExist){
            return res.status(422).json({error:"Email already pesent"})
        }else if(password!=cpassword){
            return res.status(422).json({error:"password and confirm password not matching"})
        }

        const user=new User({name,email,password,cpassword})
        await user.save()

        res.status(201).json({message:"user created successfully"})
      }catch(err){
        console.log(`${err}`)
      }
})


router.post("/Login",async(req,res)=>{
     try{
         const {email,password} = req.body
         if(!email || !password){
            return res.status(422).json({error:"please fill all fields"})
         } 
         const Loginuser=await User.findOne({email})

         if(!Loginuser){
            return res.status(422).json({error:"please enter valid credentials"})
         }
         else{
            const isMatch=await bcrypt.compare(password,Loginuser.password)
            if(isMatch){
               const token=await Loginuser.generateAuthToken()
               console.log(token);

               res.status(201).json({ message: "user Signin Successfully",token:token});
            }
            else{
               return res.status(422).json({error:"enter valid credentials"})
            }
         }
     }catch(err){
        console.log(`${err}`)
     }
})

router.post('/create-post',async(req,res)=>{
   try{
      
      const {title,content}=req.body
      console.log(title)
      console.log(content)
      const post=new Post({title,content})
      //console.log("11")
      const postData=await post.save();
      if(!postData){
         console.log ("here")
         return res.status(422).json({message:"error occured"})
      }else{
      return res.status(201).json({message:"post added sucessfully"})
      }
   }catch(err){
      
      return res.status(422).json({message:"error occured 1"})
   }
})
router.get('/check',authenticate,(req,res)=>{
   try{
      const userdata=req.user
      res.status(200).json({msg:userdata})
   }catch(err){
      console.log("${err}")
   }
})
//friend routes
router.post('/cancelRequest', authenticate, async(req, res)=>{
   const id=req.userID
   try{
      const friendUser=await User.findOne({_id: req.body.ide})
      const user=await User.findOne({_id: id})
      const usertoFriend = await User.findByIdAndUpdate(
         user._id,
         { $pull: { pendingRequest:friendUser._id} },
         { new: true } 
      )
      const FriendtoUser = await User.findByIdAndUpdate(
         friendUser._id,
         { $pull: { pendingRequestSent:user._id} },
         { new: true } 
      )
      res.status(200).json({message: "Done"})
   }catch(err){
      console.log(`${err}`)
   }
})

router.post('/sendRequest', authenticate, async(req,res)=>{
   const id=req.userID
   try{
      
      const friendUser=await User.findOne({_id: req.body.ide})
      const user=await User.findOne({_id: id})
      const usertoFriend = await User.findByIdAndUpdate(
         user._id,
         { $push: { pendingRequestSent:friendUser._id} },
         { new: true } 
      )
      const FriendtoUser = await User.findByIdAndUpdate(
         friendUser._id,
         { $push: { pendingRequest:user._id} },
         { new: true } 
      )
      res.status(200).json({message: "Request Sent"})
   }catch(err){
      console.log("User not found")
   }
})
router.post('/acceptRequest', authenticate, async(req,res)=>{
   const id=req.userID
   try{
      console.log(req.body.ide)
      console.log(req.params.id)
      const friendUser=await User.findOne({_id: req.body.ide})
      const user=await User.findOne({_id: id})
      const usertoFriend = await User.findByIdAndUpdate(
         user._id,
         { $push: { friends:friendUser._id} },
         { new: true } 
      )
      const FriendtoUser = await User.findByIdAndUpdate(
         friendUser._id,
         { $push: { friends:user._id} },
         { new: true } 
      )
      const usertoFriendremove = await User.findByIdAndUpdate(
         user._id,
         { $pull: { pendingRequest:friendUser._id} },
         { new: true } 
      )
      const FriendtoUserremove = await User.findByIdAndUpdate(
         friendUser._id,
         { $pull: { pendingRequestSent:user._id} },
         { new: true } 
      )
      res.status(200).json({message: "Done"})
   }catch(err){
      console.log(`${err}`)
   }
})
router.post('/unfriend', authenticate, async(req, res)=>{
   const id=req.userID
   try{
      const friendUser=await User.findOne({_id: req.body.ide})
      const user=await User.findOne({_id: id})
      const usertoFriend = await User.findByIdAndUpdate(
         user._id,
         { $pull: { friends:friendUser._id} },
         { new: true } 
      )
      const FriendtoUser = await User.findByIdAndUpdate(
         friendUser._id,
         { $pull: { friends:user._id} },
         { new: true } 
      )
      res.status(200).json({message: "Done"})
   }catch(err){
      console.log(`${err}`)
   }
})
router.post('/highscore',authenticate,async(req,res)=>{
   try{
      const user=await User.findOne({_id:req.userID})
      const id=req.userID
      const currentScore=req.body.score
      const highscore=user.highScore
      console.log(currentScore)
      const curr=parseInt(currentScore)
      console.log(curr)
      if(curr>highscore){
         const tm= await User.findByIdAndUpdate(id,
            {$set:{highScore:curr}},
            {new:true});
      }
      res.status(200).json({message:"all ok"})
   }catch(err){
      console.log("${err}")
   }
})
router.get('/leaderboard-backend',authenticate,async(req,res)=>{
      const allUsers=await User.find({})
      let sortedData=[...allUsers].sort((a,b)=>b.highScore-a.highScore)
      res.status(200).json({msg:sortedData})
})
router.get('/getfriends', authenticate, async(req, res)=>{
   const id=req.userID
   console.log(id)
   try{
      const currUser=await User.findOne({_id:id})
      const pendingRequest=currUser.pendingRequest
      const currFriends=currUser.friends
      const pendingRequestSent=currUser.pendingRequestSent
      const allUsers=await User.find({_id: {$nin: [pendingRequest, currFriends,pendingRequestSent,currUser._id]}})
      res.status(200).json({msg: allUsers})
   }catch(err){
      res.status(400).json({msg: "error"})
   }
})
router.get('/myfriends',authenticate,async(req,res)=>{
   const id=req.userID
   try {
      const currUser=await User.findOne({_id:id})
      const currFriends=await currUser.populate('friends')
      res.status(200).json({msg:currFriends.friends})
         
   } catch (error) {
         res.status(400).json({msg:"Error"})
   }
})
router.get('/mypendingrequest',authenticate,async(req,res)=>{
   const id=req.userID
   try {
      const currUser=await User.findOne({_id:id})
      const pendingRequest=await currUser.populate('pendingRequest')
      res.status(200).json({msg:pendingRequest.pendingRequest})
   } catch (error) {
      res.status(400).json({msg:"error occured"})
   }
})
router.post('/sendmessage',authenticate,async(req,res)=>{
   const id=req.userID
   try{
      const friend=req.body.ide
      const message=req.body.content
      //console.log({id,friend,message})
      const msg = new Message({ message, fromUser: req.userID, toUser: friend });
      await msg.save()
      res.status(200).json({msg:"all ok"})
   }catch(err){
      res.status(400).json({msg:"error occurred"})
      console.log(`${err}`)
   }
})
router.post('/getmessage', authenticate, async (req, res) => {
   try {
       const fromUser = req.userID;  
       const toUser = req.body.ide; 
       const messages = await Message.find({
         $or: [
            { $and: [{ fromUser }, { toUser }] },
            { $and: [{ fromUser: toUser }, { toUser: fromUser }] },
        ],
       }).sort({ updatedAt: 1 }); 
       
       const projectedMessage=messages.map(msg=>{
         return{
            fromUser: msg.fromUser.equals(fromUser),  
           message: msg.message,
         }
       })
       res.status(200).json({ msg:projectedMessage });
   } catch (error) {
       console.error(error);
       res.status(500).json({ msg: 'Internal Server Error' });
   }
});

router.post('/getpost', authenticate, async (req, res) => {
   try {
      const fromUser = req.userID;
      const currUser = await User.findOne({ _id: fromUser });
      const currFriends = currUser.friends;
      const usersToSearch = [...currFriends, fromUser];
      const projectedPost = await Post.find({ original: { $in: usersToSearch } }).sort({ createdAt: -1 });

      const likedUsers = projectedPost.map((post) => {
         const isLiked = post.likes && post.likes.includes(fromUser.toString());
         return {
            isLiked: !!isLiked, // Convert to boolean
            post,
            fromSelf:post.original.equals(fromUser)
         };
      });

      res.status(200).json({ msg: likedUsers });
   } catch (err) {
      console.log(`${err}`);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/addlike', authenticate, async (req, res) => {
   try {
      const fromUser = req.userID;
      const postId = req.body.postId;

      const post = await Post.findById(postId);

      if (!post) {
         return res.status(404).json({ msg: "Post not found" });
      }

      // Check if fromUser is in the likes array
      const isLiked = post.likes.includes(fromUser);

      const updateOperator = isLiked
         ? { $pull: { likes: fromUser } } // Remove from likes array
         : { $push: { likes: fromUser } }; // Add to likes array

      const updatedPost = await Post.findByIdAndUpdate(
         postId,
         updateOperator,
         { new: true } // This ensures that the updated document is returned
      );
      +

      res.status(200).json({ msg: isLiked ? "Like removed" : "Like added", updatedPost });
   } catch (err) {
      console.log(`${err}`);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});



router.delete('/deletepost',authenticate,async(req,res)=>{
   try{
      const postId=req.body.postId
      const deletepost=await Post.findByIdAndDelete(postId)
      res.status(200).json({msg:"post deleted"})
   }catch(err){
      console.log(`${err}`)
   }
})
router.post('/addcomment', authenticate, async (req, res) => {
   try {
      const fromUser = req.userID;
      const postId = req.body.postId;
      const content = req.body.content;
      const currUser=await User.findOne({_id:fromUser})
      const name=currUser.name
      // Use findByIdAndUpdate to update the specific post by its _id
      const updatedPost = await Post.findByIdAndUpdate(
         postId,
         {
            $push: {
               comments: { user: name, content: content }
            }
         },
         { new: true }
      );

      

      res.status(200).json({ msg: "Comment added", updatedPost });
   } catch (err) {
      console.log(`${err}`);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

module.exports=router
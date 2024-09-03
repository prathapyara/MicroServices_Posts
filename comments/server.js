import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

const commentsByPostId={};

app.post("/posts/:id/comments",async(req,res)=>{
    const id=randomBytes(4).toString("hex");
    const postId=req.params.id;
    const {comment}=req.body;
    commentsByPostId[postId]=[...(commentsByPostId[postId] || []),{commentId:id,comment,status:"Pending"}];
    
    axios.post("http://eventbus-srv:3005/event",{
        type:"CreateComment",
        data:{
            commentId:id,
            comment:comment,
            postId:postId,
            status:"Pending"
        }
    })

    res.status(201).send({message:`new comment is created with ${id} to post ${postId}`});
})

app.get("/posts/:id/comments",(req,res)=>{
    const postId=req.params.id;
    res.send(commentsByPostId[postId] || []);
})

app.post("/event",async(req,res)=>{
    if(req.body.type==="Moderateupdate"){
        const {commentId,comment,postId,status}=req.body.data;
        const comments=commentsByPostId[postId];
        console.log("iam here in comments");
        const commentupdate=comments.find((comment)=>comment.commentId===commentId);
        commentupdate.status=status;

        await axios.post("http://eventbus-srv:3005/event",{
            type:"commentUpdated",
            data:{
                commentId,comment,postId,status
            }
        })
    }
    console.log("message received",req.body.type);
})

const PORT=process.env.PORT||3002;

app.listen(PORT,()=>{
    console.log(`listening to the ${PORT} comments`)
})
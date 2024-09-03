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

app.post("/event",async(req,res)=>{
    const {commentId,comment,postId,status}=req.body.data;
    if(req.body.type==="CreateComment"){
        const moderate=req.body.data.comment.includes("Orange")?"Reject":"Approve";
       
        await axios.post("http://eventbus-srv:3005/event",{
            type:"Moderateupdate",
            data:{commentId,comment,postId,status:moderate}
        })
        console.log(moderate);
    }

    res.send({});
})

const PORT=process.env.PORT||3004;

app.listen(PORT,()=>{
    console.log(`listening to the ${PORT} Moderate`)
})
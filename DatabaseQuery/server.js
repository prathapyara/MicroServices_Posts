import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

const finalPost={};

app.get("/finalPost",(req,res)=>{
    res.send(finalPost);
})

function handleEvent(req){
    if(req.body.type==="CreatePost"){
        console.log("iam here")
        finalPost[req.body.data.id]={PostId:req.body.data.id,title:req.body.data.title,comments:[]}
    }
    if(req.body.type==="CreateComment"){
        const {commentId,comment,status}=req.body.data;
        console.log(req.body.data);
        console.log(commentId);
        finalPost[req.body.data.postId].comments.push({commentId:commentId,comment,status});
        console.log(finalPost[req.body.data.postId].comments);
    }
    if(req.body.type==="commentUpdated"){
        const {comment,commentId,postId,status}=req.body.data;
        const post=finalPost[postId];
        //console.log(post.comments);
        const updateComment=post.comments.find((comment)=>comment.commentId===commentId);
        updateComment.status=status;
        // console.log(updateComment)
        // console.log(finalPost);
    }
}

app.post("/event",(req,res)=>{
    handleEvent(req);
    res.send({});
})

const PORT=process.env.PORT||3003;

app.listen(PORT,()=>{
    console.log(`listening to the ${PORT} Query`);
     
})
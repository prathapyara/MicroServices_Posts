import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios"

const app=express();
app.use(express.json());
app.use(cors());

const post={};

app.post("/posts",async (req,res)=>{
    const id=randomBytes(4).toString("hex");
    const {title}=req.body;
    post[id]={id,title};
    axios.post("http://eventbus-srv:3005",{
        type:"CreatePost",
        data:{
            id,title
        }
    })

    res.status(201).send({message:`new post is created with id ${id}`});
})

app.get("/posts",(req,res)=>{
    res.send({message:"I am here",post});
})

app.post("/event",(req,res)=>{
    console.log("message received",req.body.type)
})

const PORT=process.env.PORT||3001;

app.listen(PORT,()=>{
    console.log("this is the checing of version")
    console.log(`listening to the ${PORT} Posts`)
})
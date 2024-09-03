import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios"

const app = express();
app.use(express.json());
app.use(cors());

const events=[];

app.post("/event", (req, res) => {

    const event = req.body;
    events.push(event);
    console.log(event);
    if (req.body.type === "Moderateupdate") {
        axios.post('http://localhost:3002/event', event);
    }
    else if (req.body.type === "commentUpdated") {
        console.log("iam here 2");
        axios.post("http://localhost:3003/event", event);
    } else {
        console.log("iam here");
        axios.post("http://posts-clusterip-srv:3001/event", event);
        axios.post("http://comments-clusterip-srv:3002/event", event);
        axios.post("http://query-clusterip-srv:3003/event", event);
        axios.post("http://moderateevent-clusterip-srv:3004/event", event);
    }
    res.send({});
})

app.get("/event",(req,res)=>{
    res.send(events);
})

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`listening to the ${PORT} event`)
});
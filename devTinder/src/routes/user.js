const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//get all the pending request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async(req,res) =>{
    const loggedInUser = req.user;

    try{
        const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
        }).populate("fromUserId", "firstName lastName about age gender skills")
        //}).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})


//get user connection
userRouter.get("/user/connection", userAuth, async(req,res) => {
    const loggedInUser = req.user;
    try{
        const connections = await ConnectionRequest.find(
            {
                $or: [
                    {
                        toUserId: loggedInUser._id, status: "accepted"
                    }, {
                        fromUserId: loggedInUser._id, status: "accepted"
                    }
                ]
            }
        ).populate("fromUserId", "firstName lastName skills about age").populate("toUserId", "firstName lastName skills about age")

        const data = connections.map((row) => {
            if(row.fromUserId.equals(loggedInUser._id)){
                    return row.toUserId
            }else{
                return row.fromUserId
            }
        })

        res.json({
            message: "Here are the connectios",
            data
        })
    }catch(error){
        res.status(400).send("ERROR: "+ err.message)
    }  
})


userRouter.get("/user/feed", userAuth, async(req, res)=> {
    const loggedInUser = req.user;

    try{
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {
                    fromUserId: loggedInUser._id,
                },{
                    toUserId: loggedInUser._id,
                }
            ]
        }).select("fromUserId toUserId")

        const hideFromFeed = new Set();
        connectionRequest.map((req) => {
            hideFromFeed.add(req.fromUserId.toString());
            hideFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {
                    _id: {$nin: Array.from(hideFromFeed)}
                },
                {
                    _id: {$ne: loggedInUser._id}
                }
            ]
        }).select("firstName lastName age about gender")

        res.send(users)
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})


module.exports = userRouter;
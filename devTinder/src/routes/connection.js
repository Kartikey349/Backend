const express = require("express")
const connectionRouter = express.Router();

const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


connectionRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {

    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    try{
        //validating status type
        const isValidStatus = allowedStatus.includes(status);
        if(!isValidStatus){
            throw new Error("invalid status type: "+ status)
        }

        //.equals is used bcoz both are objId
        if(fromUserId.equals(toUserId)){
            return res.send("you can't send request to yourself")
        }

        //validate toUserId actually exists in Db
        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found")
        }


        //check whether existing connection request
        const validate = await ConnectionRequest.findOne({
            $or: [
                {
                    toUserId,
                    fromUserId
                },{
                    toUserId: fromUserId,
                    fromUserId: toUserId
                }
            ]})

        if(validate){
            throw new Error("request already exists")
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} ${status} ${toUser.firstName}`,
            data,
        })
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})
module.exports = connectionRouter;

connectionRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const status = req.params.status
        const requestId = req.params.requestId

        const isAllowed = ["accepted", "rejected"].includes(status);
        if(!isAllowed){
            throw new Error("invalid status type: " + status)
        }

        const connectionRequest = await ConnectionRequest.findOne(
            {
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            }
        )

        if(!connectionRequest){
            throw new Error("Connection request not found")
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save()
        res.json({
            message:`connection request is successfully ${status}`,
            data,
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})
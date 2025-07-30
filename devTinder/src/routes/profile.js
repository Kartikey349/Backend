const express = require("express")
const profileRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const {validateUpdate} = require("../utils/validation");

//use of jwt and cookies---- view profile api
profileRouter.get("/profile/view", userAuth , async(req, res) => {
    try{
        const user = req.user;

        res.send(user);
    }catch(err){
        res.status(500).send("ERROR: " + err.message)
    }
})

//edit profile api
profileRouter.patch("/profile/edit",userAuth, async(req, res) => {
    const user = req.user;
    const update = req.body;

    const isValidate = validateUpdate(req);

    try{
        if(!isValidate){
            throw new Error("can not update profile")
        }
        const updated = await User.findByIdAndUpdate(user._id, update,{     
            new: true,
            runValidators: true,
        })
        res.json({
            message: updated.firstName + ", your profile is updated successfully",
            data: updated
        })
    }catch(err){
        res.status(403).send("Error: " + err.message)
    }
})

module.exports = profileRouter
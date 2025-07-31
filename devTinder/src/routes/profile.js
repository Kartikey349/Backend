const express = require("express")
const profileRouter = express.Router();
const bcrypt = require("bcrypt")

const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const {validateUpdate} = require("../utils/validation");
const validator = require("validator") 

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

profileRouter.patch("/profile/password",userAuth, async(req, res) => {
    const currentPassword = req.body.password;
    const newPassword = req.body.newPassword;

    const user = req.user;
     try{
        const isValid = await bcrypt.compare(currentPassword, user.password);

        if(isValid){
            if (!validator.isStrongPassword(newPassword)) {
                throw new Error("New password must be stronger");
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            res.send("successfully upated")
        }else{
            throw new Error("enter right current password");
        }
        
     }catch(err){
        res.status(500).send("ERROR: "+ err.message)
     }
})

module.exports = profileRouter
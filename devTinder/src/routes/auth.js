const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt")
const User = require("../models/user");
const {validationSignup} = require("../utils/validation");

//signUp
authRouter.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        emailId,
        password,
        skills,
        about,
        gender,
        age
    } = req.body;
   
    try{
        //validation of data
        validationSignup(req)

        //Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            skills,
            about,
            gender,
            age
        });
        await user.save();
        res.send("successfully added to the DB")
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

//Login api
authRouter.post("/login", async (req,res) => {
    const {
        emailId,
        password
    } = req.body;

    try{
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("invalid credentials")
        }
        const passwordValid = await bcrypt.compare(password, user.password);

        if(passwordValid){
            //create a token
            const token = user.getJwt();

            //add the token to cookie and send the response to the user
            res.cookie("token", token)

            res.send("login succesfull")
        }else{
            throw new Error("wrong password")
        }
    }catch(err){
        res.status(400).send("something went wrong " + err.message)
    }
})

//Logout
authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("logout successfully")
})


module.exports = authRouter;
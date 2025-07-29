const express = require("express");
require('dotenv').config();
const connectDb =  require("./config/database")
const User = require("./models/user");
const {validationSignup} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middleware/auth")

const app = express();


// app.get("/user/:userId/:name", (req,res) => {
//     //console.log(req.query) --- for query param like /user?userId=101
//     console.log(req.params) //---> for dynamic routes like /user/101/kartikey
//     res.send("something.....")
// })

//ab?c => abc, ac
//ab+c => abc, abbbc, abbbbbbbbbc
//ab*cd => absknksncd, abcd, /ab<anything>cd
//  /a/ - regex => anyroute containing 'a' will get result
// /.*fly$/ => any route ending with 'fly'


app.use(express.json())//middleware
app.use(cookieParser());

// app.use("/signup", async (req,res,next) => {
//     const emailId = req.body.emailId
//     try{
//         const user = await User.findOne({emailId: emailId })
//         if(user){
//             throw new Error
//         }else{
//             next()
//         }
        
//     }catch(err){
//         res.status(501).send("Email already exist")
//     }
// })





//adding document to the DB dynamically 
app.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        emailId,
        password,
        skills
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
            skills
        });
        await user.save();
        res.send("successfully added to the DB")
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})


//Login api
app.post("/login", async (req,res) => {
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


//use of jwt and cookies
app.get("/profile", userAuth , async(req, res) => {
    try{
        const user = req.user;

        res.send(user);
    }catch(err){
        res.status(500).send("ERROR: " + err.message)
    }
})


//api to send connection request
app.post("/sendConnectionRequest",userAuth, async (req,res) => {
    const user = req.user;

    res.send("connection request sent by " + user.firstName)
})




// app.use("/signup", (req, res,next) => {
//     const token = "xo"
//     const is_authorised = token === "xo";

//     if(is_authorised){
//         next();
//     }else{
//         res.status(501).send("unauthorised access");
//     }
// })


// app.post("/signup", (req,res) => {
//     console.log(req.body)
//     res.send("successfully saved the data");
// })



//fetching one user with same emailId
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId : userEmail})
        if(user.length === 0){
            res.status(404).send("user not found");
        }else{
            res.send(user)
        }

    }catch(err){
        res.status(400).send("something went wrong")
    }
})


//fetching all users
app.get("/user", async (req,res) =>{
    try{
        const users = await User.find({});
        res.send(users);
 
    }catch(err){
        res.status(400).send("something went wrong")
    }
})



//fetching document by Id
app.get("/user", async (req,res) => {
    const userId = req.body;

    try{
        const user = await User.findById(userId)
        if(user.length === 0){
            res.status(403).send("user not found")
        }else{
            res.send(user);
        }

    }catch(err){
        res.status(400).send("something went wrong")
    }
})


//delete document by Id
app.delete("/user", async (req,res) => {
    const userId = req.body;
    try{
        const user = await User.findByIdAndDelete(userId);
        console.log(user);
        res.send("deleted from the DB");
    }catch(err){
        res.status(400).send("soomething went wrong")
    }
})


//update the document by Id
app.patch("/user/:id", async (req,res) => {

    const userId = req.params.id
    const update = req.body;
    try{
        const IS_ALLOWED = ["lastName", "password", "skills", "about"];
        const updateAllowed = Object.keys(update).every((e) => IS_ALLOWED.includes(e));

        if(!updateAllowed){
            throw new Error("update failed")
        }

        await User.findByIdAndUpdate(userId, update, {
            returnDocument : "after",
            runValidators: "true"
        })
        res.send("succesfully updated")
    }catch(err){
        res.status(400).send("update failed " +  err.message)
    }
})


//update the document by email
app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const update = req.body

    try {
        await User.findOneAndUpdate({ emailId: emailId }, update, {
            returnDocument : "after",
            runValidators: "true"
        })
        res.send("succesfully updated the document")
    } catch (error) {
         res.status(400).send("soomething went wrong " + error.message)
    }
})



connectDb().then(() => {
    console.log("database connection established..");
    app.listen(3000,() => {
    console.log("Server is succussfully running on port 3000");
})
}).catch(err => {
    console.error("database can not be connected")
})


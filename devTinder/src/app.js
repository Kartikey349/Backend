const express = require("express");
const connectDb =  require("./config/database")
const User = require("./models/user");
const {validationSignup} = require("./utils/validation")

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


app.use("/signup", async (req,res,next) => {
    const emailId = req.body.emailId
    try{
        const user = await User.findOne({emailId: emailId })
        if(user){
            throw new Error
        }else{
            next()
        }
        
    }catch(err){
        res.status(501).send("Email already exist")
    }
})


//adding document to the DB dynamically 
app.post("/signup", async (req, res) => {
    const userInfo = req.body;
   
    try{
        validationSignup(req)

        const user = new User(userInfo);
        await user.save();
        res.send("successfully added to the DB")
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
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


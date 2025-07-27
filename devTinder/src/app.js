const express = require("express");
const connectDb =  require("./config/database")
const User = require("./models/user")

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

app.use("/signup", (req, res,next) => {
    const token = "xo"
    const is_authorised = token === "xo";

    if(is_authorised){
        next();
    }else{
        res.status(501).send("unauthorised access");
    }
})

app.post("/signup", async (req,res) => {
    const userInfo = {
        firstName: "sarvan",
        lastName: "tesfaye",
        emailId: "thesarvan@gmail.com",
        password: "thotho",
        age: 31
    }


    //always use error handling while interacting with database
    try{
        const user = new User(userInfo);
        await user.save();
        res.send("succesfully added to the database");
    }catch(err){
        res.status(400).send("error saving the user");
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


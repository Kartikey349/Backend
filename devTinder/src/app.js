const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req,res) => {
    //console.log(req.query) --- for query param like /user?userId=101
    console.log(req.params) //---> for dynamic routes like /user/101/kartikey
    res.send("something.....")
})

//ab?c => abc, ac
//ab+c => abc, abbbc, abbbbbbbbbc
//ab*cd => absknksncd, abcd, /ab<anything>cd
//  /a/ - regex => anyroute containing 'a' will get result
// /.*fly$/ => any route ending with 'fly'

app.listen(3000,() => {
    console.log("Server is succussfully running on port 3000");
} )
const express = require("express")

const app = express();

app.get("/", (req,res, next) => {
    console.log("inside from route handler 1")
    //res.send("route handler 1")
    next();
},(req, res) => {
    console.log("inside from route handler 2")
    res.send("route handler 2")
})

app.listen(7777, () => {
    console.log("server is successfully running on port 7777")
})
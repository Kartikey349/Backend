const express = require("express");

const app = express();


// app.use("/data", (req,res) => {
//     res.send("data page form the server");
// })

// app.use("/hello", (req,res) => {
//     res.send("hello namaste!!");
// })

//this will only hanfle GET call to /user
app.get("/user", (req,res) => {
    res.send({firstname: "kartikey", lastname: "sharma"})
})

app.post("/user", (req,res) => {
    res.send("data succesfully stored to the database")
})

app.delete("/user", (req, res) => {
    res.send("succesfully deleted from the database")
})


//this will match all the HTTP methods api calls to /test
app.use("/test",(req,res) => {
    res.send("Hello from the server");
})



app.listen(3000,() => {
    console.log("Server is succussfully running on port 3000");
} )
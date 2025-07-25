const express = require("express");

const app = express();

app.use("/data", (req,res) => {
    res.send("data page form the server");
})

app.use("/hello", (req,res) => {
    res.send("hello namaste!!");
})

app.use((req,res) => {
    res.send("Hello from the server");
})

app.listen(3000,() => {
    console.log("Server is succussfully running on port 3000");
} )
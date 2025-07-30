const express = require("express");
require('dotenv').config();
const connectDb =  require("./config/database")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const app = express();

app.use(express.json())//middleware
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRouter = require("./routes/connection")

app.use("/", authRouter);
app.use("/", profileRouter)
app.use("/", connectionRouter)

connectDb().then(() => {
    console.log("database connection established..");
    app.listen(3000,() => {
    console.log("Server is succussfully running on port 3000");
})
}).catch(err => {
    console.error("database can not be connected")
})


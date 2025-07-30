const express = require("express")
const connectionRouter = express.Router();

const {userAuth} = require("../middleware/auth")

//api to send connection request
connectionRouter.post("/sendConnectionRequest",userAuth, async (req,res) => {
    const user = req.user;

    res.send("connection request sent by " + user.firstName)
})

module.exports = connectionRouter;
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {

    try{
    //read the token from the req cookies
    const {token} = req.cookies

    if(!token){
        throw new Error("Token not found, please Login")
    }

    //validate the token
    const decodedData = jwt.verify(token, process.env.TOKEN_KEY)

    const {_id} = decodedData;

    //find the username
    const user = await User.findById(_id);

    if(!user){
        throw new Error("user not found")
    }

    req.user = user
    next();
    
    }catch(err){
        res.status(500).send("ERROR: "+ err.message)
    }

    
};

module.exports =  {
    userAuth
}
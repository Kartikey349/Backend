const express = require("express")

const app = express();

// app.get("/", (req,res, next) => {
//     console.log("inside from route handler 1")
//     //res.send("route handler 1")
//     next();
// },(req, res) => {
//     console.log("inside from route handler 2")
//     res.send("route handler 2")
// })


// app.use("/admin", (req,res, next) => {
//     console.log("credentials being checked");
//     const token = "xyzaxy";
//     const is_authorised = token === "xyz";
//     if(!is_authorised){
//         res.status(401).send("unauthorised request")
//     }else{
//         next();
//     }
// })


// app.get("/admin/getData", (req,res) => {
//     res.send("All data sent");
// })

// app.get("/admin/deleteData", (req,res) => {
//     res.send("deleted all data");
// })


// //for login we dont need authorisation
// app.post("/user/login" , (req, res) => {
//     res.send("recieved login details")
// })

// app.use("/user", (req, res,next) => {
//     console.log("checking user credentials");
//     const token = "xyz";
//     const authorisedUser = token === "xyz";
//     if(!authorisedUser){
//         res.status(401).send("authorised user")
//     }else{
//         next();
//     }
// })

// app.get("/user/data", (req, res) => {
//     res.send("all user data");
// })


app.get("/user", (req, res) => {
    // try{
    //     throw new Error("adhadadadkja");
    //     res.send("user data sent")
    // }catch(err){
    //     res.status(500).send("something went wrong, contact support team")
    // }

    throw new Error("adhadadadkja");
        res.send("user data sent")
})


//always put this at the end, so that it can read the errors occured above
app.use("/", (err, req, res,next) => {
    if(err){
        res.status(500).send("something went wrong")
    }
})

app.listen(7777, () => {
    console.log("server is successfully running on port 7777")
})
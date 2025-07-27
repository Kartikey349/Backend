const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName:  String,
    emailId: String,
    password: String,
    age: Number
})

const User = mongoose.model("user", userSchema);

module.exports = User;
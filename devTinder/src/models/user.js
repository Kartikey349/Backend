const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
        trim: true
    },
    lastName:  String,
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true
    },
    age: {
        type: Number,
        min: 18,
        validate(value){
            if(value < 18){
                throw new Error("age is under 18")
            }
        }
    },
    about:{
        type: String,
        default: "this is the about of the user"
    },
    gender:{
        type: String,
        validate(value){
            if(!["male", "female","other"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
    skills: {
        type: [String],
        validate(value){
            if(value.length > 10){
                throw new Error("so many skills, give limited")
            }
        }
    }
},
{
    timestamps: true
}
)

const User = mongoose.model("user", userSchema);

module.exports = User;
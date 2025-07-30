const validator = require("validator")

const validationSignup = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("firstName and lastName should be entered");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is invalid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}

const validateUpdate = (req) => {
    const isAllowed = ["firstName", "lastName", "age", "gender","email", "skills", "about"];

    const isvalidate = Object.keys(req.body).every(e => isAllowed.includes(e));

    return isvalidate;
}

module.exports = {
    validationSignup,
    validateUpdate
}
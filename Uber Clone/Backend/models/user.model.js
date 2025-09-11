const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema =new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minLength: [3, "first name must be atleast 3 characters long"],
    },
    lastname: {
        type: String,
        minLength: [3, "last name must be atleast 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, "email must be atleast 5 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String
    },

});



UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET)
    return token
}

UserSchema.methods.comparePassword =async function (password) {
    return await bcrypt.compare(password,this.password)
}

UserSchema.static.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}


const userModel = mongoose.model("user", UserSchema)
module.exporst = userModel
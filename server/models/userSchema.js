const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true, "Name Is Required"],
    trim:true
   },
   email:{
    type:String,
    required:[true, "Email Is Required"],
    unique:true
   },
   password:{
    type:String,
    required:[true, "Password Is Required"],
    trim:true
   }
}, {timestamps:true})

const UserSchema = mongoose.model("user", userSchema)

module.exports = {UserSchema}
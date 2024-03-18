const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true, "Name Is Required"],
    trim:true
   },
   price:{
    type:String,
    required:[true, "Price Is Required"],
   },
   category:{
    type:String,
    required:[true, "Category Is Required"],
    trim:true
   },
   company:{
    type:String,
    required:[true, "Company Is Required"],
    trim:true
   },
   userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
   },
   userInfo : [
      {
         name: {
           type: String,
           trim: true,
         },
         email: {
           type: String,
           trim: true,
         },
       },
   ]
}, {timestamps:true})

const ProductSchema = mongoose.model("product", productSchema)

module.exports = {ProductSchema}
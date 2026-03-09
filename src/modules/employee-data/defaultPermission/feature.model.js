const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({

 productId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Product",
  required:true
 },

 name:{
  type:String,
  required:true
 },

 tag:{
  type:String,
  default:null
 },

 description:{
  type:String,
  default:""
 }

},{timestamps:true})

module.exports = mongoose.model("Feature",featureSchema);
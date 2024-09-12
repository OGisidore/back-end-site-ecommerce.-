const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const { Schema } = mongoose;

 var userSchema = new Schema({
    "username" :{type : String, required : false},
    "firstname" :{type : String, required : false},
    "lastname" :{type : String, required : false},
    "email" :{type : String, required : true, unique : false},
    "password" :{type : String, required : true},
    "avatar" : {type : String, required : false}, 
    "createdAt" : {type : Date , default: Date.now},
 })

 userSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("User", userSchema)



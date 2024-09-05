

const mongoose = require('mongoose')


const { Schema } = mongoose;
 var postSchema = new Schema({
    title : {type:String, required : true},
    content : {type :String, required : true},
    category : {type :String, required : true},
    image : {type :String, required : true},
    userId : {type : Schema.Types.ObjectId , ref: 'User'},
    publishedAt : { type: Date, default: Date.now },
 })

module.exports = mongoose.model("Post", postSchema)


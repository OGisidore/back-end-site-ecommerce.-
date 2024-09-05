

const mongoose = require('mongoose')


const { Schema } = mongoose;
 var categorySchema = new Schema({
    name : {type:String, required : true},
    description : {type :String, required : true},
    userId : {type : Schema.Types.ObjectId , ref: 'User'},
    createddAt : { type: Date, default: Date.now },
 })

module.exports = mongoose.model("Categrory", categorySchema)


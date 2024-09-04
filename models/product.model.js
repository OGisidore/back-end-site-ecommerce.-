const mongoose = require('mongoose')


const { Schema } = mongoose;
 var productSchema = new Schema({
    name : {type:String, required : true},
    description : {type :String, required : true},
    prices : {type :Number, required : true},
    stock : {type :Number, required : true},
    image : {type :String, required : true},
    userId : {type : Schema.Types.ObjectId , ref: 'User'},
    createdAt : { type: Date, default: Date.now },
 })

module.exports = mongoose.model("Product", productSchema)




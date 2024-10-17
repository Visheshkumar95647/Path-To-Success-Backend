const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required : true
    }
    ,
    number : {
        type :Number,
        unique : true,
        required : true
    }
})
const user = mongoose.model('updateData' , UserSchema );
module.exports = user;
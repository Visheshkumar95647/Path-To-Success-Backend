const mongoose = require('mongoose');
const ProviderSchema = new mongoose.Schema({
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
    },
    companyname :{
        type : String,
        required : true
    }
})
const Provider = mongoose.model('providerdetails' , ProviderSchema);
module.exports = Provider;
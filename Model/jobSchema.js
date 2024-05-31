const mongoose = require('mongoose');
const jobadd = new mongoose.Schema({
    jobtype:{
        type:String,
        required:true
    },
    joblocation:{
        type:String,
        required:true
    },
    jobmode:{
        type:String,
        required:true
    },
    jobtitle:{
        type : String,
        required:true,
    },
    techskill :{
        type : String,
        required:true
    },
    jobdescription:{
        type:String,
        required:true
    },
    jobduration:{
        type:String,
        required:true
    },
    joblink:{
        type:String,
        required:true
    }
})
const a = mongoose.model('jobdetails' , jobadd);
module.exports = a;
// Output: Tue Apr 20 2024 12:00:00 GMT+0000 (Coordinated Universal Time)
// const today = new Date();
// const formattedDate = today.toISOString().split('T')[0]; // Extracts date part
// console.log(formattedDate); // Output: "2024-04-20"

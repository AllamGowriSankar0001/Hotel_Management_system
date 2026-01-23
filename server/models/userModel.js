const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        maxlength:6
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        required:true,
        maxlength:10,
        minlength:10,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    role:{
        type:String,
        enum:['admin','reception','cleaner'],
        
    }

},{timestamps:true});

module.exports = mongoose.model('User',userSchema);
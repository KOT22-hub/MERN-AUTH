const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
     
    },
   verifyOTP:{
        type:String,
        default:''
     
    },
    verifyOTPExpiresAt:{
        type:Date,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOTP:{
        type:String,
        default:''
    },
    resetOTPExpiresAt:{
        type:Date,
        default:0
    }

    
})

const User = mongoose.model("UserSchema",userSchema);

module.exports=User;
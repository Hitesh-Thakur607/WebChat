const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
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
    }
    ,picture:{
        type:String
        // required:true
        ,default:"https://iconarchive.com/download/i107272/Flat-Icons/Flat-User-Icon/user.svg"
    }
    ,timestamp:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:true
    }
})
const User=mongoose.model("User",userSchema);
module.exports=User;
// user=[];
// module.exports=user;
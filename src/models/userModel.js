import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   username: {
    type:String,
    required:[true,"Please provide a username"],
    unique:true,
   },
   email:{
    type:String,
    required:[true,"Please provide a email"],
    unique:true,
    trim:true,
    lowercase:true,
   },
   password: {
    type:String,
    required:[true,"Please provide a password"],
    minLength:[6,"Password must be at least 6 characters"],
   },
   isVerified:{
    type:Boolean,
    default:false,
   },
   isAdmin:{
    type:Boolean,
    default:false,
   },
   forgotPasswordToken:String,
   forgotPasswordTokenExpiry:Date,
   verifyToken:String,
   verifyTokenExpiry:Date
},{
   timestamps:true,

});


const User = mongoose.models.users || mongoose.model("users",userSchema);

export default User;
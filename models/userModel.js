//kuch cheeje mujhe user module mai chaiye jaise kya kya mujhe sbse pehle chaiye name , email , password , otp ka verification krwana hai
//ab otp bhejunga toh otp ki expiry ka time bhi chaiye mujhe tab bhi account verify hoga ki nhi woh bhi dekhna hoga otp bhej rha hu toh reset bhi krna hoga otp 
//reset wala otp kab expire hoga yeh bhi chaiye mujhe soooooo yeh hmara basic requirements hua user model se


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,


    },
    verifyOtp: {
        type:String,
        default:"",
    },
    verifyOtpExpireAt: {
        type:Number,
        default:false
    },
    resetOtp:{
        type:String,
        default:"",
    },
    resetOtpExpireAt: {
        type:Number,
        default:0
    }

})

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    key:{type:String,required:true,default:"current_otp"},
    otp: { type: String, required: true,default:"A0"},
});

const OtpModel = mongoose.model("Otp", otpSchema);

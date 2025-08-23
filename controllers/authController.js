import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import cookieParser from "cookie-parser";
import transporter from "../config/nodemailer.js";



//yahan user ko hume login krwana hai , register krwana hai aur otp wagera ki saari cheeje yahain pr hogi 

//so pehle user ko register krwayega tabhi toh ja kr woh login hoga so uska pehle logic likhna pdega


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    //wahi common sa syntax ki inme se koi bhi agar nhi hai toh res send kro 
    if (!name||!email||!password) {
     return res.json({sucess:false , message:"Missing Details"})   
    }
    //ab hmara try catch wala syntax ki hum pehle user ke diye hue password ko hash krenge
    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await userModel.create({
            name,
            email,
            password:hashedPassword
        })
        user.save() // saving user to database

        //humko toh yeh bhi check krna hoga ki user exist krta hai ki nhi so 
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({sucess:false , message:"user has already been registered"})
        }

        //jwt ka kaam krenge ab yeh same humne apne demo project mai kiya tha toh wahi wala kaam yahan krenge 
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"5d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 5*24*60*1000
        
        })
        //welcome mail bhej rha hu jo humne nodemailer mai likha hai yaad yeh rkhna hai ki yeh part maine baad mai addd kiya hai sbse pehle maine pura
        //basic auth system likha hai uske baad ja kr maine yeh likha hai so sbse pehle basic auth system mtlb register , login , logout , welcome mail 

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to Our Service",
            text: `Hello ${user.name},\n\nThank you for registering! We're glad to have you on board.\n\nBest regards,\nThe Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Email sent: " + info.response);
        });

    } catch (error) {
        res.json({sucess:false , message:error.message})
    }
}


//ab yeh user register ho gya ab isko login krwana hai 
//register krwane ke liye hume user as an input se email aur passwrd chaiye so lets take it and write it similar to register login

export const login = async (req,res) => {
    const {email,password} = req.body;
    if (!email || !password) {
        return res.json({sucess:false , message:"Email and Password are required"})   
    }

    try {
        //jo user ko humne uper register kiya ab uski id se database mai user ko dhundenge obv hai ki mongodb mai jo user save hota hai woh usko ek  unique id deta hai 
        //so id se hum id se user ko fetch kr skte lekin upar login mai humne email se find kiya tha already exist user ko so yahan bhi hu m email se hi kr lenge noooow letsssssss goooooooo

        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({sucess:false , message:"User not found, please register first"})
        }

        //ab agar user mil gya ho toh uske verification ke liye hum uske register ke time pr diye hue password ko compare krenge yeh bhi humne apne demo project mai kiya tha usse hi likh dete
        const isMatch = await bcrypt.compare(password , user.password)
        if (!isMatch) {
            return res.json({sucess:false , message:"Invalid email or password"})
        }

        //agar sab kuch sahi hai toh hum user ko login krwa denge
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"5d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 5*24*60*1000

        })

        return res.json({sucess:true , message:"User logged in successfully"})

    } catch (error) {
        return res.json({sucess:false , message:error.message})
    }

};

// register ho gya login ho gya ab logout ki baariiiiiiiiiiiiiiiiiiiiii so logic kya hona chaiye 
//jo yeh humne cookies ko create ki hai agar hum inhe hi remove kr de toh shayad hmara kaam ho  jaay]na chaiye 
//Cookies are small pieces of data stored in the browser, sent by the server, that get automatically sent back to the server with every request to the same domain.

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        
    })

    return res.json({success:true , message:"User logged out successfully"})
    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}


//ab baari hai verification ke liye OTP bhejne ki so uske liye code likhna hai humko uske kya chaiye hoga
//agar user ko humne register krwa diya hai aur login bhi krwa chuke hai then agar hume usko verify krwana hai toh jo database mai userId hai usse hum 





// Send Verification OTP to the User Email 
export const sendVerifyOtp = async (req,res) => {
    try {
        
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}



export default {register , login , logout}
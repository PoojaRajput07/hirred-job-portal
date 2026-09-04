import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { passwordEmail } from "../utils/passwordEmail.js";
import { Otp } from "../models/otp.model.js";
import { authCookieOptions } from "../utils/cookieOptions.js";

export const Signup=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        if(!email.includes('@')){
            return res.status(400).json({
                message:"invalid email"
            })
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"this email is taken"
            })
        }

        const user=await User.create({
            email:email,
            password:password
        })
        const safeUser=await User.findById(user._id).select("-password -refreshToken");
        
        return res.status(200).json({
            message:"user register successfully",
            user:safeUser
        })
    }catch(error){
        return res.status(404).json({
            message:"something went wrong in registerin the user",
            error:error.message
        })

    }

}
export const Login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        console.log("email",email,"password",password);
        if(!email||!password){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(402).json({
                message:"invalid email"
            })
        }
        const checkPassword=await user.comparePassword(password);
        console.log("result of checking password",checkPassword);
        if(!checkPassword){
            return res.status(400).json({
                message:"incorrect password"
            })
        }
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        user.refreshToken=refreshToken;
       await user.save();
        const loggedUser=await User.findById(user._id).select("-password -refreshToken");
res.cookie("accessToken", accessToken, authCookieOptions);
res.cookie("refreshToken", refreshToken, authCookieOptions);

        return res.status(200)
        .json({
            message:"user logged in successfully",
            loggedUser:loggedUser
        });
    
    
    } catch (error) {
        console.log("error in logging user",error);
        return res.status(500).json({
            message:"something wne twrong",
            error:error.message
        })
        
    }



}

export const Logout=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }
       
       user.refreshToken = null;
    await user.save();

    return res
      .clearCookie("accessToken", authCookieOptions)
      .clearCookie("refreshToken", authCookieOptions)
      .status(200)
      .json({ message: "user logout successfully" });
    } catch (error) {
        return res.status(500).json({
            message:"error in logging out the user",
            error:error.message
        })
        
    }
}

export const RefreshToken=async(req,res)=>{
    try {
        const refreshtokenfromcookie=req.cookies.refreshToken;
        if(!refreshtokenfromcookie){
            return res.status(400).json({
                message:"no refreshtoken in cookie"
            })
        }
        const decoded=jwt.verify(refreshtokenfromcookie,process.env.JWT_REFRESH_TOKEN_SECRET);
        if(!decoded){
            return res.status(400).json({
                message:"invalid refresh token"
            })
        }
        const user=await User.findById(decoded.id);
        if(!user){
            return res.status(400).json({
                message:"no user found while checking refreshtoken"
            })
        }
       const accessToken=await  user.generateAccessToken();
       const refreshToken=await user.generateRefreshToken();
       user.refreshToken=refreshToken;
       await user.save();
res.cookie("accessToken", accessToken, authCookieOptions);
res.cookie("refreshToken", refreshToken, authCookieOptions);


       return res.status(200)
       .json({
        message:"new accessToken is generated and refreshToken is also renewed"
       })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in refreshing acces token",
            erro:error.message
        })
      
        
    }
}

export const ForgetPassword=async(req,res)=>{
    try {
        console.log("req.body of chnage password",req.body);
        const{email}=req.body;
        if(!email){
            return res.status(401).json({
                message:"no email found"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"no user found"
            })
        }
        const otp=Math.floor(100000 + Math.random() * 900000);
        await Otp.create({
            email,
            otp
        })
        const message=`your verification code for password reset is ${otp}`;
        await passwordEmail(email,"change Password",message);
        return res.status(200).json({
            message:"otp sent for password rest was successfull",
            email,
            otp
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in sending otp",
            error:error.message
        })
        
    }

}
export const handleVerifyOtp=async(req,res)=>{
try {
        const{email,otp}=req.body;
        if(!otp){
            return res.status(400).json({
                message:"no otp found"
            })
        }
        const otpRecord=await Otp.findOne({email,otp});
        if(!otpRecord||Date.now()>otpRecord.createdAt.getTime()+60*60*1000){
            return res.status(400).json({
                message:"expired otp"
            })
        }
    return res.status(200).json({
        message:"otp verification done successfully"
    })
} catch (error) {
    return res.status(500).json({
        message:"something went wrong in otp verification"
    })
    
}

}
export const newPassword=async(req,res)=>{
    try {
        const {password,email,otp}=req.body;
        console.log("req.body",req.body);
        if(!password||!email){
            return res.status(400).json({
                message:"newpassword or email is missing"
            })
        }
        const otpRecord=await Otp.findOne({otp,email});
        if(!otpRecord||Date.now()>otpRecord.createdAt.getTime()+1000*60*60){
            return res.status(400).json({
                message:"expire otp"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"no user found"
            })
        }
        user.password=password;
        await user.save();
        await Otp.deleteOne({ _id: otpRecord._id });


        return res.status(200).json({
            message:"pasword changed successfully"
        })

        
    } catch (error) {
        return res.status(500).json({
            message:"something went wong in changing password",
            error:error.message
        })
        
    }
}
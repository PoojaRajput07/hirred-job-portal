import express from "express"
import { ForgetPassword, handleVerifyOtp, Login, Logout, newPassword, RefreshToken, Signup } from "../controller/user.controller.js";
import verifyToken from "../Middleware/auth.middleware.js";
export const authRouter=express.Router();
authRouter.route("/me").get(verifyToken,(req,res)=>{return res.status(200).json({message:"user is logged in",user:req.user})});
authRouter.route("/signup").post(Signup);
authRouter.route("/login").post(Login);
// authRouter.route("/findjob").get(verifyToken);
authRouter.route("/logout").get(verifyToken,Logout);
authRouter.route("/refreshToken").post(RefreshToken);
authRouter.route("/sentMail").post(ForgetPassword);
authRouter.route("/checkotp").post(handleVerifyOtp);
authRouter.route("/newpassword").post(newPassword);


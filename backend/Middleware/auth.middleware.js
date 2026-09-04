import jwt from "jsonwebtoken"
import User from "../models/user.models.js";
const verifyToken=async(req,res,next)=>{
    try {
        const token=await req.cookies?.accessToken;
        console.log("token",token);
        if(!token){
            return res.status(400).json({
                message:"user has no token,do login"
            })
        }
        const decordedToken=await jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECRET);
        if(!decordedToken){
            return res.status(404).json({
                message:"wrong token"
    
            })
        }
      const user=await User.findById(decordedToken.id);
        req.user=user;
      next();
    } catch (error) {
        return res.status(401).json({
            message:"invalid or expired token",
            error:error.message
        })
        
    }

}
export default verifyToken;
import Recruiter from "../models/Recruiter.model.js";
import User from "../models/user.models.js";

const checkRecruiter=async(req,res,next)=>{
  try {
      const user=await User.findById(req.user._id);
      if(!user){
          return res.status(400).json({
              message:"no user found"
          })
      }
      console.log("user.role",user.role);
     if(user.role!="recruiter"){
      return res.status(400).json({
          message:"you are not recruiter in middleware"
      })
     }
     const recruiter=await Recruiter.findOne({user:user._id});
     console.log('recruiter',recruiter);
     req.recruiter=recruiter;
     next();
  } catch (error) {
    return res.status(500).json({
        message:"something went wrong in checking recruiter",
        error:error.message
    })
    
  }
  


}
export default checkRecruiter;
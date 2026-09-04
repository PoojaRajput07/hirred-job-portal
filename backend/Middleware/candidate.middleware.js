import Candidate from "../models/Candidate.model.js";
import User from "../models/user.models.js"

const verifyCandidate=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({
                message:"no user found"
            })
        }
        if(user.role!="candidate"){
            return res.status(400).json({
                message:"you are not a candidate checked by middleware"
            })
        }
        const candidate=await Candidate.findOne({user:user._id});
        if(!candidate){
            return res.status(400).json({
                message:"no candidate found in mid"
            })
        }


req.candidate=candidate;
next();

    }catch(error){
        return res.status(500).json({
            message:"something went wrong in checing  candidate in middleware",
            error:error.message
        })
    }
}
export default verifyCandidate;
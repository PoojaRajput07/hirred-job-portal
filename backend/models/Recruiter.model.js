import mongoose from "mongoose"
const recruiterSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    jobs:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Job"
    }]


},{timestamps:true})
const Recruiter=mongoose.model("Recruiter",recruiterSchema);
export default Recruiter;
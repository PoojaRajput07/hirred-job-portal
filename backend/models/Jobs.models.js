import mongoose from "mongoose";
const jobSchema=new mongoose.Schema({
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Recruiter"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    skillsRequired:{
        type:[],
        required:true
    },
    status:{
        type:String,
        enum:["Hiring","Closed"],
        default:"Hiring"
    },
    salary:{
        type:Number,
        required:true
    },
    
    noOfApplicants:{
        type:Number,
        default:0
        
    },
    wishlist:{
        type:Boolean
    },
    company:{
        type:String
    }
},{timestamps:true})
const Job=mongoose.model("Job",jobSchema);
export default Job;
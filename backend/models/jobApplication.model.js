import mongoose from "mongoose"
const JobApplicationSchema=new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    },
    experience:{
        type:Number,
        
    },
    resume:{
        type:String,
        required:true
    },
    skills:[{
        type:String
    }],
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Candidate"
    },
    status:{
        type:String,
        enum:["applied", "shortlisted", "interview", "rejected"],
        default:"applied"

    },
    interviewdate:{type:Date},
    interviewlink:{
                    type:String
     },
     interviewtime:{
        type:String
     },

     mode:{
        type:"String",
        enum:["online","offline"]
     },
     location:{
        type:String
     },
     onlinemode:{
        type:String,
        enum:["zoom","google"]



     }
   
},{timestamps:true});
export const JobApplication=mongoose.model("JobApplication",JobApplicationSchema);
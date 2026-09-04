import mongoose from "mongoose"
const CandidateSchema=new mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        Appiedjobs:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Job"
        }],
        skills:{
            type:[],
        },
        wishlistJob:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Job"//id of jobpost
           
        }],
        experiance:{
            type:Number,
            default:0
        },
        resume:{
            type:String   //cloudinary string
        }
    
},{timestamps:true})
const Candidate=mongoose.model("Candidate",CandidateSchema);
export default Candidate;
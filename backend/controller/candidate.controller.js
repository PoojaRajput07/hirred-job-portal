import Candidate from "../models/Candidate.model.js";
import Job from "../models/Jobs.models.js";
import User from "../models/user.models.js"
import { JobApplication } from "../models/jobApplication.model.js";
import Recruiter from "../models/Recruiter.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


export const madeCandidate=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({
                message:"no user found"
            })
        }
        if(user.role=="recruiter"){
            return res.json({
                message:"you are a recruiter"
                
            })
        }
        const candidate=await Candidate.findOne({user:req.user._id});
        if(candidate){
            return res.status(400).json({
                message:"you are already a candidate"
            })

        }
    user.role="candidate";
    await user.save();
    const newCandidate=await Candidate.create({
        user:user,
    })
     return res.status(200).json({
        message:"user is now a candidate",
        newCandidate
       
     })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in making candidate"
        })
        
    }

}
export const wishlist=async(req,res)=>{
    try{
        const{id}=req.params;
        console.log("id of job",id);
        if(!id){
            return res.json({
                message:"no job id found"
            })
        }
        const job=await Job.findById(id);
        if(!job){
            return res.status(400).json({
                message:"no job exist"
            })
        }
        console.log("req.user._id",req.user._id);
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({
                message:"no user found"
            })
        }
        const candidate=await Candidate.findOne({user:user._id});
        if(!candidate){
            return res.status(400).json({
                message:"no candidate found"
            })
        }
        if(candidate.wishlistJob.some((jobId)=>jobId.toString()===id.toString())){
            return res.status(400).json({
                message:"job is already in wishlist "
            })
        }
        candidate.wishlistJob.push(id);
        await candidate.save();
        return res.status(200).json({
            message:"job added to the wishlist",
            job
        })


    }catch(error){
        return res.status(500).json({
            message:"something went wrong i adding job to the wishlist",
            error:error.message
        })

    }

}

export const removeWishist=async(req,res)=>{
    try{
        const{id}=req.params;
        if(!id){
            return res.status(400).json({
                message:"no id of job found"
            })
        }
        const candidate=await Candidate.findOne({user:req.user._id});
        if(!candidate){
            return res.status(400).json({
                message:"no candidate found"
            })
        }
        if(!candidate.wishlistJob.some((jobId)=>jobId.toString()===id.toString())){
            return res.status(400).json({
                message:"this job is not in wishlist"
            })
        }
        
         let  updatedWishlist= candidate.wishlistJob.filter((curElem)=>
                curElem.toString()!=id.toString()
            )
            candidate.wishlistJob=updatedWishlist;
            await candidate.save();
            return res.status(200).json({
                message:"job remove from wishlist",
                updatedWishlist
            })
    }catch(error){
        return res.status(500).json({
            message:"something went wrong in removing job from wishlist",
            error:error.message
        })

    }
}

export const applyJob=async(req,res)=>{
    try {
       
        const{experience,skills,id}=req.body;
        const skillList = typeof skills === "string"
            ? skills.split(",").map((skill)=>skill.trim()).filter(Boolean)
            : Array.isArray(skills) ? skills : [];
       
        
        if(!id){
            return res.status(400).json({
                message:"no id found"
            })
        }
        if (!req.file) {
            return res.status(400).json({
                message: "no resume found"
            });
        }

        if(!experience||!skillList.length){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        
        const job=await Job.findById(id);
        if(!job){
            return res.status(400).json({
                message:"no job found"
            })
        }
        const candidate=await Candidate.findOne({user:req.user._id});
        if(!candidate){
            return res.status(400).json({
                message:"you are not a candidate"
            })
        }
        if(String(job.status).toLowerCase()==="closed"){
            return res.status(400).json({
                message:"job is closed now"
            })
        }
        if(candidate.Appiedjobs.some((jobId)=>jobId.toString()===id.toString())){
            return res.status(401).json({
                message:"already applied",

            })
        }

         const uploadResult = await uploadToCloudinary(
    req.file.buffer,
    req.file.originalname
);

        const resume = uploadResult.secure_url;

        console.log("resume:", resume);


        candidate.Appiedjobs.push(job._id);
        job.noOfApplicants++;
        const JobApply=await JobApplication.create({
            job:id,
            experience,
            skills:skillList,
            resume,
            candidate
        })
        await job.save();
        await candidate.save();
        return res.status(200).json({
            message:"candidate applied to job successfully",
            candidate,
            JobApply

        })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in applying to the job",
            error:error.message
        })
        
    }
}

// $regex kya karta hai?

// partial match

// "react" match karega:

// React Developer

// frontend react engineer

// REACT js

// 🧠 $options: "i"

// case insensitive

// React = react = REACT
export const seeAllJobs=async(req,res)=>{
    try{
        const{title,location,company}=req.query;
        console.log("search filter",title,location,company);
        let filter={};
        if(title){
            filter.title={$regex:title,$options:"i"}

        }
        if(location){
            filter.location={$regex:location,$options:"i"}
        }
        if(company){
           filter.company={$regex:company,$options:"i"}
        }
        const job=await Job.find(filter);
       return res.status(200).json({
        message:"all jobs are found successfully",
        job
       })

    }catch(error){
        return res.status(500).json({
            message:"soemthing went wrong in fetching all jobs",
            error:error.message
        })

    }
}

export const viewJob=async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            return res.status(400).json({
                message:"no id found"
            })
        }
        const job=await Job.findById(id);
        if(!job){
            return res.status(400).json({
                message:"no job found"
            })
        }
        if(req.user.role=="recruiter"){
            console.log("job.recruiter",job.recruiter.toString(),"req.user._id",req.user._id.toString());
           const recruiter=await Recruiter.findOne({user:req.user._id});
            if(!recruiter || recruiter._id.toString()!=job.recruiter.toString()){
                return res.status(200).json({
                    message:"this job is not posted by you",
                    job
                    
                })
            }
            


           const jobApplicationdetail= await JobApplication.find({job:id}).populate("job").populate({path:"candidate",populate:{path:"user",select:"-password -refreshToken"}});
           
            return res.status(200).json({
                message:"job view succcessfully",
                job,
                jobApplicationdetail
            })
        }
        const candidate=await Candidate.findOne({user:req.user._id});
        if(!candidate){
            return res.status(400).json({
                message:"no user found"
            })
        }
        if(candidate.Appiedjobs.some((jobId)=>jobId.toString()===id.toString())){
            return res.status(200).json({
                message:"already applied to job",
                job
            })
        }
         
        return res.status(200).json({
            message:"job detail found successfully",
            job
        })
        
    } catch (error) {
        return res.status(400).json({
            message:"something went wrong in find job",
            error:error
        })
        
    }
}

export const savejobs=async(req,res)=>{
    try {
        const candidate=req.candidate;
        if(!candidate){
            return res.status(400).json({
                message:"no candidate found"
            })
        }
         await candidate.populate("wishlistJob")
        return res.status(200).json({
            message:"saved jobs are",
            savedjobs:candidate.wishlistJob
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in finding saved jobs",
            error
        })
        
    }

}


export const appliedJobs=async(req,res)=>{
    try {
        const candidate=req.candidate;
        if(!candidate){
            return res.status(400).json({
                message:"no candidate found"
            })
        }
        const jobApplicationdetail=await JobApplication.find({candidate:candidate._id}).populate("job");
        // await candidate.populate("Appiedjobs");
        return res.status(200).json({
            message:"applied jobs found",
            jobApplicationdetail
        })
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in fetching applied jobs",
            error:error.message
        })
        
    }
}
import { JobApplication } from "../models/jobApplication.model.js";
import Job from "../models/Jobs.models.js";
import Recruiter from "../models/Recruiter.model.js";
import User from "../models/user.models.js";
import { sendEmail } from "../utils/sendEmail.js";
import { rejectEmailTemplate } from "../utils/rejectEmailTemplate.js";
import { createZoomMeeting } from "../utils/zoomtoken.js";
import shortlistEmailTemplate from "../utils/shortlistEmailTemplate.js";



export const addJob=async(req,res)=>{
try {
    console.log('hi');
    const recruiter=await Recruiter.findById(req.recruiter._id);
   console.log("req.body",req.body)
        const{title,description,skills,location,salary,companyName,company}=req.body;
        if(!title||!description||!skills||!location||!salary){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
       
        const job=await Job.create({
            title,
            description,
            skillsRequired:skills.split(",").map((curElem)=>curElem.trim()),
            location,
            salary,
            company: companyName || company || "",
            status:"Hiring",
            recruiter:recruiter._id
        })  
        if(!recruiter.jobs){
            recruiter.jobs=[];
        }
         recruiter.jobs.push(job._id);
         await recruiter.save();
        return res.status(200).json({
            message:"job added successfully",
            job:job

        })
        
} catch (error) {
    return res.status(500).json({msg:error.message,success:false});
}

      



}
//all job added by recruiter
export const MyAddedJobs=async(req,res)=>{
    try {
        const recruiter=await Recruiter.findById(req.recruiter._id);
        console.log("recruiter",recruiter);
        if(!recruiter){
            return res.status(400).json({
                message:"no recruiter found"
            })
        }
        const job=await Job.find({recruiter:recruiter._id});
        if(!job){
            return res.status(402).json({
                message:"no job posted by you"
            })
        }
        return res.status(200).json({
            message:"job posted by you are",
            job
        })

    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in fetching job posted by you",
            error:error.message
        })
        
    }
}

export const MadeMeRecruiter=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(402).json({
                message:"no user found"
            })
        }
        const existingRecruiter=await Recruiter.findOne({user:user._id});
        if(existingRecruiter){
            user.role="recruiter";
            await user.save();
            return res.status(200).json({
                message:"recruiter is made",
                newRecruiter:existingRecruiter
            })
        }
        const newRecruiter=await Recruiter.create({
            user,
            jobs:[]
        })

        user.role="recruiter";
        await user.save();
       
        return res.status(200).json({
            message:"recruiter is made",
            newRecruiter
        })
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in making recruiter",
           error:error.message
        })
        
    }
}
//view recruiter aded job in detail
export const viewJob=async(req,res)=>{
    try {
        console.log("id ili ");
        const{id}=req.params;
        if(!id){
            return res.status(400).json({
                message:"no id found"
            })
        }
        console.log("id of job",id);
        console.log("id of recruiter",req.user._id);
        const recruiter=await Recruiter.findById(req.recruiter._id);
        console.log("recruiter ki id",recruiter)
        if(!recruiter){
            return res.status(402).json({
                message:"you are not a recruiter"
            })
        }
        const ownsJob = recruiter.jobs.some((jobId) => jobId.toString() === id.toString());
        if(!ownsJob){
            return res.status(400).json({
                message:"no job found"
            })
        }
        const job=await Job.findById(id);
        if(!job){
            return res.status(400).json({
                message:"no job found in job list"
            })
        }

        return res.status(200).json({
            message:"your clicked job",
            job
        })
    }catch(error){
        return res.status(500).json({
            message:"something went wrong in viewing job",
            error:error.message
        })
    }
}


export const updateJob =async(req,res)=>{
    try {
        const{id}=req.params;
        const{status,title,description,skills,location,salary,companyName,company}=req.body;
        if(!id){
            return res.status(400).json({
                message:"id is mantadory"
            })
        }
        const existingJob=await Job.findById(id);
        if(!existingJob){
            return res.status(404).json({
                message:"no job found"
            })
        }
        if(existingJob.recruiter.toString()!==req.recruiter._id.toString()){
            return res.status(403).json({
                message:"you can only edit jobs posted by you"
            })
        }

        const update={};
        if(status!==undefined) update.status=status;
        if(title!==undefined) update.title=title;
        if(description!==undefined) update.description=description;
        if(location!==undefined) update.location=location;
        if(salary!==undefined) update.salary=salary;
        const companyValue=companyName??company;
        if(companyValue!==undefined) update.company=companyValue;
        if(skills!==undefined){
            update.skillsRequired=typeof skills==="string"
                ? skills.split(",").map((skill)=>skill.trim()).filter(Boolean)
                : skills;
        }

        if(Object.keys(update).length===0){
            return res.status(400).json({
                message:"no fields to update"
            })
        }

        const job=await Job.findByIdAndUpdate(id,{
            $set:update
        },{
            new:true
        })
       
        return res.status(200).json({
            message:"job is updated",
            job
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in updating job",
            error:error.message
        })
        
    }
}
export const recruiterpostDetail=async(req,res)=>{
    try {
        const {id}=req.params;
        console.log("id of recruiter post",id);
        if(!id){
            return res.status(400).json({
                message:"no id found"
            })
        }
        const jobDetail=await JobApplication.findOne({job:id});
        if(!jobDetail){
            return res.status(400).json({

                message:"no job found"
            })
        }
        return res.status(200).json({
            message:"recruiter post detail foun successfully",
            postdetail:jobDetail
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in finding job detail",
            error
        })
        
    }
}

export const rejectApplication=async(req,res)=>{
    try {
        const{id}=req.params; //job ki id
        console.log("id of the job",id);
        if(!id){
            return res.status(400).json({
                message:"no job id found"
            })
        }
        const application=await JobApplication.findByIdAndUpdate(id,{
            $set:{
                status:"rejected"
            }
    },{new:true})
    .populate("job")
    .populate({
        path:"candidate",
        populate:{
            path:"user",
        }
    });
        if(!application){
            return res.status(400).json({
                message:"no job application found"
            })
        }
        await sendEmail({
      to: application.candidate.user.email,
      subject: `Application Update – ${application.job.title}`,
      html: rejectEmailTemplate(
        // application.candidate.name,
        application.job.title
      )
    });
        return res.status(200).json({
            message:"reject application successfully",
            application
        })
    } catch (error) {
        return res.status(500).json({
            message:"error in rejecting the application",
            error:error.message
        })
        
    }
   

    
}

export const shortlistuser=async(req,res)=>{
    try{
        const{id}=req.params;
        if(!id){
            return res.status(400).json({
                message:"no id found"
            })
        }
        const application=await JobApplication.findByIdAndUpdate(id,{
            $set:{
                status:"shortlisted"
            }
        },{
            new:true
        })
        .populate("job")
        .populate({
            path:"candidate",
            populate:{
                path:"user",
            }
        })

        if(!application){
            return res.status(400).json({
                message:"no job application found"
            })
        }
        await sendEmail({
      to: application.candidate.user.email,
      subject: `Application Update – ${application.job.title}`,
      html: shortlistEmailTemplate(
        // application.candidate.name,
        application.job.title,
        application.job.company
      )})

       return res.status(200).json({
            message:"reject application successfully",
            application
        })


        
    }catch(error){
        return res.status(500).json({
            message:"something went wrong",
            error:error.message
        })

    }
}


export const interviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      interviewdate,
      interviewtime,
      mode,
      location,
      onlinemode,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "No id found" });
    }

    if (!interviewdate || !interviewtime || !mode) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const interviewMode = String(mode).toLowerCase();
    const meetingType = String(onlinemode || "").toLowerCase();

    if (interviewMode === "online" && !meetingType) {
      return res.status(400).json({ message: "Online mode required" });
    }

    const application = await JobApplication.findById(id)
      .populate("job")
      .populate({
      path: "candidate",
      populate: { path: "user" },
    });

    if (!application) {
      return res.status(404).json({ message: "No job application found" });
    }

    let interviewLink = null;
    const jobTitle = application.job?.title || "the role";

    // 🔹 ZOOM MEETING
    if (interviewMode === "online" && meetingType === "zoom") {
      const startTime = new Date(
        `${interviewdate}T${interviewtime}:00`
      ).toISOString();

      const zoomData = await createZoomMeeting({
        topic: `Interview - ${jobTitle}`,
        startTime,
        duration: 60,
      });

      interviewLink = zoomData.joinLink;
    }

    

    // 🔹 Save to DB
    application.status = "interview";
    application.interviewdate = interviewdate;
    application.interviewtime = interviewtime;
    application.mode = interviewMode;
    application.onlinemode = meetingType || null;
    application.location = interviewMode === "offline" ? location : "online";
    application.interviewlink = interviewLink;

    await application.save();

    // 🔹 Send email
    await sendEmail({
      to: application.candidate.user.email,
      subject: `Interview Scheduled – ${jobTitle}`,
      html: `
        <h3>Interview Scheduled</h3>
        <p>Date: ${interviewdate}</p>
        <p>Time: ${interviewtime}</p>
        ${
          interviewLink
            ? `<p>Join Link: <a href="${interviewLink}">Join Interview</a></p>`
            : `<p>Location: ${location || "online"}</p>`
        }
      `,
    });

    return res.status(200).json({
      message: "Interview scheduled successfully",
      interviewLink,
    });

  } catch (error) {
    console.error("Interview schedule error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error:error.message
    });
  }
};






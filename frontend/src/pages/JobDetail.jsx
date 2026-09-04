import { applyJob, updatejob, viewjob } from '@/axios/Axios';
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaLocationDot } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdCurrencyRupee } from "react-icons/md";
import Loading from '@/components/Loading';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { AppContext } from '@/Context/AppContext';
import ApplicationCard from '@/components/ApplicationCard';




const JobDetail = () => {
  const{fetchUser,role,setLoading,refreshtoken}=useContext(AppContext);
console.log("role",role);
  const navigate=useNavigate();
  const{id}=useParams();
  console.log("id",id);
   const[applyData,setApplyData]=useState({
    experience:"",
    skills:"",
    id:id,
    resume:null,

  })
  const[data,setData]=useState({
    title:"",
    description:"",
    location:"",
    company:"",
    noOfApplicants:0,
    skills:[],
    salary:"",
    status:"",
  })
  const[jobApplication,setJobApplication]=useState([]);
  const[isOwner,setIsOwner]=useState(false);
  const[submitbutton,setSubmitbutton]=useState(false);
  const[detailLoading,setDetailLoading]=useState(true);
 
  const isHiring = data.status === "Hiring";
  useEffect(()=>{
    fetchUser();
  },[])
  const fetchJobDetail=async(options={})=>{
    const showLoader = options.showLoader !== false;
    try {
     if(showLoader) setDetailLoading(true);
 console.log("JobDetail component rendered");
      const res= await viewjob(id);
      console.log("response of fetching job detail",res);
      if(res.data?.jobApplicationdetail){
        setJobApplication(res.data.jobApplicationdetail);
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      if(res.data.message=="already applied to job"){
        toast.info("You have already applied to this job");
        setSubmitbutton(true);
      }
      const jobStatus = res.data.job.status === "Closed" || res.data.job.status === "closed" ? "Closed" : "Hiring";
     setData(
      {
        status:jobStatus,
        title:res.data.job.title,
    description:res.data.job.description,
    location:res.data.job.location,
    company:res.data.job.company,
    noOfApplicants:res.data.job.noOfApplicants,
    
    skills:res.data.job.skillsRequired,
    salary:res.data.job.salary
}
     ) 
    } catch (error) {
      console.log("error in fetching job detail",error);
      const errorMessage = error.response?.data?.message || "An error occurred while fetching job details";
      
      if(errorMessage === "invalid or expired token" || errorMessage === "invalid or expired token"){
        try {
          await refreshtoken();
          fetchJobDetail(); // Retry after refresh
        } catch (refreshError) {
          toast.error("Session expired. Please login again");
          window.location.href="/login";
          return;
        }
      }
      else if(errorMessage === "user has no token,do login"){
        toast.error("Please login to view job details");
        navigate("/login", { replace: true });
        return;
      }
      else if(errorMessage === "something went wrong in checing  candidate in middleware"){
        navigate("/role", { replace: true });
        return;
      }
      else {
        toast.error(errorMessage);
      }
    }finally{
      if(showLoader) setDetailLoading(false);
    }
  }

  useEffect(()=>{
    fetchJobDetail();
  },[])
 
  const handleChange=(e)=>{
   const{name,value}=e.target;
   setApplyData((prev)=>({
    ...prev,[name]:value
   }))

  }
 
  const handleSubmit=async()=>{
     const formData=new FormData();
  formData.append("experience",applyData.experience),
  formData.append("skills",applyData.skills),
  formData.append("id",applyData.id);
 
  formData.append("resume",applyData.resume);
    try {
      setLoading(true);
      const res=await applyJob(formData);
      console.log('response of applying the job',res);
      setSubmitbutton(true);
      toast.success("applied !!");
      
      
    } catch (error) {
      console.log("error in applying job",error);
      const errorMessage = error.response?.data?.message || "An error occurred while applying for the job";
      toast.error(errorMessage);
    }finally{
      setLoading(false);
    }

  }
  const handleStatusChange=async(e)=>{
    try {
      setData((prev)=>({
        ...prev,status:e.target.value
      }))


      const res=await updatejob(id,e.target.value);
      console.log("response of updating status",res);
      
      
    } catch (error) {
      console.log("error in changing  the status of the job",error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating job status";
      toast.error(errorMessage);
    }
  }
  
  if (detailLoading) {
    return <Loading label={role === "recruiter" ? "Loading job details and applicants" : "Loading job details"} />;
  }

  return (
    <div className=' min-h-screen flex flex-col items-center mx-3 mt-5  gap-5'>
         <div className='flex w-full items-start justify-between gap-3'>
         <div>
         <h1 className='  rammetto-one-regular w-full text-left text-2xl '>{data.title}</h1>
         {data.company ? <p className='mt-1 text-sm text-muted-foreground'>{data.company}</p> : null}
         </div>
         {isOwner && (
           <Button variant="outline" onClick={() => navigate(`/editjob/${id}`)}>Edit listing</Button>
         )}
         </div>
         <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-white/20 bg-white/5 p-4 shadow-sm'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Location</p>
            <p className='mt-2 flex items-center gap-2 text-sm font-medium'><FaLocationDot className='text-primary' />{data.location || "—"}</p>
          </div>
          <div className='rounded-xl border border-white/20 bg-white/5 p-4 shadow-sm'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Salary</p>
            <p className='mt-2 flex items-center gap-1 text-sm font-medium'><MdCurrencyRupee className='text-primary' />{data.salary || "Not listed"}</p>
          </div>
          <div className='rounded-xl border border-white/20 bg-white/5 p-4 shadow-sm'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Applicants</p>
            <p className='mt-2 flex items-center gap-2 text-sm font-medium'><IoPeopleSharp className='text-primary' />{data.noOfApplicants || 0}</p>
          </div>
          <div className={`rounded-xl border p-4 shadow-sm ${isHiring ? "border-green-500/40 bg-green-500/10" : "border-red-500/40 bg-red-500/10"}`}>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block size-2.5 shrink-0 rounded-full ${isHiring ? "bg-green-500" : "bg-red-500"}`} />
              {isOwner ? (
                <select
                  value={data.status || "Hiring"}
                  onChange={handleStatusChange}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm font-semibold text-foreground"
                >
                  <option value="Hiring">Hiring</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                <span className={`text-sm font-semibold ${isHiring ? "text-green-500" : "text-red-500"}`}>
                  {data.status || "Hiring"}
                </span>
              )}
            </div>
          </div>
         </div>
         <h1 className='rammetto-one-regular w-full text-left text-lg '>About the job </h1>
         <p className='w-full text-left'>{data.description}</p>

         <h1 className='  rammetto-one-regular w-full text-left text-lg '>what we are looking for</h1>
          <ul className='w-full items-left px-2'>
            {(data.skills || []).map((curElem,index)=>(
              <li key={index}>{curElem}</li>
            ))}
          </ul>
         
          {
            role=="candidate"?  <Drawer >
      <DrawerTrigger asChild>
        <Button variant="outline"
        disabled={submitbutton || data.status === "Closed"}>{submitbutton?"APPLIED": data.status === "Closed" ? "CLOSED":"APPLY"}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle>{`apply for ${data.title}`}</DrawerTitle>
            <DrawerDescription>Please fill the form Below</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-2 w-full'>
          <Input
           placeholder="Years Of Experience"
           type="text"
            className=" w-full text-sm border-sm "
            name="experience"
            value={applyData.experience}
            onChange={handleChange}

            ></Input>
          <Input 
          type="text"
          placeholder="skills(comma seprated)"
           className="text-sm border-sm w-full"
            name="skills"
            value={applyData.skills}
            onChange={handleChange}>

            </Input>
         <Input placeholder="choose file- no file choosen" 

         className="text-sm"
       type="file"
       accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
       onChange={(e)=>setApplyData(prev=>({
       ...prev,resume:e.target.files[0]}))}
       required></Input>
         </div>
        <div>
          
      <div className="flex items-center space-x-2">
        
       
      </div>
    </div>
          <DrawerFooter>
            <Button onClick={handleSubmit}
           disabled={submitbutton}
            className={submitbutton?"btn-disable":""}>{submitbutton?"APPLIED":"APPLY"}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>:isOwner?<div className="w-full">
      <h2 className="rammetto-one-regular mb-4 text-left text-lg">Applicants</h2>
      {jobApplication.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No applications yet</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {jobApplication.map((application) => (
            <ApplicationCard key={application._id} curElem={application} fetchJobDetail={fetchJobDetail} />
          ))}
        </ul>
      )}
    </div>:""

          }
    </div>
  )
}

export default JobDetail

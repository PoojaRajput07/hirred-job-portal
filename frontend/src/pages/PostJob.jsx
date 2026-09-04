import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useContext, useEffect, useState } from 'react'

import { Textarea } from "@/components/ui/textarea"
import { addJob, updatejob, viewjob } from '@/axios/Axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '@/Context/AppContext'


const PostJob = () => {
  const{loading}=useContext(AppContext);
    const navigate=useNavigate();
    const{id}=useParams();
    const isEdit=Boolean(id);
    const[error,setError]=useState("");
    const[postdata,setPostData]=useState({
        title:"",
        description:"",
        location:"",
        companyName:"",
        skills:"",
        salary:"",

    })
    
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setPostData((prev)=>({
            ...prev,[name]:value

        }))

    }

    useEffect(()=>{
      if(!isEdit) return;
      const loadJob=async()=>{
        try {
          const res=await viewjob(id);
          if(res.data.message==="this job is not posted by you"){
            toast.error("You can only edit jobs you posted");
            navigate("/myjobs");
            return;
          }
          const job=res.data.job;
          setPostData({
            title:job.title||"",
            description:job.description||"",
            location:job.location||"",
            companyName:job.company||"",
            skills:Array.isArray(job.skillsRequired)?job.skillsRequired.join(", "):(job.skillsRequired||""),
            salary:job.salary??"",
          })
        } catch (loadError) {
          const errorMessage = loadError.response?.data?.message || "Unable to load job details";
          if(errorMessage=="user has no token,do login"){
            navigate("/login")
          } else {
            toast.error(errorMessage);
            navigate("/myjobs");
          }
        }
      }
      loadJob();
    },[id,isEdit,navigate])

    const handleSubmit=async()=>{
        try {
            if(isEdit){
              await updatejob(id,postdata);
              toast.success("Job updated");
              navigate(`/jobdetail/${id}`)
              return;
            }
            const res=await addJob(postdata);
            console.log("response of adding job",res);
            toast.success("job added!!");
            navigate("/jobs")
            
        } catch (error) {
            console.log("error in posting a job",error);
            const errorMessage = error.response?.data?.message || (isEdit ? "An error occurred while updating the job" : "An error occurred while posting the job");
            if(errorMessage=="user has no token,do login"){
              navigate("/login")
            }
            else if(errorMessage=="you are not recruiter in middleware"){
              setError("signup with another account as candidate")
            }
            else {
              toast.error(errorMessage);
            }
        }

    }
  return (
    <>
   
    <div className=' min-h-screen  flex flex-col  mx-2'>

        <h1 className='rammetto-one-regular lg:text-xl text-center text-3xl my-8'>{isEdit?"Edit job":"Post A job"}</h1>
        {error? <div className='mx-2 bg-red-600 text-white z-20 text-center my-3 py-3 rounded-sm'><h1>{error}</h1></div>:""}
        <div className='flex flex-col gap-2 '>
            <Input placeholder="Job Title"
            name="title"
            className="w-full"
            type="text"
            onChange={handleChange}
            value={postdata.title}
            required="true"></Input>

            <Input placeholder="Job description"
             name="description"
            className="w-full"
            type="text"
            onChange={handleChange}
            value={postdata.description}
            required="true"></Input>

            <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2'>
                <Select value={postdata.location} 
                onValueChange={(value)=>{setPostData((prev)=>({...prev,location:value}))}}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Job Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Job Location</SelectLabel>
          <SelectItem value="Remote">Remote</SelectItem>
          <SelectItem value="Mumbai">Mumbai</SelectItem>
          <SelectItem value="Gurugram">Gurugram</SelectItem>
          <SelectItem value="Nodia">Nodia</SelectItem>
          <SelectItem value="Pune">Pune</SelectItem>
          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
     <Input placeholder="Company Name"
     name="companyName"
            className="w-full"
            type="text"
            onChange={handleChange}
            value={postdata.companyName}
            required></Input>
        </div>
        <Textarea placeholder="Skills Required" 
        onChange={handleChange}
         name="skills"
          value={postdata.skills}
           required/>


    <Input type="Number"
     name="salary"
      onChange={handleChange}
       value={postdata.salary}
        required 
    placeholder=" Enter monthly salary"></Input>

        <Button variant="secondary" onClick={handleSubmit}>{loading?(isEdit?"saving...":"posting..."):(isEdit?"Save changes":"Submit")}</Button>

        </div>
      
    </div>
    </>
  )
}

export default PostJob

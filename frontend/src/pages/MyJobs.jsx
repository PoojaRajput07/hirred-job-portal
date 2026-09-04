import { fetchmyaddedJobs } from '@/axios/Axios';
import JobCard from '@/components/JobCard';
import { AppContext } from '@/Context/AppContext';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MyJobs = () => {
  const[myjob,setMyJob]=useState([]);
  const{loading,setLoading}=useContext(AppContext);
  const navigate=useNavigate();
  const fetchmyjobs=async()=>{
    
    try {
      setLoading(true);
      const res=await fetchmyaddedJobs();
      console.log("recruiter added jobs response",res);
      setMyJob(res.data.job);
      
    } catch (error) {
      console.log("error in finding recruiter added jobs",error);
      
    }finally{
      setLoading(false);
    }

  }
  useEffect(()=>{
    fetchmyjobs();
  },[])
  return (
    <div className='w-full min-h-screen'>
      <div className='mb-8 flex flex-col gap-2 border-b border-border pb-6'>
        <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Recruiter workspace</p>
        <h1 className='rammetto-one-regular text-2xl'>Your job postings</h1>
        <p className='text-sm text-muted-foreground'>Manage listings, review applicants, and keep hiring moving.</p>
      </div>
     { myjob.length==0?<h1 className='rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground'>No jobs posted yet</h1>:<ul className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
      {myjob.map((curElem)=><div key={curElem._id} className='flex flex-col gap-3'><JobCard  hidesave curElem={curElem}/><div className='flex flex-wrap gap-4 px-1'><button className='text-sm text-primary hover:underline' onClick={()=>navigate(`/jobdetail/${curElem._id}`)}>Review applicants</button><button className='text-sm text-primary hover:underline' onClick={()=>navigate(`/editjob/${curElem._id}`)}>Edit listing</button></div></div>)}
      </ul>}


      
    </div>
  )
}

export default MyJobs

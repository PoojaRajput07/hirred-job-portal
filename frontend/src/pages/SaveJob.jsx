import { fetchSaveJobs } from '@/axios/Axios';
import JobCard from '@/components/JobCard';
import { AppContext } from '@/Context/AppContext';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SaveJob = () => {
  const{loading,setLoading}=useContext(AppContext);
  const[savejob,setSavejob]=useState([]);
  const navigate=useNavigate();
  const SaveJobs=async()=>{
    try {
     setLoading(true);
       const res=await fetchSaveJobs();
       setLoading(false);
       console.log("respnse of fetching saved jobs",res);
       setSavejob(res.data.savedjobs);
    } catch (error) {
      setLoading(false);
  console.log("error i fetching saved jobs", error);
  const message = error?.response?.data?.message;
  if (message?.includes("no token")) {
    navigate("/login");
  }
}
    
  }
  useEffect(()=>{
    SaveJobs();
  },[])
  return (
    
    <div className=' min-h-screen flex flex-col items-center mx-2  '>
      <h1 className='rammetto-one-regular text-lg md:text-2xl my-3'>Saved Jobs</h1>
      <div className='w-full flex flex-wrap gap-2  '>
        {loading?(<></>):savejob.length!=0?(<div className='w-full'>
          <ul className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' >
            {savejob.map((curElem)=><JobCard   showRemove  key={curElem._id} curElem={{...curElem, isSaved: true}} hideSave  onRemove={SaveJobs} />)}
          </ul>



        </div>):<h1 className='text-center w-full  text-2xl '>NO SAVED JOBS</h1>}
        

      </div>
       
      
    </div>
  )
}

export default SaveJob

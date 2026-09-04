import axios from "axios";
const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials :true
})
export const me=(data)=>{
    return api.get("/api/auth/me");
}
export const registerUser=(data)=>{
    return api.post("/api/auth/signup",data);
}
export const doLogin=(data)=>{
    return api.post("/api/auth/login",data);

}
export const madeCandidate=()=>{
    return api.get("/api/candidate/madecandidate");
}
export const madeRecruiter=()=>{
    return api.get("/api/recruiter/makerecruiter");
}
export const fetchJob=()=>{
    return api.get("/api/candidate/seealljobs");

}
export const addWishlist=(id)=>{
    return api.post(`/api/candidate/wishlist/${id}`)
}
export const removeWishlist=(id)=>{
    return api.post(`/api/candidate/removewishlist/${id}`)
}

export const viewjob=(id)=>{
    return api.post(`/api/candidate/viewjob/${id}`)
}
export const applyJob=(data)=>{
    return api.post(`/api/candidate/applyjob`,data, {
        timeout: 60000 // 60 seconds timeout for file uploads (axios will auto-set Content-Type for FormData)
    })

}
export const fetchSaveJobs=()=>{
    return api.get('/api/candidate/savejobs')
}
export const appliedjobs=()=>{
    return api.get('/api/candidate/appliedJobs')
}
export const logout=()=>{
    return api.get("/api/auth/logout")
}

export const addJob=(data)=>{
    return api.post("/api/recruiter/addjob",data)
}
export const fetchmyaddedJobs=()=>{
    return api.get("/api/recruiter/fetchjob");
}
export const postdetail=async(id)=>{
    return api.post(`/api/recruiter/postdetail/${id}`)
}
export const updatejob=(id,data)=>{
    const payload=typeof data==="string"?{status:data}:data;
    return api.put(`/api/recruiter/updateJob/${id}`,payload)
}

export const reject=(id)=>{
    return api.post(`/api/recruiter/reject/${id}`);
}

export const shortlist=(id)=>{
    return api.post(`/api/recruiter/shortlist/${id}`);
}

export const refreshtokencall=()=>{
    return api.post("/api/auth/refreshToken")
}

export const handleInterview=(data,id)=>{
    return api.post(`/api/recruiter/interview/${id}`,data);
}
export const searchFilter=(titleKeyword,companyKeyword,location)=>{
    return api.get(`/api/candidate/seealljobs?title=${titleKeyword}&company=${companyKeyword}&location=${location}`)

}
export const sentMail=(data)=>{
    return api.post("/api/auth/sentMail",{email:data});

}
export const checkOtp=(email,otp)=>{
    return api.post("/api/auth/checkotp",{email,otp});


}
export const addnewPassword=(password,email,otp)=>{
    return api.post("/api/auth/newpassword",{password,email,otp});
}





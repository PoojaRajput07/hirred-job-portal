import {createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import OnBoarding from "./pages/OnBoarding";
import MyJobs from "./pages/MyJobs";
import SaveJob from "./pages/SaveJob";

import { ThemeProvider } from "./components/theme-provider";
// import PostJobs from "./pages/JobDetail";
import { AppContext } from "./Context/AppContext";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Role from "./pages/Role";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import ApplyJob from "./pages/ApplyJob";
import PostJob from "./pages/PostJob";
import InterviewForm from "./components/InterviewForm";
import { useContext, useMemo } from "react";
import Loading from "./components/Loading";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

const App=()=>{
  const{loading}=useContext(AppContext);
   
  const router=useMemo(() => createBrowserRouter([
    {
      element:<AppLayout/>,
      children:[
       {
        path:"/",
        element:<LandingPage/>
       },
       {
        path:"/signup",
        element:<SignupPage/>
       },
        {
        path:"/login",
        element:<LoginPage/>
       },
       {
        path:"/onboarding",
        element:<OnBoarding/>
       },
       {
        path:"/myjobs",
        element:<MyJobs/>
       },
       {
        path:"/savejobs",
        element:<SaveJob/>
       },
      //  {
      //   path:"/pastjobs",
      //   element:<PostJobs/>
      //  },
       {
        path:"/jobs",
        element:<Jobs/>
       }, {
        path:"/role",
        element:<Role/>
       },{
        path:"/jobdetail/:id",
        element:<JobDetail/>
       },
       {
        path:"/interview",
        element:<InterviewForm/>
       },
       {
        path:"/appliedjobs",
        element:<ApplyJob/>
       },
       {
        path:"/postajob",
        element:<PostJob/>
       },
       {
        path:"/editjob/:id",
        element:<PostJob/>
       },{
        path:"/changepassword",
        element:<ChangePassword/>
       },
       {
        path:"*",
        element:<NotFound/>
       }
       
      ]
    }
  ]), [])
  return(
   <>
   {loading?<Loading/>:""}
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
   
    
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

    <RouterProvider router={router}/> 
    
   
    </ThemeProvider>
    </>

  )
}
export default App;
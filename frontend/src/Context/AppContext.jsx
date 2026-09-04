import { fetchJob, me, refreshtokencall } from "@/axios/Axios";
import { useState, createContext, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshtoken = async () => {
    try {
      const res = await refreshtokencall();

      console.log("response of refreshtoken", res);

      return true;
    } catch (error) {
      console.log("error in refreshtoken", error);

      return false;
    }
  };

  const fetchUser = async () => {
    try {
      const res = await me();

      console.log(
        "response of checking user logged in or not",
        res
      );

      console.log(
        "role in context",
        res.data.user.role
      );

      setRole(res.data.user.role);
      setLogin(true);

    } catch (error) {
      console.log("user is not logged in", error);

      try {
        const refreshSuccess = await refreshtoken();

        if (!refreshSuccess) {
          throw new Error("refresh token failed");
        }

        const res = await me();

        console.log(
          "user after refresh token",
          res
        );

        setRole(res.data.user.role);
        setLogin(true);

      } catch (refreshError) {
        console.log(
          "refresh token also failed",
          refreshError
        );

        setLogin(false);
        setRole(null);
      }
    }
  };

  const fetchAllJobs = async () => {
    try {
      const res = await fetchJob();

      console.log(
        "response of fetching all jobs",
        res
      );

      setJobs(res.data.job || []);

    } catch (error) {
      console.log(
        "error in fetching jobs",
        error
      );
    }
  };

  // First load:
  // 1. Check user
  // 2. Fetch jobs for guest as well
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);

      await fetchUser();
      await fetchAllJobs();

      setLoading(false);
    };

    initializeApp();
  }, []);

  // Whenever login state changes,
  // fetch jobs again so saved status becomes fresh.
  useEffect(() => {
    if (login) {
      fetchAllJobs();
    }
  }, [login]);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        refreshtoken,
        fetchAllJobs,
        role,
        setRole,
        login,
        setLogin,
        jobs,
        setJobs,
        fetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
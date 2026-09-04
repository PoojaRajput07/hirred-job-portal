import { appliedjobs } from "@/axios/Axios";
import ApplyJobsCard from "@/components/ApplyJobsCard";
import { AppContext } from "@/Context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyJob = () => {
  const navigate = useNavigate();

  const { loading, setLoading } = useContext(AppContext);

  const [appliedjob, setAppliedjob] = useState([]);

  const fetchappliedjobs = async () => {
    try {
      setLoading(true);

      const res = await appliedjobs();

      console.log("response of applied jobs", res);

      setAppliedjob(res.data.jobApplicationdetail);
    } catch (error) {
      console.log("error in fetching applied jobs", error);

      const message = error?.response?.data?.message;

      if (message?.includes("no token")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchappliedjobs();
  }, []);

  return (
    <div className="w-full min-h-screen">

      {/* Page Header */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Candidate workspace
        </p>

        <h1 className="rammetto-one-regular mt-1 text-2xl">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Track every opportunity from submission to interview.
        </p>
      </div>

      {/* Applications */}
      {appliedjob.length !== 0 ? (
        <ul className="flex w-full flex-col gap-4">
          {appliedjob.map((curElem) => (
            <li key={curElem._id} className="w-full">
              <ApplyJobsCard curElem={curElem} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-border bg-card/40">
          <p className="text-sm text-muted-foreground">
            No applied jobs yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplyJob;
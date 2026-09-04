
import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";

import {
  IoHeart,
  IoHeartOutline,
  IoLocationOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoArrowForwardOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";

import {
  addWishlist,
  removeWishlist,
} from "@/axios/Axios";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";

const JobCard = ({
  curElem,
  onRemove,
  hideSave = false,
  showRemove = false,
  savedjobs = [],
}) => {
  const { role } = useContext(AppContext);

  const {
    title,

    description,
    salary,
    location,
    company,
    _id,
    skillsRequired = [],
    status,
    noOfApplicants = 0,
    createdAt,
  } = curElem;

  const navigate = useNavigate();

  // Check whether current job exists in wishlist
  const isJobSaved = savedjobs.some(
    (savedJob) => String(savedJob._id) === String(_id)
  );

  const [wishlist, setWishlist] = useState(isJobSaved);

  // Sync wishlist when savedjobs API response arrives
  useEffect(() => {
    setWishlist(isJobSaved);
  }, [isJobSaved]);

  // Save / Remove wishlist
  const handleWishlist = async () => {
    const previousState = wishlist;
    const nextState = !wishlist;

    setWishlist(nextState);

    try {
      if (nextState) {
        await addWishlist(_id);
        toast.success("Job saved");
      } else {
        await removeWishlist(_id);
        toast.success("Job removed");
      }
    } catch (error) {
      setWishlist(previousState);

      const message =
        error?.response?.data?.message ||
        "Unable to update saved jobs";

      if (message === "user has no token,do login") {
        navigate("/login");
      } else {
        toast.error(message);
      }
    }
  };
  const handleRemove=async()=>{
    try{
        const res=await removeWishlist(_id);
        console.log("response of removing saved jobs",res);
         toast.success("Job removed from saved jobs");

    // Parent component ko inform karo
    if (onRemove) {
      onRemove(_id);
    }

    }catch(error){
        console.log("error in removing saved jobs",error);

    }
  }

  // Posted time
  const getPostedTime = () => {
    if (!createdAt) return null;

    const created = new Date(createdAt);
    const now = new Date();

    const diffInHours = Math.floor(
      (now - created) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    return `${diffInMonths}mo ago`;
  };

  return (
    <Card
      className="
        group relative flex h-full flex-col
        overflow-hidden
        rounded-2xl
        border border-gray-700/60
        bg-none
        p-5
        text-sm
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-600
        hover:shadow-xl
      "
    >
      {/* Top hover accent */}
      <div
        className="
          absolute left-0 right-0 top-0 h-[2px]
          bg-gray-500/40
          opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Job Position
          </p>

          <h2 className="line-clamp-2 text-lg font-bold leading-6 text-white">
            {title}
          </h2>

          <p className="mt-1.5 truncate text-sm font-medium text-gray-300">
            {company || "Company"}
          </p>
        </div>

        {/* ================= SAVE / REMOVE ================= */}

        {/* Saved Jobs page */}
        {role !== "recruiter" && showRemove && (
          <button
            type="button"
            aria-label="Remove from saved jobs"
            onClick={handleRemove}
            className="
              flex shrink-0 items-center gap-1.5
              rounded-lg
              border border-red-500/30
              px-3 py-2
              text-xs font-medium
              text-red-400
              transition-all duration-200
              hover:border-red-500/50
              hover:bg-red-500/10
              active:scale-95
            "
          >
            <IoTrashOutline className="text-base" />
            Remove
          </button>
        )}

        {/* Other pages - Save button */}
        {role !== "recruiter" &&
          !hideSave &&
          !showRemove && (
            <button
              type="button"
              aria-label={
                wishlist
                  ? "Remove from saved jobs"
                  : "Save job"
              }
              onClick={handleWishlist}
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                border border-gray-700/70
                transition-all duration-200
                hover:scale-105
                hover:bg-gray-800
                active:scale-95
              "
            >
              {wishlist ? (
                <IoHeart className="text-xl text-red-500" />
              ) : (
                <IoHeartOutline className="text-xl text-gray-300" />
              )}
            </button>
          )}
      </div>

      {/* ================= STATUS ================= */}
      <div className="mt-4 flex items-center justify-between">
        {status && (
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              Status
            </p>

            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                border border-gray-700/60
                px-3 py-1
                text-xs
                text-gray-300
              "
            >
              <span
                className={`
                  h-1.5 w-1.5 rounded-full
                  ${
                    status.toLowerCase() === "hiring"
                      ? "bg-green-400"
                      : "bg-gray-500"
                  }
                `}
              />

              {status}
            </span>
          </div>
        )}

        {getPostedTime() && (
          <div className="text-right">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              Posted
            </p>

            <span className="flex items-center gap-1 text-xs text-gray-400">
              <IoTimeOutline />
              {getPostedTime()}
            </span>
          </div>
        )}
      </div>

      {/* ================= JOB DETAILS ================= */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Location */}
        {location && (
          <div
            className="
              rounded-xl
              border border-gray-700/50
              p-3
            "
          >
            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              Location
            </p>

            <div className="flex items-center gap-1.5 text-sm text-gray-300">
              <IoLocationOutline className="text-base text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        )}

        {/* Salary */}
        {salary && (
          <div
            className="
              rounded-xl
              border border-gray-700/50
              p-3
            "
          >
            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              Salary / Month
            </p>

            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
              <IoCashOutline className="text-base text-gray-400" />

              <span>
                ₹{Number(salary).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================= APPLICANTS ================= */}
      <div
        className="
          mt-3 flex items-center
          rounded-xl
          border border-gray-700/50
          px-3 py-2.5
        "
      >
        <div className="flex items-center gap-2">
          <IoPeopleOutline className="text-lg text-gray-400" />

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Applicants
            </p>

            <p className="text-xs text-gray-300">
              {noOfApplicants}{" "}
              {noOfApplicants === 1
                ? "Applicant"
                : "Applicants"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mt-4">
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">
          Job Description
        </p>

        <p
          className="
            line-clamp-3
            text-sm
            leading-6
            text-gray-300
          "
        >
          {description}
        </p>
      </div>

      {/* ================= SKILLS ================= */}
      {skillsRequired.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500">
            Skills Required
          </p>

          <div className="flex flex-wrap gap-2">
            {skillsRequired.slice(0, 4).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="
                  rounded-md
                  border border-gray-700/60
                  px-2.5 py-1
                  text-xs
                  text-gray-400
                "
              >
                {skill}
              </span>
            ))}

            {skillsRequired.length > 4 && (
              <span
                className="
                  rounded-md
                  border border-gray-700/60
                  px-2.5 py-1
                  text-xs
                  text-gray-500
                "
              >
                +{skillsRequired.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div className="mt-auto pt-5">
        <div className="mb-4 h-px w-full bg-gray-700/50" />

        <Button
          variant="secondary"
          className="
            w-full
            rounded-xl
            font-semibold
            transition-all duration-200
            hover:shadow-md
          "
          onClick={() => navigate(`/jobdetail/${_id}`)}
        >
          View details

          <IoArrowForwardOutline
            className="
              ml-2
              text-lg
              transition-transform duration-200
              group-hover:translate-x-1
            "
          />
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;


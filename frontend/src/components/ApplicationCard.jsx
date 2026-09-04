import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { handleInterview, reject, shortlist } from "@/axios/Axios";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "./ui/input";
import { toast } from "react-toastify";

import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaFileAlt,
  FaUser,
  FaCheckCircle,
  FaVideo,
} from "react-icons/fa";

import { FaLocationDot } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";

const ApplicationCard = ({ curElem, fetchJobDetail }) => {

  // =========================================================
  // STATES
  // =========================================================

  const [loadingAction, setLoadingAction] = useState(null);

  // Drawer open/close
  const [open, setOpen] = useState(false);

  // Application status
  const [state, setState] = useState(
    curElem?.status || "applied"
  );

  // Interview form
  // IMPORTANT:
  // interviewlink is NOT required here.
  // Backend will generate Zoom link.
  const [interviewData, setInterviewData] = useState({
    interviewdate: "",
    interviewtime: "",
    mode: "",
    location: "",
    onlinemode: "",
  });

  // Interview details displayed on recruiter card
  const [scheduledInterview, setScheduledInterview] =
    useState(null);

  // =========================================================
  // APPLICATION DATA
  // =========================================================

  const {
    experience,
    resume,
    skills,
    createdAt,
    _id,
    status,
  } = curElem || {};

  // =========================================================
  // SYNC STATUS
  // =========================================================

  useEffect(() => {
    setState(status || "applied");
  }, [status]);

  // =========================================================
  // SYNC INTERVIEW DATA FROM BACKEND
  // =========================================================

  useEffect(() => {
    if (!curElem) return;

    const hasInterview =
      curElem.status === "interview" ||
      curElem.interviewdate ||
      curElem.interviewtime ||
      curElem.mode ||
      curElem.interviewlink ||
      curElem.location;

    if (hasInterview) {
      setScheduledInterview({
        interviewdate: curElem.interviewdate || "",
        interviewtime: curElem.interviewtime || "",
        mode: curElem.mode || "",
        location: curElem.location || "",
        onlinemode: curElem.onlinemode || "",
        interviewlink: curElem.interviewlink || "",
      });
    }
  }, [
    curElem,
    curElem?.interviewdate,
    curElem?.interviewtime,
    curElem?.mode,
    curElem?.location,
    curElem?.onlinemode,
    curElem?.interviewlink,
  ]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInterviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // REJECT APPLICATION
  // =========================================================

  const handleReject = async () => {
    try {
      setLoadingAction("reject");

      const res = await reject(_id);

      console.log(
        "response of rejecting application",
        res
      );

      setState("rejected");

      if (fetchJobDetail) {
        await fetchJobDetail({
          showLoader: false,
        });
      }

      toast.success("Application rejected");

    } catch (error) {

      console.log(
        "FULL ERROR 👉",
        error.response?.data || error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Failed to reject application";

      toast.error(errorMessage);

    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // SHORTLIST APPLICATION
  // =========================================================

  const handleShorlist = async () => {
    try {
      setLoadingAction("shortlist");

      const res = await shortlist(_id);

      console.log(
        "response of shortlisting candidate",
        res
      );

      // Backend uses "shortlisted"
      setState("shortlisted");

      if (fetchJobDetail) {
        await fetchJobDetail({
          showLoader: false,
        });
      }

      toast.success(
        "Application shortlisted and email sent to candidate"
      );

    } catch (error) {

      console.error(
        "Error occurred while shortlisting candidate",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Failed to shortlist candidate";

      toast.error(errorMessage);

    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // SCHEDULE INTERVIEW
  // =========================================================

  const handleSchedule = async () => {

    // -------------------------------------------------------
    // DATE VALIDATION
    // -------------------------------------------------------

    if (!interviewData.interviewdate) {
      toast.error("Please select interview date");
      return;
    }

    // -------------------------------------------------------
    // TIME VALIDATION
    // -------------------------------------------------------

    if (!interviewData.interviewtime) {
      toast.error("Please select interview time");
      return;
    }

    // -------------------------------------------------------
    // MODE VALIDATION
    // -------------------------------------------------------

    if (!interviewData.mode) {
      toast.error("Please select interview mode");
      return;
    }

    // -------------------------------------------------------
    // OFFLINE VALIDATION
    // -------------------------------------------------------

    if (
      interviewData.mode === "offline" &&
      !interviewData.location.trim()
    ) {
      toast.error("Please enter interview location");
      return;
    }

    // -------------------------------------------------------
    // ONLINE VALIDATION
    // -------------------------------------------------------

    if (
      interviewData.mode === "online" &&
      !interviewData.onlinemode
    ) {
      toast.error("Please select online meeting platform");
      return;
    }

    try {

      setLoadingAction("schedule");

      // =====================================================
      // SEND ONLY FORM DATA
      // Backend will generate Zoom link.
      // =====================================================

      const res = await handleInterview(
        interviewData,
        _id
      );

      console.log(
        "response of scheduling interview",
        res
      );

      // =====================================================
      // GET GENERATED ZOOM LINK FROM BACKEND
      // =====================================================

      const generatedInterviewLink =
        res?.data?.interviewLink ||
        res?.interviewLink ||
        "";

      // =====================================================
      // UPDATE RECRUITER UI IMMEDIATELY
      // =====================================================

      setScheduledInterview({
        interviewdate:
          interviewData.interviewdate,

        interviewtime:
          interviewData.interviewtime,

        mode:
          interviewData.mode,

        location:
          interviewData.mode === "offline"
            ? interviewData.location
            : "online",

        onlinemode:
          interviewData.mode === "online"
            ? interviewData.onlinemode
            : "",

        interviewlink:
          generatedInterviewLink,
      });

      // =====================================================
      // UPDATE APPLICATION STATUS
      // =====================================================

      setState("interview");

      // =====================================================
      // REFRESH DATA FROM BACKEND
      // =====================================================

      if (fetchJobDetail) {
        await fetchJobDetail({
          showLoader: false,
        });
      }

      // =====================================================
      // CLOSE DRAWER
      // =====================================================

      setOpen(false);

      // =====================================================
      // RESET FORM
      // =====================================================

      setInterviewData({
        interviewdate: "",
        interviewtime: "",
        mode: "",
        location: "",
        onlinemode: "",
      });

      toast.success(
        "Interview scheduled successfully!"
      );

    } catch (error) {

      console.log(
        "error in scheduling interview",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Failed to schedule interview";

      toast.error(errorMessage);

    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // INTERVIEW DETAILS
  // =========================================================

  const interview = scheduledInterview;

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyles = () => {

    if (state === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (state === "interview") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }

    if (state === "shortlisted") {
      return "bg-green-500/10 text-green-400 border-green-500/30";
    }

    return "bg-white/5 text-gray-300 border-white/10";
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatInterviewDate = (date) => {

    if (!date) {
      return "Not available";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {

      return date;
    }
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatInterviewTime = (time) => {

    if (!time) {
      return "Not available";
    }

    try {

      const [hours, minutes] =
        time.split(":");

      const date = new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

    } catch {

      return time;
    }
  };

  // =========================================================
  // PLATFORM NAME
  // =========================================================

  const getPlatformName = (platform) => {

    if (platform === "zoom") {
      return "Zoom";
    }

    return "Online";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        group
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#010410]
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/30
        hover:shadow-blue-500/10
      "
    >

      {/* =====================================================
          TOP BLUE LINE
      ===================================================== */}

      <div className="h-1.5 w-full bg-blue-500" />

      <div className="p-5 sm:p-6">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >

          {/* CANDIDATE */}

          <div className="flex min-w-0 items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-900
                text-xl
                text-white
                shadow-lg
                shadow-blue-500/20
              "
            >
              <FaUser />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2
                  className="
                    text-lg
                    font-bold
                    text-white
                    sm:text-xl
                  "
                >
                  Candidate Application
                </h2>

                {/* STATUS */}

                <span
                  className={`
                    rounded-full
                    border
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    capitalize
                    ${getStatusStyles()}
                  `}
                >
                  {state || "Pending"}
                </span>

              </div>

              {/* APPLIED DATE */}

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-400
                "
              >
                <FaCalendarAlt size={12} />

                <span>
                  Applied{" "}
                  {createdAt
                    ? new Date(
                        createdAt
                      ).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>

            </div>

          </div>

          {/* APPLICATION ID */}

          <div
            className="
              rounded-lg
              border
              border-white/10
              bg-white/5
              px-3
              py-2
              text-xs
              text-gray-400
            "
          >
            ID: {_id ? _id.slice(-8) : "N/A"}
          </div>

        </div>

        {/* ===================================================
            CANDIDATE INFORMATION
        =================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >

          {/* EXPERIENCE */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-[#061f3a]
              p-4
              transition
              hover:border-blue-500/30
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-500
                text-white
              "
            >
              <MdWorkOutline size={20} />
            </div>

            <div>

              <p className="text-xs font-medium text-gray-400">
                Experience
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                {experience || "Not specified"} year(s)
              </p>

            </div>

          </div>

          {/* APPLICATION */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-[#061f3a]
              p-4
              transition
              hover:border-blue-500/30
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-500
                text-white
              "
            >
              <IoPeopleSharp size={19} />
            </div>

            <div>

              <p className="text-xs font-medium text-gray-400">
                Application
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                Job Candidate
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            SKILLS
        =================================================== */}

        <div className="mt-6">

          <div className="mb-3 flex items-center gap-2">

            <FaBriefcase
              className="text-blue-400"
              size={14}
            />

            <h3 className="text-sm font-semibold text-white">
              Skills
            </h3>

          </div>

          {skills && skills.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {skills.map((skill, index) => (

                <span
                  key={index}
                  className="
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-blue-300
                    transition
                    hover:border-blue-400/40
                    hover:bg-blue-500/20
                  "
                >
                  {skill}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-sm text-gray-500">
              No skills provided.
            </p>

          )}

        </div>

        {/* ===================================================
            INTERVIEW SCHEDULED
        =================================================== */}

        {state === "interview" && interview && (

          <div
            className="
              mt-6
              overflow-hidden
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/5
            "
          >

            {/* INTERVIEW HEADER */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-blue-500/20
                bg-blue-500/10
                px-4
                py-3
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-500
                  text-white
                "
              >
                <FaCheckCircle size={15} />
              </div>

              <div>

                <h3 className="text-sm font-bold text-blue-300">
                  Interview Scheduled
                </h3>

                <p className="text-xs text-blue-400">
                  Interview details are available below
                </p>

              </div>

            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-4
                p-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {/* DATE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-3
                "
              >

                <FaCalendarAlt
                  className="text-blue-400"
                  size={15}
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Interview Date
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {formatInterviewDate(
                      interview.interviewdate
                    )}
                  </p>

                </div>

              </div>

              {/* TIME */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-3
                "
              >

                <FaClock
                  className="text-blue-400"
                  size={15}
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Interview Time
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {formatInterviewTime(
                      interview.interviewtime
                    )}
                  </p>

                </div>

              </div>

              {/* MODE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-3
                "
              >

                {interview.mode === "offline" ? (

                  <FaLocationDot
                    className="text-blue-400"
                    size={16}
                  />

                ) : (

                  <FaVideo
                    className="text-blue-400"
                    size={15}
                  />

                )}

                <div>

                  <p className="text-xs text-gray-500">
                    Interview Mode
                  </p>

                  <p className="mt-0.5 text-sm font-semibold capitalize text-white">
                    {interview.mode || "Not available"}
                  </p>

                </div>

              </div>

              {/* PLATFORM / LOCATION */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-3
                "
              >

                {interview.mode === "offline" ? (

                  <FaLocationDot
                    className="text-blue-400"
                    size={16}
                  />

                ) : (

                  <FaVideo
                    className="text-blue-400"
                    size={15}
                  />

                )}

                <div className="min-w-0">

                  <p className="text-xs text-gray-500">
                    {interview.mode === "offline"
                      ? "Location"
                      : "Platform"}
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold capitalize text-white">

                    {interview.mode === "offline"
                      ? interview.location ||
                        "Not available"
                      : getPlatformName(
                          interview.onlinemode
                        )}

                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                ONLINE INTERVIEW
            ================================================= */}

            {interview.mode === "online" && (

              <div
                className="
                  border-t
                  border-blue-500/20
                  p-4
                "
              >

                {interview.interviewlink ? (

                  <a
                    href={interview.interviewlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-blue-500
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-600
                    "
                  >

                    <FaVideo size={14} />

                    Join Zoom Interview

                  </a>

                ) : (

                  <div
                    className="
                      rounded-lg
                      border
                      border-yellow-500/20
                      bg-yellow-500/5
                      px-4
                      py-3
                      text-center
                      text-sm
                      text-yellow-300
                    "
                  >
                    Zoom meeting link is not available.
                  </div>

                )}

              </div>

            )}

            {/* =================================================
                OFFLINE INTERVIEW
            ================================================= */}

            {interview.mode === "offline" && (

              <div
                className="
                  border-t
                  border-blue-500/20
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-lg
                    border
                    border-blue-500/20
                    bg-blue-500/5
                    p-4
                  "
                >

                  <FaLocationDot
                    className="mt-0.5 shrink-0 text-blue-400"
                    size={16}
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      Interview Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {interview.location ||
                        "Location not available"}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>

        )}

        {/* ===================================================
            RESUME
        =================================================== */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            p-4
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-600
                  text-white
                "
              >
                <FaFileAlt />
              </div>

              <div>

                <h3 className="text-sm font-bold text-white">
                  Candidate Resume
                </h3>

                <p className="text-xs text-gray-400">
                  Review the candidate's submitted resume
                </p>

              </div>

            </div>

            <a
              href={`${
                import.meta.env.VITE_API_URL ||
                "http://localhost:5000"
              }/${String(resume || "").replace(
                /\\/g,
                "/"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-green-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-green-700
              "
            >

              <FaDownload size={13} />

              View Resume

            </a>

          </div>

        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div
          className="
            mt-6
            border-t
            border-white/10
            pt-5
          "
        >

          <p
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-gray-500
            "
          >
            Application Actions
          </p>

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            {/* =================================================
                REJECT
            ================================================= */}

            <Button
              variant="destructive"
              disabled={
                loadingAction !== null ||
                state === "rejected" ||
                state === "interview" ||
                state === "shortlisted"
              }
              onClick={handleReject}
              className="
                h-11
                w-full
                font-semibold
              "
            >

              {loadingAction === "reject" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : state === "rejected" ? (
                "REJECTED"
              ) : (
                "REJECT"
              )}

            </Button>

            {/* =================================================
                SCHEDULE INTERVIEW
            ================================================= */}

            <Drawer
              open={open}
              onOpenChange={setOpen}
            >

              <DrawerTrigger asChild>

                <Button
                  disabled={
                    loadingAction !== null ||
                    state === "interview" ||
                    state === "rejected"
                  }
                  className="
                    h-11
                    w-full
                    border
                    border-blue-500/30
                    bg-blue-500/10
                    font-semibold
                    text-blue-300
                    hover:bg-blue-500/20
                    hover:text-blue-200
                  "
                >

                  <FaCalendarAlt className="mr-2" />

                  Schedule Interview

                </Button>

              </DrawerTrigger>

              <DrawerContent
                className="
                  border-white/10
                  bg-[#01172f]
                  text-white
                "
              >

                <div className="mx-auto w-full max-w-2xl">

                  {/* DRAWER HEADER */}

                  <DrawerHeader
                    className="
                      border-b
                      border-white/10
                      text-left
                    "
                  >

                    <DrawerTitle
                      className="
                        flex
                        items-center
                        gap-2
                        text-xl
                        text-white
                      "
                    >

                      <FaCalendarAlt className="text-blue-400" />

                      Schedule Interview

                    </DrawerTitle>

                    <DrawerDescription className="text-gray-400">
                      Schedule an interview with this
                      candidate by providing the required
                      details.
                    </DrawerDescription>

                  </DrawerHeader>

                  {/* =================================================
                      FORM
                  ================================================= */}

                  <div
                    className="
                      max-h-[65vh]
                      space-y-5
                      overflow-y-auto
                      px-4
                      py-5
                      sm:px-6
                    "
                  >

                    {/* DATE */}

                    <div className="space-y-2">

                      <label
                        htmlFor="interviewdate"
                        className="
                          text-sm
                          font-semibold
                          text-gray-200
                        "
                      >
                        Interview Date
                      </label>

                      <input
                        id="interviewdate"
                        type="date"
                        name="interviewdate"
                        value={
                          interviewData.interviewdate
                        }
                        onChange={handleChange}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        className="
                          h-11
                          w-full
                          cursor-pointer
                          rounded-md
                          border
                          border-white/10
                          bg-white/5
                          px-3
                          text-white
                          outline-none
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500
                        "
                      />

                    </div>

                    {/* TIME */}

                    <div className="space-y-2">

                      <label
                        htmlFor="interviewtime"
                        className="
                          text-sm
                          font-semibold
                          text-gray-200
                        "
                      >
                        Interview Time
                      </label>

                      <input
                        id="interviewtime"
                        type="time"
                        name="interviewtime"
                        value={
                          interviewData.interviewtime
                        }
                        onChange={handleChange}
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        className="
                          h-11
                          w-full
                          cursor-pointer
                          rounded-md
                          border
                          border-white/10
                          bg-white/5
                          px-3
                          text-white
                          outline-none
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500
                        "
                      />

                    </div>

                    {/* MODE */}

                    <div className="space-y-2">

                      <label
                        className="
                          text-sm
                          font-semibold
                          text-gray-200
                        "
                      >
                        Interview Mode
                      </label>

                      <Select
                        value={interviewData.mode}
                        onValueChange={(value) =>
                          setInterviewData((prev) => ({
                            ...prev,
                            mode: value,
                            location: "",
                            onlinemode: "",
                          }))
                        }
                      >

                        <SelectTrigger
                          className="
                            h-11
                            w-full
                            border-white/10
                            bg-white/5
                            text-white
                          "
                        >
                          <SelectValue
                            placeholder="Select interview mode"
                          />
                        </SelectTrigger>

                        <SelectContent
                          className="
                            border-white/10
                            bg-[#061f3a]
                            text-white
                          "
                        >

                          <SelectGroup>

                            <SelectLabel className="text-gray-400">
                              Interview Mode
                            </SelectLabel>

                            <SelectItem
                              value="online"
                              className="
                                focus:bg-blue-500/20
                                focus:text-white
                              "
                            >
                              Online
                            </SelectItem>

                            <SelectItem
                              value="offline"
                              className="
                                focus:bg-blue-500/20
                                focus:text-white
                              "
                            >
                              Offline
                            </SelectItem>

                          </SelectGroup>

                        </SelectContent>

                      </Select>

                    </div>

                    {/* =================================================
                        ONLINE
                    ================================================= */}

                    {interviewData.mode === "online" && (

                      <div className="space-y-2">

                        <label
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-gray-200
                          "
                        >

                          <FaVideo className="text-blue-400" />

                          Online Meeting Platform

                        </label>

                        <Select
                          value={
                            interviewData.onlinemode
                          }
                          onValueChange={(value) =>
                            setInterviewData(
                              (prev) => ({
                                ...prev,
                                onlinemode: value,
                              })
                            )
                          }
                        >

                          <SelectTrigger
                            className="
                              h-11
                              w-full
                              border-white/10
                              bg-white/5
                              text-white
                            "
                          >

                            <SelectValue
                              placeholder="Select meeting platform"
                            />

                          </SelectTrigger>

                          <SelectContent
                            className="
                              border-white/10
                              bg-[#061f3a]
                              text-white
                            "
                          >

                            <SelectGroup>

                              <SelectLabel className="text-gray-400">
                                Meeting Platform
                              </SelectLabel>

                              {/* ONLY ZOOM */}

                              <SelectItem
                                value="zoom"
                                className="
                                  focus:bg-blue-500/20
                                  focus:text-white
                                "
                              >
                                Zoom Meeting
                              </SelectItem>

                            </SelectGroup>

                          </SelectContent>

                        </Select>

                        <p className="text-xs text-gray-500">
                          A Zoom meeting link will be
                          generated automatically.
                        </p>

                      </div>

                    )}

                    {/* =================================================
                        OFFLINE LOCATION
                    ================================================= */}

                    {interviewData.mode === "offline" && (

                      <div className="space-y-2">

                        <label
                          htmlFor="location"
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-gray-200
                          "
                        >

                          <FaLocationDot className="text-blue-400" />

                          Interview Location

                        </label>

                        <Input
                          id="location"
                          type="text"
                          placeholder="Enter interview location"
                          name="location"
                          value={
                            interviewData.location
                          }
                          onChange={handleChange}
                          className="
                            h-11
                            border-white/10
                            bg-white/5
                            text-white
                            placeholder:text-gray-500
                          "
                        />

                      </div>

                    )}

                    {/* INFO BOX */}

                    <div
                      className="
                        rounded-xl
                        border
                        border-blue-500/20
                        bg-blue-500/5
                        p-4
                      "
                    >

                      <div className="flex items-start gap-3">

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-500
                            text-white
                          "
                        >
                          <FaCalendarAlt size={13} />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-blue-300">
                            Interview Schedule
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-400">

                            {interviewData.mode ===
                            "online"
                              ? "A Zoom meeting will be created automatically after scheduling."
                              : interviewData.mode ===
                                "offline"
                              ? "The candidate will receive the interview date, time and location."
                              : "Select the interview date, time and mode before scheduling."}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <DrawerFooter
                    className="
                      border-t
                      border-white/10
                      px-4
                      py-4
                      sm:px-6
                    "
                  >

                    <Button
                      onClick={handleSchedule}
                      disabled={
                        loadingAction === "schedule"
                      }
                      className="
                        h-11
                        w-full
                        bg-blue-500
                        font-semibold
                        text-white
                        hover:bg-blue-600
                      "
                    >

                      {loadingAction === "schedule" ? (

                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scheduling...
                        </>

                      ) : (

                        <>
                          <FaCalendarAlt className="mr-2" />
                          Schedule Interview
                        </>

                      )}

                    </Button>

                    <DrawerClose asChild>

                      <Button
                        variant="outline"
                        disabled={
                          loadingAction === "schedule"
                        }
                        className="
                          h-11
                          w-full
                          border-white/10
                          bg-white/5
                          text-gray-300
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        Cancel
                      </Button>

                    </DrawerClose>

                  </DrawerFooter>

                </div>

              </DrawerContent>

            </Drawer>

            {/* =================================================
                SHORTLIST
            ================================================= */}

            <Button
              variant="outline"
              disabled={
                loadingAction !== null ||
                state === "rejected" ||
                state === "shortlisted" ||
                state === "interview"
              }
              className="
                h-11
                w-full
                border-green-500/30
                bg-green-500/5
                font-semibold
                text-green-400
                hover:bg-green-500/10
                hover:text-green-300
              "
              onClick={handleShorlist}
            >

              {loadingAction === "shortlist" ? (

                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Shortlisting...
                </>

              ) : state === "shortlisted" ? (

                "SHORTLISTED"

              ) : (

                <>
                  <FaCheckCircle className="mr-2" />
                  SHORTLIST
                </>

              )}

            </Button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ApplicationCard;
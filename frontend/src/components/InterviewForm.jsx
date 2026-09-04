import React, { useState } from "react";
import { Button } from "./ui/button";

const InterviewForm = ({
  curElem,
  setOpen,
  handleInterviewSubmit,
}) => {
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    setInterviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Interview data:", interviewData);

    if (!interviewData.date) {
      alert("Please select interview date");
      return;
    }

    if (!interviewData.time) {
      alert("Please select interview time");
      return;
    }

    if (!interviewData.link.trim()) {
      alert("Please enter meeting link / location");
      return;
    }

    handleInterviewSubmit(interviewData);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-zinc-900 p-6 text-white">

        <h2 className="text-lg font-semibold">
          Schedule Interview for{" "}
          {curElem?.job?.title || "Job"}
        </h2>

        {/* DATE */}
        <div className="space-y-2">
          <label
            htmlFor="interview-date"
            className="text-sm text-gray-300"
          >
            Interview Date
          </label>

          <input
            id="interview-date"
            type="date"
            name="date"
            value={interviewData.date}
            onChange={handleChange}
            className="
              h-11
              w-full
              cursor-pointer
              rounded-md
              border
              border-white/10
              bg-zinc-800
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
            htmlFor="interview-time"
            className="text-sm text-gray-300"
          >
            Interview Time
          </label>

          <input
            id="interview-time"
            type="time"
            name="time"
            value={interviewData.time}
            onChange={handleChange}
            className="
              h-11
              w-full
              cursor-pointer
              rounded-md
              border
              border-white/10
              bg-zinc-800
              px-3
              text-white
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* LINK / LOCATION */}
        <div className="space-y-2">
          <label
            htmlFor="interview-link"
            className="text-sm text-gray-300"
          >
            Meeting Link / Location
          </label>

          <input
            id="interview-link"
            type="text"
            name="link"
            value={interviewData.link}
            placeholder="Meeting link / Location"
            onChange={handleChange}
            className="
              block
              w-full
              rounded
              border
              border-zinc-700
              bg-zinc-800
              p-2
              text-white
              outline-none
              placeholder:text-gray-500
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
          >
            Schedule
          </Button>
        </div>

      </div>
    </div>
  );
};

export default InterviewForm;
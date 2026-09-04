import React from "react";

const statusStyles = {
  applied: "bg-green-500/10 text-green-400 border-green-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  shortlisted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  interview: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  interview_scheduled:
    "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const ApplyJobsCard = ({ curElem }) => {
  const {
    skills,
    createdAt,
    status = "applied",
    job = {},
    interviewdate,
    interviewtime,
    interviewlink,
    mode,
    location,
  } = curElem;

  const skillList = Array.isArray(skills)
    ? skills
    : String(skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  const formattedStatus = String(status)
    .replaceAll("_", " ")
    .toUpperCase();

  const formattedAppliedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const formattedInterviewDate = interviewdate
    ? new Date(interviewdate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="group w-full overflow-hidden rounded-2xl border border-border bg-card/80 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">

      {/* Main Content */}
      <div className="p-5 sm:p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest opacity-45">
              Applied Job
            </p>

            <h2 className="text-xl font-bold tracking-tight">
              {job.title || "Job"}
            </h2>

            {job.company && (
              <p className="mt-1 text-sm opacity-60">
                {job.company}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${
              statusStyles[status] ||
              "border-gray-500/30 bg-gray-500/10 text-gray-400"
            }`}
          >
            {formattedStatus}
          </span>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-border/60" />

        {/* Description */}
        <div>
          <p className="mb-1.5 text-sm font-semibold">
            Job Description
          </p>

          <p className="line-clamp-2 text-sm leading-6 opacity-65">
            {job.description || "No description available."}
          </p>
        </div>

        {/* Job Details - NO COLUMNS */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="opacity-70">
            <span className="font-semibold opacity-100">
              Location:
            </span>{" "}
            {job.location || "Not specified"}
          </span>

          <span className="opacity-70">
            <span className="font-semibold opacity-100">
              Salary:
            </span>{" "}
            {job.salary
              ? `₹${Number(job.salary).toLocaleString("en-IN")}`
              : "Not specified"}
          </span>

          <span className="opacity-70">
            <span className="font-semibold opacity-100">
              Applied:
            </span>{" "}
            {formattedAppliedDate}
          </span>
        </div>

        {/* Skills - NO COLUMN */}
        {skillList.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold">
              Required Skills:
            </span>

            {skillList.map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium opacity-75 transition hover:border-primary/40 hover:opacity-100"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interview Section */}
      {status === "interview" && (
        <div className="border-t border-blue-500/20 bg-blue-500/5 px-5 py-5 sm:px-6">

          {/* Interview Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                ✓
              </div>

              <div>
                <h3 className="font-bold">
                  Interview Scheduled
                </h3>

                <p className="text-xs opacity-60">
                  Your interview has been scheduled successfully
                </p>
              </div>
            </div>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              {mode === "online" ? "Online" : "Offline"}
            </span>
          </div>

          {/* Interview Details - INLINE */}
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">

            <div>
              <span className="text-xs opacity-50">
                Date
              </span>

              <p className="text-sm font-semibold">
                {formattedInterviewDate}
              </p>
            </div>

            <div>
              <span className="text-xs opacity-50">
                Time
              </span>

              <p className="text-sm font-semibold">
                {interviewtime || "Not available"}
              </p>
            </div>

            <div>
              <span className="text-xs opacity-50">
                Mode
              </span>

              <p className="text-sm font-semibold capitalize">
                {mode || "Not available"}
              </p>
            </div>

            {mode === "offline" && (
              <div>
                <span className="text-xs opacity-50">
                  Location
                </span>

                <p className="text-sm font-semibold">
                  {location || "Will be shared via email"}
                </p>
              </div>
            )}

            {/* Join Interview */}
            {mode === "online" && interviewlink && (
              <a
                href={interviewlink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Join Interview
                <span className="ml-2">↗</span>
              </a>
            )}
          </div>

          {/* Email Notice */}
          <div className="mt-5 border-t border-border/40 pt-4 text-xs opacity-55">
            Please check your email for complete interview details
            and instructions.
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyJobsCard;
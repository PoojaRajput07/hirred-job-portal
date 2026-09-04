import React, { useContext, useState } from "react";
import { Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  addnewPassword,
  checkOtp,
  sentMail,
} from "@/axios/Axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AppContext } from "@/Context/AppContext";
import Loading from "@/components/Loading";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ChangePassword = () => {
  const { loading, setLoading } = useContext(AppContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [checkedOtp, setCheckedOtp] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // -----------------------------
  // Send OTP
  // -----------------------------
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      console.log("email", email);

      const res = await sentMail(email);

      console.log("response of sending email", res);

      setSent(true);

      toast.success("OTP sent to your email");
    } catch (error) {
      if(error.response.data.message=="no user found"){
        toast.error("Please sign up first to create an account.")
        return;
      }
      console.log("error in sending email", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to send OTP. Please check your email and try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify OTP
  // -----------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await checkOtp(email, otp);

      console.log("response of checking OTP", res);

      setCheckedOtp(true);

      toast.success("OTP verified successfully");
    } catch (error) {
      console.log("error in checking OTP", error);
      if( error.response?.data?.message=="no user found"){
         toast.error("Please sign up first to create an account");
         return;

      }

      const errorMessage =
        error.response?.data?.message ||
        "Invalid OTP. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Change Password
  // -----------------------------
  const handleChangingPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await addnewPassword(
        newPassword,
        email,
        otp
      );

      console.log(
        "response of setting new password",
        res
      );

      toast.success("Password updated successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      console.log(
        "error in setting new password",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while changing password";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 3 - NEW PASSWORD
  // ==========================================

  if (checkedOtp) {
    return (
      <div className="min-h-screen w-full  flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          <div className="bg-[#071a26] border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8">

            {/* Header */}
            <div className="text-center mb-8">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ">
                <Mail
                  size={22}
                  className="text-yellow-400"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Reset your password
              </h1>

              <p className="text-gray-400 text-sm mt-2">
                Create a new password for your Hired account
              </p>
            </div>

            {/* Password Form */}
            <form
              onSubmit={handleChangingPassword}
              className="space-y-5"
            >

              {/* New Password */}
              <div className="space-y-2">

                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-200"
                >
                  New Password
                </label>

                <div className="relative">

                  <Input
                    id="newPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    name="newPassword"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    className="h-11 w-full pr-11  border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <p className="text-xs text-gray-500">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">

                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-200"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <Input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your new password"
                    name="confirmPassword"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="h-11 w-full pr-11  border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Password Match */}
              {confirmPassword && (
                <p
                  className={`text-xs ${
                    newPassword === confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match"}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all"
              >
                {loading ? (
                  <Loading />
                ) : (
                  "Update password"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>

          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-6">
            © {new Date().getFullYear()} Hired. All rights reserved.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 1 + STEP 2 - EMAIL / OTP
  // ==========================================

  return (
    <div className="min-h-screen w-full  flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        <div className=" border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10">
              <Mail
                size={22}
                className="text-yellow-400"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Forgot password?
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              {sent
                ? "Enter the OTP sent to your email"
                : "Enter your email and we'll send you a verification code"}
            </p>

          </div>

          {/* Email Form */}
          <form
            onSubmit={handleSendEmail}
            className="space-y-5"
          >

            {/* Email */}
            <div className="space-y-2">

              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                disabled={sent}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="h-11 w-full  border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400 disabled:opacity-60"
              />

            </div>

            {/* OTP */}
            {sent && (
              <div className="space-y-3">

                <div className="flex items-center justify-between">

                  <label className="text-sm font-medium text-gray-200">
                    Verification code
                  </label>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={loading}
                    className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>

                </div>

                <div className="flex justify-center py-2">
  <InputOTP
    value={otp}
    onChange={(value) => setOtp(value)}
    maxLength={6}
    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
  >
    <InputOTPGroup className="gap-2 sm:gap-3">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <InputOTPSlot
          key={index}
          index={index}
          className="
            h-12 w-11
            sm:h-14 sm:w-12
            rounded-lg
            border border-gray-600
            bg-[#0d2533]
            text-lg sm:text-xl
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200
            focus-within:border-yellow-400
            focus-within:ring-2
            focus-within:ring-yellow-400/20
            data-[active=true]:border-yellow-400
            data-[active=true]:ring-2
            data-[active=true]:ring-yellow-400/20
          "
        />
      ))}
    </InputOTPGroup>
  </InputOTP>
</div>

                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={
                    loading || otp.length !== 6
                  }
                  className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all"
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

              </div>
            )}

            {/* Send OTP */}
            {!sent && (
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all"
              >
                {loading ? (
                  <Loading />
                ) : (
                  "Send OTP"
                )}
              </Button>
            )}

          </form>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Hired. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default ChangePassword;
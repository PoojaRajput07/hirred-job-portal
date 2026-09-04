import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { registerUser } from "@/axios/Axios";
import { toast } from "react-toastify";
import { AppContext } from "@/Context/AppContext";
import Loading from "./Loading";

const Signup = () => {
  const { loading, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Check password match
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check password length
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Don't send confirmPassword to backend
      const { confirmPassword, ...userData } = registerData;

      const res = await registerUser(userData);

      console.log("response of registering data", res);

      toast.success("User registered successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      console.log("error in registering the user", error);

      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full  flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Signup Card */}
        <div className=" border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Create your account
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Join Hired and start your journey
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleRegister} className="space-y-5">

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
                value={registerData.email}
                onChange={handleChange}
                className="h-11 w-full bg-[#0d2533] border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={handleChange}
                  className="h-11 w-full pr-11 bg-[#0d2533] border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  className="h-11 w-full pr-11 bg-[#0d2533] border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
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

              {/* Password Match Message */}
              {registerData.confirmPassword && (
                <p
                  className={`text-xs ${
                    registerData.password ===
                    registerData.confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {registerData.password ===
                  registerData.confirmPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all"
            >
              {loading ? <Loading /> : "Create account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="h-px flex-1 bg-gray-700" />

            <span className="text-xs text-gray-500 uppercase">
              or
            </span>

            <div className="h-px flex-1 bg-gray-700" />
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-transparent border-gray-600 text-gray-200 hover:bg-[#0d2533] hover:text-white"
            onClick={() => toast.info("Google sign-in is not available yet")}
          >
            Continue with Google
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-7">
            Already have an account?

            <Link
              to="/login"
              className="ml-1.5 text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Hired. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Signup;
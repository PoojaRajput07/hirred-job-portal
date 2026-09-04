
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { doLogin } from "@/axios/Axios";
import { toast } from "react-toastify";
import { AppContext } from "@/Context/AppContext";
import Loading from "./Loading";

const Login = () => {
  const { setLogin, setRole, loading, setLoading } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await doLogin(loginData);

      console.log("response for login user", res);

      toast.success("User logged in successfully");

      setLogin(true);
      setRole(res.data.loggedUser.role);

      if (res.data.loggedUser.role == null) {
        navigate("/role", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("error in login user", error);

      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during login";

      toast.error(errorMessage);

      if (errorMessage === "invalid email") {
        navigate("/signup", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full  flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className=" border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Sign in to continue to Hired
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

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
                value={loginData.email}
                onChange={handleChange}
                className="h-11 w-full  border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </label>

                <Link
                  to="/changepassword"
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Password Input + Show/Hide */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="h-11 w-full pr-11  border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all"
            >
              {loading ? <Loading /> : "Sign in"}
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

          {/* Signup */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?

            <Link
              to="/signup"
              className="ml-1.5 text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
            >
              Sign up
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

export default Login;


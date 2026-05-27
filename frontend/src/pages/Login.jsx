import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.js";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  //signup functionality for the new user sign up
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Ensure cookies/tokens are sent with the request
      axios.defaults.withCredentials = true;

      if (state === "sign up") {
        // --- SIGN UP FLOW ---
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // --- LOGIN FLOW ---
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // Safely catch backend errors (like 400/500 status codes) or network errors
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      {/* Top Left Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer transition-opacity hover:opacity-80"
      />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-md">
        {/* Subtle Background Glow behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-b from-gray-500 to-transparent rounded-3xl blur-2xl opacity-10"></div>

        {/* Glassmorphic Card Container */}
        <div className="relative bg-white/5 p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Header Text */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
            {state === "sign up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {state === "sign up"
              ? "Sign up to get started with your journey."
              : "Log in to continue to your dashboard."}
          </p>

          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            {/* Full Name Input - Only visible during Sign Up */}
            {state === "sign up" && (
              <div className="relative flex items-center group">
                {/* User Icon */}
                <svg
                  className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                  autoComplete="off"
                  className="w-full bg-black/20 border border-white/10 rounded-full px-12 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative flex items-center group">
              {/* Mail Icon */}
              <svg
                className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                autoComplete="nope"
                className="w-full bg-black/20 border border-white/10 rounded-full px-12 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center group">
              {/* Lock Icon */}
              <svg
                className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                autoComplete="new-password"
                className="w-full bg-black/20 border border-white/10 rounded-full px-12 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
              />
            </div>

            {/* Forgot Password Link - Only visible during Login */}
            {state === "login" && (
              <p
                className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors w-fit ml-2 mt-1"
                onClick={() => navigate("/reset-password")}
              >
                Forgot password?
              </p>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-full bg-white text-black font-medium tracking-wide transition-all duration-300 hover:bg-gray-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {state === "sign up" ? "Create Account" : "Login"}
            </button>
          </form>

          {/* Form Toggle Bottom Text */}
          <div className="mt-8 text-center text-sm text-gray-400">
            {state === "sign up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-white cursor-pointer font-medium hover:underline underline-offset-4 transition-all"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                New user?{" "}
                <span
                  onClick={() => setState("sign up")}
                  className="text-white cursor-pointer font-medium hover:underline underline-offset-4 transition-all"
                >
                  Sign up here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

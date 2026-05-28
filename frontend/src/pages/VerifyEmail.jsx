import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const VerifyEmail = () => {
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const inputRef = React.useRef([]);

  //pointer moving to next input box as we type on the current one logic
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  //logic for deleting the input boxes one by one using the backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  //logic for handling paste feature so that we can paste our OTP in the input box

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.slice(0, 6).split('');
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((input) => input?.value || "");
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp },
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData, navigate]);

  //UX improvement
  useEffect(()=>{
    inputRef.current[0]?.focus()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      {/* Top Left Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer transition-opacity hover:opacity-80"
      />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-md">
        {/* Subtle Background Glow behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-b from-gray-500 to-transparent rounded-3xl blur-2xl opacity-10"></div>

        {/* Glassmorphic Card Container */}
        <div className="relative bg-white/5 p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
          {/* Header Text */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            We've sent a 6-digit verification code to your email address.
          </p>

          <form
            onSubmit={onSubmitHandler}
            className="w-full flex flex-col gap-6"
            autoComplete="off"
          >
            {/* OTP Input Group (Static UI mapped for 6 boxes) */}
            <div
              className="flex justify-between gap-2 sm:gap-3 w-full"
              onPaste={handlePaste}
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  inputMode="numeric"
                  key={index}
                  type="text"
                  required
                  maxLength="1"
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-medium bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all shadow-inner"
                  ref={(e) => (inputRef.current[index] = e)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    handleInput(e, index);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-4 rounded-full bg-white text-black font-medium tracking-wide transition-all duration-300 hover:bg-gray-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Verify Account
            </button>
          </form>

          {/* Resend OTP Text */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              Didn't receive the code?{" "}
              <span className="text-white cursor-pointer font-medium hover:underline underline-offset-4 transition-all">
                Resend now
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

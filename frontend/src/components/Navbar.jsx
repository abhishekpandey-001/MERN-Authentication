import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.js";
import { toast } from "react-toastify";
import axios from "axios";
import VerifyEmail from "../pages/VerifyEmail.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn, loading } =
    useContext(AppContext);


    //send email verification OTP logic
    const sendverificationOtp  = async ()=>{
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

  //logout functionality
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="absolute top-0 w-full p-4 sm:p-6 sm:px-24 z-50">
        <div className="w-28 h-6 bg-white/10 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 z-50">
      {/* Logo with a subtle hover effect */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer transition-opacity hover:opacity-80"
      />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-white/5 border border-white/20 text-white font-medium relative group cursor-pointer transition-all duration-300 hover:bg-white/10 shadow-sm">
          {userData.name[0].toUpperCase()}

          {/* Invisible bridge to keep hover state active */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 pt-12">
            {/* Glassmorphic Dropdown Card */}
            <ul className="list-none m-0 p-1.5 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-sm min-w-[140px]">
              {!userData.isAccountVerified && (
                <li onClick={sendverificationOtp} className="py-2 px-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-200 tracking-wide">
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-2 px-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-200 tracking-wide"
              >
                Log Out
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-200 font-medium tracking-wide backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
          onClick={() => navigate("/login")}
        >
          Login
          <img
            src={assets.arrow_icon}
            alt="Arrow"
            className="w-3.5 h-3.5 invert transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
};

export default Navbar;

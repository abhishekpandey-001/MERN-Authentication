import { useContext } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Header = () => {

  const {userData, loading} = useContext(AppContext)


  // --- LOADING STATE (SKELETON UI) ---
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20 px-4 text-center w-full animate-pulse">
        
        {/* Profile Image Skeleton */}
        <div className="relative mb-8">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white/5 border border-white/10 shadow-2xl"></div>
        </div>

        {/* Greeting Skeleton */}
        <div className="h-6 sm:h-8 w-48 bg-white/5 rounded-md mb-3"></div>

        {/* Main Title Skeleton */}
        <div className="h-10 sm:h-14 w-3/4 max-w-lg bg-white/5 rounded-lg mb-6"></div>

        {/* Subtitle Skeleton */}
        <div className="h-4 sm:h-5 w-2/3 max-w-md bg-white/5 rounded-md mb-10"></div>

        {/* Button Skeleton */}
        <div className="h-12 w-40 rounded-full bg-white/5 border border-white/10"></div>
        
      </div>
    )
  }


  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center">
      
      {/* Profile Image with subtle premium glow and border */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-500 to-transparent rounded-full blur-xl opacity-20"></div>
        <img 
          src={assets.header_img} 
          alt="Profile" 
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border border-white/10 shadow-2xl"
        />
      </div>

      {/* Greeting */}
      <h1 className="flex items-center gap-3 text-lg sm:text-2xl font-medium text-gray-400 mb-3 tracking-wide">
        Hey {userData ? userData.name: 'Developer!'}
        <img className="w-7 sm:w-8 aspect-square" src={assets.hand_wave} alt="Wave" />
      </h1>

      {/* Main Title with Premium Gradient */}
      <h2 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        Welcome to our app
      </h2>

      {/* Subtitle / Description */}
      <p className="mb-10 max-w-md text-gray-400 text-sm sm:text-base leading-relaxed">
        Let's start with a quick tour and we will have you up and running in no time.
      </p>

      {/* Premium Glassmorphic Button */}
      <button className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 text-gray-200 font-medium tracking-wide backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95 flex items-center gap-2">
        Get Started
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  )
}

export default Header
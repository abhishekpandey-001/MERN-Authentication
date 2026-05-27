import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = () => {

    const navigate = useNavigate()

  return (
    <div className="absolute top-0 w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 z-50">
      
      {/* Logo with a subtle hover effect */}
      <img 
        src={assets.logo} 
        alt="Logo" 
        className="w-28 sm:w-32 cursor-pointer transition-opacity hover:opacity-80" 
      />

      {/* Premium Glassmorphic Login Button */}
      <button className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-200 font-medium tracking-wide backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
      onClick={()=>navigate('/login')}>
        Login 
        <img 
          src={assets.arrow_icon} 
          alt="Arrow" 
          className="w-3.5 h-3.5 invert transition-transform duration-300 group-hover:translate-x-1" 
        />
      </button>

    </div>
  )
}

export default Navbar
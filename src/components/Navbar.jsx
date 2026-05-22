import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center  gap-96">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap- cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img 
            src="/teacher-svgrepo-com.svg" 
            alt="Teacher's Mate Logo" 
            className="w-8 h-8"
          />
          <div className="font-display flex font-black text-xl tracking-tight gap-1">
            <span className="text-[#1A7F5A]">Teacher's</span>
            <span className="text-[#111827]"> Mate</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8">
          <a href="#" className="text-sm text-[#1A7F5A] font-medium relative">
            Dashboard
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1A7F5A] rounded-full"></span>
          </a>
        </div>

        {/* Auth Buttons */}
        <SignedOut >
          <div className='flex gap-2'>
            <button
            onClick={() => navigate('/sign-in')}
            className="bg-[#4F6EF7] hover:bg-[#3550d4] text-white text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Faculty Login
          </button>

           <button
            onClick={() => navigate('/sign-up')}
            className="bg-[#4F6EF7] hover:bg-[#3550d4] text-white text-sm font-medium px-5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign Up
          </button>
          </div>
        </SignedOut>
         
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  )
}

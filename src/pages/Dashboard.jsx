import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7F6] to-[#E6F4EF]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-black text-[#111827] mb-8">
          Faculty Dashboard
        </h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1A7F5A] mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            This is your faculty dashboard where you can manage classes, track attendance, and view analytics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => navigate('/classes')}
              className="bg-gradient-to-br from-[#1A7F5A] to-[#2ECC8D] rounded-xl p-6 text-white cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <h3 className="text-xl font-bold mb-2">Classes</h3>
              <p className="text-sm opacity-90">Manage your courses and student enrollment</p>
            </div>
            <div 
              onClick={() => navigate('/attendance')}
              className="bg-gradient-to-br from-[#4F6EF7] to-[#3550d4] rounded-xl p-6 text-white cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <h3 className="text-xl font-bold mb-2">Attendance</h3>
              <p className="text-sm opacity-90">Mark and track student attendance</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

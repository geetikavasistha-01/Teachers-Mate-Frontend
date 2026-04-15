import { useNavigate } from 'react-router-dom'
import Card from './Card'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-10 grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-70px)]">
      {/* LEFT SIDE */}
      <div>
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4EF] text-[#1A7F5A] border border-[#1A7F5A]/20 text-[0.68rem] font-medium tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F5A]"></span>
          BUILT FOR HIGHER EDUCATION
        </div>

        {/* Heading */}
        <h1 className="font-display font-black text-5xl md:text-6xl leading-[1.08] tracking-[-0.03em] text-[#111827] mb-4">
          LESS PAPERWORK
          <br />
          <span className="text-[#1A7F5A] italic">for professors,</span>
          <br />
          MORE PRODUCTIVITY
  
        </h1>

        {/* Subtext */}
        <p className="text-base text-gray-500 leading-relaxed max-w-md mb-6 font-light">
          A unified platform built for college faculty &mdash;
          manage lectures, track student performance, and
          streamline department workflows from one smart dashboard.
        </p>

        {/* Buttons */}
        <div className="flex flex-row gap-5 flex-wrap mb-6">
          <button
            onClick={() => navigate('/sign-up')}
            className="bg-gradient-to-r from-[#1A7F5A] to-[#2ECC8D] text-white text-sm font-medium px-7 py-3.5 rounded-[14px] shadow-[0_4px_20px_rgba(26,127,90,0.3)] hover:shadow-[0_8px_28px_rgba(26,127,90,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200"
          >
            Register Your Department
          </button>
        </div>

        {/* Avatar Strip */}
        <div className="flex items-center gap-3">
          <div className="flex">
            <div className="w-[34px] h-[34px] bg-[#7F77DD] border-2 border-white rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white -mr-2.5">AK</div>
            <div className="w-[34px] h-[34px] bg-[#1D9E75] border-2 border-white rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white -mr-2.5">LM</div>
            <div className="w-[34px] h-[34px] bg-[#D85A30] border-2 border-white rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white -mr-2.5">RS</div>
            <div className="w-[34px] h-[34px] bg-[#4F6EF7] border-2 border-white rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white -mr-2.5">JP</div>
            <div className="w-[34px] h-[34px] bg-[#D4537E] border-2 border-white rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white">TW</div>
          </div>
          <div className="ml-3.5">
            <div className="text-sm font-medium text-[#111827]">1,800+ college professors</div>
            <div className="text-xs text-gray-500">already on the platform</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Cards Grid */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Card 1 - Performance Tracking */}
        <Card>
          <div className="text-[0.68rem] uppercase tracking-widest text-gray-400 font-medium mb-1">ACADEMICS</div>
          <div className="font-display font-bold text-[#111827] text-base mb-1">Lecture Performance</div>
          <div className="text-[0.75rem] text-gray-400 mb-4">Live insights across all your college courses.</div>
          
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-2 text-[0.7rem] text-gray-400">
              <span className="w-[52px]">Sem 1</span>
              <div className="flex-1 h-[5px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#1A7F5A] to-[#2ECC8D]" style={{width: '88%'}}></div>
              </div>
              <span>88%</span>
            </div>
            <div className="flex items-center gap-2 text-[0.7rem] text-gray-400">
              <span className="w-[52px]">Sem 2</span>
              <div className="flex-1 h-[5px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#1A7F5A] to-[#2ECC8D]" style={{width: '94%'}}></div>
              </div>
              <span>94%</span>
            </div>
            <div className="flex items-center gap-2 text-[0.7rem] text-gray-400">
              <span className="w-[52px]">Sem 3</span>
              <div className="flex-1 h-[5px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#1A7F5A] to-[#2ECC8D]" style={{width: '71%'}}></div>
              </div>
              <span>71%</span>
            </div>
          </div>
        </Card>

        {/* Card 2 - Faculty Portal */}
        <Card className="bg-gradient-to-br from-[#3550d4] via-[#4F6EF7] to-[#6B8BFF] border-0 row-span-2 flex flex-col justify-between min-h-[220px] hover:shadow-[0_14px_36px_rgba(79,110,247,0.35)]">
          <div>
            <div className="inline-block bg-white/20 text-white/90 text-[0.65rem] uppercase tracking-widest px-3 py-1 rounded-full mb-4 font-medium">FACULTY PORTAL</div>
            <div className="font-display font-bold text-white text-[1.35rem] leading-snug mb-2">Your command center for college administration</div>
            <div className="text-[0.78rem] text-white/70 leading-relaxed mb-5">Manage timetables, attendance, marksheets, and
            student progress &mdash; all in one unified workspace
            built for college educators.</div>
          </div>
          <button className="self-start bg-white/20 hover:bg-white/30 border border-white/30 text-white text-[0.78rem] font-medium px-4 py-2 rounded-[10px] transition-all duration-200">
            Access Portal &rarr;
          </button>
        </Card>

        {/* Card 3 - 98% Retention */}
        <Card className="text-center py-7">
          <div className="font-display font-black text-[3.2rem] text-[#1A7F5A] leading-none mb-1">94%</div>
          <div className="font-display font-bold text-[#111827] text-base mb-1">Course Completion</div>
          <div className="text-[0.75rem] text-gray-400">Across all departments this semester</div>
        </Card>

        {/* Card 4 - Curriculum Planner */}
        <Card>
          <div className="text-[0.68rem] uppercase tracking-widest text-gray-400 font-medium mb-1">PLANNER</div>
          <div className="font-display font-bold text-[#111827] text-base mb-1">Syllabus Manager</div>
          <div className="text-[0.75rem] text-gray-400 mb-4">Track coverage across subjects and semesters.</div>
          
          <div className="flex flex-col gap-2 mt-3">
            <div>
              <div className="flex justify-between text-[0.7rem] mb-1">
                <span className="text-gray-400">Module 1 &ndash; Core Theory</span>
                <span className="text-[#1A7F5A]">100%</span>
              </div>
              <div className="h-[6px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full bg-[#1A7F5A]" style={{width: '100%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[0.7rem] mb-1">
                <span className="text-gray-400">Module 2 &ndash; Lab Sessions</span>
                <span className="text-[#4F6EF7]">68%</span>
              </div>
              <div className="h-[6px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full bg-[#4F6EF7]" style={{width: '68%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[0.7rem] mb-1">
                <span className="text-gray-400">Module 3 &ndash; Viva & Review</span>
                <span className="text-gray-400">41%</span>
              </div>
              <div className="h-[6px] bg-[#E6F4EF] rounded-full overflow-hidden">
                <div className="h-full bg-gray-300" style={{width: '41%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5002/api'

const StatusButton = ({ status, isActive, onClick }) => {
  const activeStyles = {
    present: 'bg-[#1A7F5A] text-white border-[#1A7F5A]',
    absent: 'bg-red-500 text-white border-red-500',
    late: 'bg-amber-500 text-white border-amber-400',
  }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
        isActive
          ? activeStyles[status]
          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  )
}

const StatusBadge = ({ status }) => {
  const styles = {
    present: 'bg-[#E6F4EF] text-[#1A7F5A]',
    absent: 'bg-red-50 text-red-600',
    late: 'bg-amber-50 text-amber-600',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const CourseCard = ({ course, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:-translate-y-1"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="bg-[#E6F4EF] text-[#1A7F5A] text-xs font-medium px-2.5 py-1 rounded-full">
        {course.code}
      </span>
      <span className="text-xs text-gray-400">{course.totalStudents || 0} students</span>
    </div>
    <h3 className="text-base font-bold text-[#111827] mb-1">{course.name}</h3>
    <p className="text-sm text-gray-500">
      {course.departmentId?.name || 'Computer Science'} · Semester {course.semester}
    </p>
  </div>
)

const EmptyState = ({ message, linkText, onLinkClick }) => (
  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
    <p className="text-gray-400 text-sm">{message}</p>
    {linkText && (
      <button onClick={onLinkClick} className="mt-2 text-sm text-[#1A7F5A] hover:underline">
        {linkText}
      </button>
    )}
  </div>
)

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-[#1A7F5A]" />
  </div>
)

export default function Attendance() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('mark')
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Mark Attendance state
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [attendance, setAttendance] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [markError, setMarkError] = useState('')

  // History state
  const [historyCourseId, setHistoryCourseId] = useState('')
  const [historyDates, setHistoryDates] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedDate, setExpandedDate] = useState(null)
  const [expandedRecords, setExpandedRecords] = useState([])
  const [dateRecordsLoading, setDateRecordsLoading] = useState(false)

  // Summary state
  const [summaryCourseId, setSummaryCourseId] = useState('')
  const [summaryData, setSummaryData] = useState([])
  const [summaryLoading, setSummaryLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/courses`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data || []) })
      .catch(err => console.error('Courses fetch error:', err))
      .finally(() => setCoursesLoading(false))
  }, [])

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course)
    setSaved(false)
    setMarkError('')
    setStudentsLoading(true)
    try {
      const res = await fetch(`${API}/students/course/${course._id}`)
      const data = await res.json()
      const list = data.data || []
      setStudents(list)
      const initial = {}
      list.forEach(s => { initial[s._id] = 'present' })
      setAttendance(initial)
    } catch (err) {
      console.error('Students fetch error:', err)
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  // Directly set status instead of cycling — fixes the bug where all 3 buttons cycled together
  const setStudentStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const markAllPresent = () => {
    const all = {}
    students.forEach(s => { all[s._id] = 'present' })
    setAttendance(all)
  }

  const saveAttendance = async () => {
    if (!selectedCourse || !selectedDate) return
    setSaving(true)
    setMarkError('')
    setSaved(false)
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] || 'present'
      }))
      const res = await fetch(`${API}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          date: selectedDate,
          records
        })
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
      } else {
        setMarkError(data.message || 'Failed to save attendance')
      }
    } catch (err) {
      console.error('Save attendance error:', err)
      setMarkError('Server error. Make sure backend is running on port 5001.')
    } finally {
      setSaving(false)
    }
  }

  const handleHistoryCourseChange = async (courseId) => {
    setHistoryCourseId(courseId)
    setHistoryDates([])
    setExpandedDate(null)
    setExpandedRecords([])
    if (!courseId) return
    setHistoryLoading(true)
    try {
      const res = await fetch(`${API}/attendance/history/${courseId}`)
      const data = await res.json()
      // API returns array of date strings
      if (data.success) setHistoryDates(data.data || [])
    } catch (err) {
      console.error('History fetch error:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleDateClick = async (date) => {
    // Toggle: clicking same date again collapses it
    if (expandedDate === date) {
      setExpandedDate(null)
      setExpandedRecords([])
      return
    }
    setExpandedDate(date)
    setExpandedRecords([])
    setDateRecordsLoading(true)
    try {
      const res = await fetch(`${API}/attendance/${historyCourseId}/${date}`)
      const data = await res.json()
      // Each record has { studentId: { name, rollNumber }, status }
      if (data.success) setExpandedRecords(data.data || [])
    } catch (err) {
      console.error('Date records fetch error:', err)
    } finally {
      setDateRecordsLoading(false)
    }
  }

  const handleSummaryCourseChange = async (courseId) => {
    setSummaryCourseId(courseId)
    setSummaryData([])
    if (!courseId) return
    setSummaryLoading(true)
    try {
      const res = await fetch(`${API}/attendance/summary/${courseId}`)
      const data = await res.json()
      // Each item: { student: { _id, name, rollNumber }, total, present, absent, late, percentage }
      if (data.success) setSummaryData(data.data || [])
    } catch (err) {
      console.error('Summary fetch error:', err)
    } finally {
      setSummaryLoading(false)
    }
  }

  const presentCount = Object.values(attendance).filter(s => s === 'present').length
  const absentCount  = Object.values(attendance).filter(s => s === 'absent').length
  const lateCount    = Object.values(attendance).filter(s => s === 'late').length

  const overallPct = summaryData.length
    ? Math.round(summaryData.reduce((acc, s) => acc + (s.percentage || 0), 0) / summaryData.length)
    : 0

  const pctColor = (pct) => {
    if (pct >= 75) return 'text-[#1A7F5A] font-semibold'
    if (pct >= 50) return 'text-amber-500 font-semibold'
    return 'text-red-500 font-semibold'
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const tabs = [
    { key: 'mark',    label: 'Mark Attendance' },
    { key: 'history', label: 'History'         },
    { key: 'summary', label: 'Summary'         },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F6] to-[#E6F4EF] p-8">
      <div className="max-w-5xl mx-auto">

        {/* Top navigation - changes based on whether course is selected */}
        {selectedCourse ? (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => {
                setSelectedCourse(null)
                setStudents([])
                setSaved(false)
                setMarkError('')
              }}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              Courses
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-[#111827] font-medium dark:text-white">
              {selectedCourse.name}
            </span>
          </div>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition-colors"
          >
            ← Back to Dashboard
          </button>
        )}

        <h1 className="text-3xl font-black text-[#111827] mb-6">Attendance</h1>

        {/* Tab bar */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-[#1A7F5A] border-[#1A7F5A]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: MARK ATTENDANCE ─────────────────────────────── */}
        {activeTab === 'mark' && (
          <div>
            {!selectedCourse ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Select a course to mark attendance</p>
                {coursesLoading ? <Spinner /> : courses.length === 0 ? (
                  <EmptyState
                    message="No courses found."
                    linkText="Add courses from Classes →"
                    onLinkClick={() => navigate('/classes')}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.map(course => (
                      <CourseCard key={course._id} course={course} onClick={() => handleSelectCourse(course)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                {/* Course info bar */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-[#111827] text-lg">{selectedCourse.name}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedCourse.code} · {selectedCourse.departmentId?.name || 'CS'} · Semester {selectedCourse.semester}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={e => { setSelectedDate(e.target.value); setSaved(false) }}
                          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A7F5A]"
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Back to Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourse(null)
                            setStudents([])
                            setSaved(false)
                            setMarkError('')
                          }}
                          className="text-xs text-[#1A7F5A] hover:text-[#155e42] font-medium transition-colors"
                        >
                          Back to Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {studentsLoading ? <Spinner /> : students.length === 0 ? (
                  <EmptyState
                    message="No students enrolled in this course yet."
                    linkText="Add students from Classes →"
                    onLinkClick={() => navigate('/classes')}
                  />
                ) : (
                  <>
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#E6F4EF] text-[#1A7F5A] px-2.5 py-1 rounded-full font-medium">
                          {presentCount} Present
                        </span>
                        <span className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium">
                          {absentCount} Absent
                        </span>
                        <span className="text-xs bg-amber-50 text-amber-500 px-2.5 py-1 rounded-full font-medium">
                          {lateCount} Late
                        </span>
                      </div>
                      <button
                        onClick={markAllPresent}
                        className="text-sm text-[#1A7F5A] border border-[#1A7F5A] px-4 py-1.5 rounded-xl hover:bg-[#E6F4EF] transition-all"
                      >
                        Mark All Present
                      </button>
                    </div>

                    {/* Student rows */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                      {students.map((student, idx) => (
                        <div
                          key={student._id}
                          className={`flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-[#111827] text-sm">{student.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{student.rollNumber}</p>
                          </div>
                          {/* Each button directly sets status — no cycling bug */}
                          <div className="flex gap-2">
                            {['present', 'absent', 'late'].map(status => (
                              <StatusButton
                                key={status}
                                status={status}
                                isActive={attendance[student._id] === status}
                                onClick={() => setStudentStatus(student._id, status)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save bar */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">{students.length} students total</p>
                      <div className="flex items-center gap-3">
                        {saved && (
                          <span className="text-sm text-[#1A7F5A] font-medium">
                            ✓ Saved for {formatDate(selectedDate)}
                          </span>
                        )}
                        <button
                          onClick={saveAttendance}
                          disabled={saving}
                          className="bg-[#1A7F5A] hover:bg-[#155e42] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all"
                        >
                          {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                      </div>
                    </div>

                    {markError && (
                      <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                        {markError}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: HISTORY ─────────────────────────────────────── */}
        {activeTab === 'history' && (
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
              <select
                value={historyCourseId}
                onChange={e => handleHistoryCourseChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A] bg-white"
              >
                <option value="">Select a course to view history</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {!historyCourseId ? (
              <EmptyState message="Select a course above to view attendance history." />
            ) : historyLoading ? <Spinner /> : historyDates.length === 0 ? (
              <EmptyState message="No attendance records found for this course." />
            ) : (
              <div className="flex flex-col gap-3">
                {historyDates.map(date => (
                  <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => handleDateClick(date)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-medium text-[#111827] text-sm">{formatDate(date)}</span>
                      <span className="text-xs text-gray-400">{expandedDate === date ? '▲ Hide' : '▼ View'}</span>
                    </button>

                    {expandedDate === date && (
                      <div className="border-t border-gray-100 px-5 py-4">
                        {dateRecordsLoading ? <Spinner /> : expandedRecords.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">No records for this date.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {expandedRecords.map((record, idx) => (
                              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                  {/* studentId is populated with name and rollNumber */}
                                  <p className="text-sm font-medium text-[#111827]">
                                    {record.studentId?.name || 'Unknown Student'}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {record.studentId?.rollNumber || '—'}
                                  </p>
                                </div>
                                <StatusBadge status={record.status} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SUMMARY ─────────────────────────────────────── */}
        {activeTab === 'summary' && (
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
              <select
                value={summaryCourseId}
                onChange={e => handleSummaryCourseChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A] bg-white"
              >
                <option value="">Select a course to view summary</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {!summaryCourseId ? (
              <EmptyState message="Select a course above to view the attendance summary." />
            ) : summaryLoading ? <Spinner /> : summaryData.length === 0 ? (
              <EmptyState message="No attendance data available for this course yet." />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Overall stat */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#111827]">Attendance Summary</h2>
                  <span className={`text-xl font-black ${pctColor(overallPct)}`}>
                    Overall: {overallPct}%
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Roll No', 'Name', 'Total', 'Present', 'Absent', 'Late', '%'].map(h => (
                          <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.map((item, idx) => (
                        // item.student contains { _id, name, rollNumber }
                        <tr
                          key={item.student?._id || idx}
                          className={`border-b border-gray-50 last:border-0 ${
                            item.percentage < 50 ? 'bg-red-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                          }`}
                        >
                          <td className="px-5 py-3 text-sm text-gray-500">{item.student?.rollNumber || '—'}</td>
                          <td className="px-5 py-3 text-sm font-medium text-[#111827]">{item.student?.name || '—'}</td>
                          <td className="px-5 py-3 text-sm text-gray-500 text-center">{item.total || 0}</td>
                          <td className="px-5 py-3 text-sm text-[#1A7F5A] text-center font-medium">{item.present || 0}</td>
                          <td className="px-5 py-3 text-sm text-red-500 text-center font-medium">{item.absent || 0}</td>
                          <td className="px-5 py-3 text-sm text-amber-500 text-center font-medium">{item.late || 0}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`text-sm ${pctColor(item.percentage || 0)}`}>
                              {item.percentage || 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
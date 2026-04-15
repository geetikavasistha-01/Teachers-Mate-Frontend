import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import API from '../api';

export default function Classes() {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [filters, setFilters] = useState({ department: '', semester: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [addingStudent, setAddingStudent] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [courseForm, setCourseForm] = useState({
    name: '', code: '', departmentId: '', semester: '', batch: '', academicYear: ''
  })
  
  const [studentForm, setStudentForm] = useState({
    name: '', rollNumber: '', email: '', semester: '', batch: '', section: ''
  })

  const navigate = useNavigate()

  // Fetch data
  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents(selectedCourse._id)
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/courses`)
      const data = await res.json()
      if (data.success) setCourses(data.data || [])
    } catch (err) {
      console.error('Courses fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API}/departments`)
      const data = await res.json()
      if (data.success) setDepartments(data.data)
    } catch (err) {
      console.error('Departments fetch error:', err)
    }
  }

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        departmentId: courseId,
        semester: courseId
      })
      const res = await fetch(`${API}/students?${params}`)
      const data = await res.json()
      if (data.success) {
        setStudents(data.data || [])
      } else {
        console.error('API Error:', data.message)
        setStudents([])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // Course operations
  const handleAddCourse = async () => {
    if (!courseForm.name || !courseForm.code || !courseForm.departmentId || !courseForm.semester) {
      alert('Please fill all required fields')
      return
    }

    try {
      const res = await fetch(`${API}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: courseForm.name,
          code: courseForm.code,
          departmentId: courseForm.departmentId,
          semester: Number(courseForm.semester),
          batch: courseForm.batch || '',
          academicYear: courseForm.academicYear || '2024-25',
          totalStudents: 0
        })
      })

      const data = await res.json()

      if (data.success) {
        setCourseForm({ name: '', code: '', departmentId: '', semester: '', batch: '', academicYear: '' })
        setShowAddCourse(false)
        fetchCourses()
      } else {
        alert('Error: ' + data.message)
      }
    } catch (err) {
      alert('Cannot connect to server. Make sure backend is running on port 5001')
      console.error(err)
    }
  }

  const handleEditCourse = async () => {
    try {
      const res = await fetch(`${API}/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      })
      if (res.ok) {
        setCourseForm({ name: '', code: '', departmentId: '', semester: '', batch: '', academicYear: '' })
        setEditingCourse(null)
        setShowAddCourse(false)
        fetchCourses()
      }
    } catch (err) {
      console.error('Error editing course:', err)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await fetch(`${API}/courses/${courseId}`, { method: 'DELETE' })
        fetchCourses()
      } catch (err) {
        console.error('Error deleting course:', err)
      }
    }
  }

  const openEditCourse = (course) => {
    setEditingCourse(course)
    setCourseForm({
      name: course.name,
      code: course.code,
      departmentId: course.departmentId?._id || course.departmentId,
      semester: course.semester,
      batch: course.batch,
      academicYear: course.academicYear
    })
    setShowAddCourse(true)
  }

  // Student operations
  const handleAddStudent = async () => {
    if (!studentForm.name || !studentForm.rollNumber || !studentForm.semester) {
      alert('Name, Roll Number and Semester are required')
      return
    }
    try {
      const res = await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         studentForm.name,
          rollNumber:   studentForm.rollNumber,
          email:        studentForm.email,
          semester:     Number(studentForm.semester),
          batch:        studentForm.batch,
          section:      studentForm.section,
          courseIds:    [selectedCourse._id],
          departmentId: selectedCourse.departmentId?._id || selectedCourse.departmentId,
          isActive:     true
        })
      })
      const data = await res.json()
      if (data.success) {
        setStudentForm({ name: '', rollNumber: '', email: '', semester: '', batch: '', section: '' })
        setAddingStudent(false)
        fetchStudents(selectedCourse._id)
        // Update totalStudents count locally
        setCourses(prev => prev.map(c =>
          c._id === selectedCourse._id
            ? { ...c, totalStudents: (c.totalStudents || 0) + 1 }
            : c
        ))
      } else {
        alert('Error: ' + data.message)
      }
    } catch (err) {
      alert('Server error: ' + err.message)
    }
  }

  const enrollAllStudents = async () => {
    if (!selectedCourse) return
    try {
      const res = await fetch(`${API}/students/enroll-all/${selectedCourse._id}`, {
        method: 'POST'
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchStudents(selectedCourse._id)
      }
    } catch (err) {
      alert('Error enrolling students')
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Remove this student from the course?')) return
    try {
      const res = await fetch(`${API}/students/${studentId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) fetchStudents(selectedCourse._id)
    } catch (err) {
      console.error(err)
    }
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesDept = !filters.department || course.departmentId?._id === filters.department
    const matchesSem = !filters.semester || course.semester.toString() === filters.semester
    return matchesDept && matchesSem
  })

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const viewStudents = (course) => {
    setSelectedCourse(course)
    setActiveTab('students')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F6] to-[#E6F4EF] p-8">
      <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">← Back to Dashboard</button>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#111827]">Classes</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === 'courses' 
                ? 'text-[#1A7F5A] border-b-2 border-[#1A7F5A]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === 'students' 
                ? 'text-[#1A7F5A] border-b-2 border-[#1A7F5A]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={!selectedCourse}
          >
            Students {selectedCourse && `(${selectedCourse.name})`}
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            {/* Filters and Add Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4">
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A7F5A]"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A7F5A]"
                >
                  <option value="">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingCourse(null)
                  setCourseForm({ name: '', code: '', departmentId: '', semester: '', batch: '', academicYear: '' })
                  setShowAddCourse(true)
                }}
                className="bg-[#1A7F5A] hover:bg-[#155e42] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
              >
                + Add Course
              </button>
            </div>

            {/* Add/Edit Course Modal */}
            {showAddCourse && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
                <h2 className="font-bold text-[#111827] mb-4">
                  {editingCourse ? 'Edit Course' : 'New Course'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Course Name"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  />
                  <input
                    placeholder="Course Code"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  />
                  <select
                    value={courseForm.departmentId}
                    onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                  <select
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  >
                    <option value="">Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Batch"
                    value={courseForm.batch}
                    onChange={(e) => setCourseForm({ ...courseForm, batch: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  />
                  <input
                    placeholder="Academic Year"
                    value={courseForm.academicYear}
                    onChange={(e) => setCourseForm({ ...courseForm, academicYear: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={editingCourse ? handleEditCourse : handleAddCourse} 
                    className="bg-[#1A7F5A] text-white text-sm px-5 py-2 rounded-xl hover:bg-[#155e42] transition-all"
                  >
                    {editingCourse ? 'Update Course' : 'Save Course'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddCourse(false)
                      setEditingCourse(null)
                    }} 
                    className="text-sm text-gray-500 hover:text-gray-800 px-5 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Courses Grid */}
            {loading ? (
              <p className="text-gray-400 text-sm">Loading courses...</p>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow border border-gray-100">
                <p className="text-gray-400 text-sm">No courses found. Add your first course.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map(course => (
                  <div key={course._id} className="bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-[#1A7F5A] bg-[#E6F4EF] px-2.5 py-1 rounded-full">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#111827] mt-2">{course.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{course.departmentId?.name || 'Unknown Department'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Semester {course.semester} · Batch {course.batch} · {course.academicYear}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{course.totalStudents || 0} students</p>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openEditCourse(course)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => viewStudents(course)}
                        className="text-xs bg-[#E6F4EF] text-[#1A7F5A] px-3 py-1 rounded-lg hover:bg-[#1A7F5A] hover:text-white transition-all"
                      >
                        View Students →
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            {!selectedCourse ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow border border-gray-100">
                <p className="text-gray-400 text-sm">
                  Go to All Courses tab and click "View Students" on a course
                </p>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <button
                      onClick={() => { setSelectedCourse(null); setStudents([]) }}
                      className="text-xs text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
                    >
                      ← All Courses
                    </button>
                    <h2 className="font-bold text-[#111827] text-lg">{selectedCourse.name}</h2>
                    <p className="text-sm text-gray-400">{selectedCourse.code} · Sem {selectedCourse.semester}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={enrollAllStudents}
                      className="border border-[#1A7F5A] text-[#1A7F5A] hover:bg-[#E6F4EF] text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
                    >
                      Enroll All Existing Students
                    </button>
                    <button
                      onClick={() => setAddingStudent(!addingStudent)}
                      className="bg-[#1A7F5A] hover:bg-[#155e42] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
                    >
                      + Add Student
                    </button>
                  </div>
                </div>

                {/* Add Student Form */}
                {addingStudent && (
                  <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 mb-5">
                    <h3 className="font-bold text-[#111827] mb-4 text-sm">New Student</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="Full Name *"
                        value={studentForm.name}
                        onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                      <input
                        placeholder="Roll Number *"
                        value={studentForm.rollNumber}
                        onChange={e => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                      <input
                        placeholder="Email"
                        value={studentForm.email}
                        onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                      <input
                        placeholder="Semester *"
                        type="number"
                        min="1" max="8"
                        value={studentForm.semester}
                        onChange={e => setStudentForm({ ...studentForm, semester: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                      <input
                        placeholder="Batch (e.g. 2023)"
                        value={studentForm.batch}
                        onChange={e => setStudentForm({ ...studentForm, batch: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                      <input
                        placeholder="Section (e.g. A, B, C) - Optional"
                        value={studentForm.section}
                        onChange={e => setStudentForm({ ...studentForm, section: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A]"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleAddStudent}
                        className="bg-[#1A7F5A] text-white text-sm px-5 py-2 rounded-xl hover:bg-[#155e42] transition-all"
                      >
                        Save Student
                      </button>
                      <button
                        onClick={() => setAddingStudent(false)}
                        className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Search */}
                <input
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A7F5A] mb-4 bg-white"
                />

                {/* Students List */}
                {studentsLoading ? (
                  <p className="text-gray-400 text-sm">Loading students...</p>
                ) : students.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center shadow border border-gray-100">
                    <p className="text-gray-400 text-sm">No students enrolled yet. Add your first student.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Name</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Roll Number</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Semester</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Batch</th>
                          <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students
                          .filter(s =>
                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((student, idx) => (
                            <tr key={student._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                              <td className="px-5 py-3 text-sm font-medium text-[#111827]">{student.name}</td>
                              <td className="px-5 py-3 text-sm text-gray-500">{student.rollNumber}</td>
                              <td className="px-5 py-3 text-sm text-gray-500">Sem {student.semester}</td>
                              <td className="px-5 py-3 text-sm text-gray-500">{student.batch || '-'}</td>
                              <td className="px-5 py-3 text-right">
                                <button
                                  onClick={() => handleRemoveStudent(student._id)}
                                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ExternalLink, FileText, Download, CheckCircle, Clock, LayoutTemplate } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'How GRIT Works — Explainer & Orientation',
    desc: 'Understand the GRIT framework, how you can earn Miles, track your progress, and grow through real activities. A must-watch for all new students.',
    tag: 'Orientation',
    emoji: '🎯',
    gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2d2b45 100%)',
    label: 'GRIT',
    textColor: '#a78bfa',
  },
  {
    id: 2,
    title: 'Quantitative Reasoning',
    desc: 'A comprehensive quantitative reasoning course that builds problem-solving skills through core concepts, teaching you to think logically, break down numerical problems, and apply efficient solving techniques.',
    tag: 'Aptitude',
    emoji: '🔢',
    gradient: 'linear-gradient(135deg, #6c47ff 0%, #a855f7 100%)',
    label: 'Aptitude',
    textColor: 'white',
  },
  {
    id: 3,
    title: 'Critical Thinking & Communication (Level 2)',
    desc: 'A high-intensity, exam-oriented guide built to elevate advanced verbal ability and critical thinking for high-difficulty assessments.',
    tag: 'Communication',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    label: 'Level 2',
    textColor: 'white',
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms Masterclass',
    desc: 'Complete DSA course covering arrays, linked lists, trees, graphs, dynamic programming with practical coding problems. Industry-level preparation.',
    tag: 'Technical',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    label: 'Technical',
    textColor: 'white',
  },
  {
    id: 5,
    title: 'Full Stack Web Development Bootcamp',
    desc: 'Build real-world web applications using React, Node.js, Express, and MongoDB. Includes 10 projects and industry mentorship sessions.',
    tag: 'Development',
    emoji: '🌐',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)',
    label: 'Full Stack',
    textColor: 'white',
  },
  {
    id: 6,
    title: 'Soft Skills for Campus Placements',
    desc: 'Master the art of group discussions, HR interviews, email communication, and professional networking to ace your campus placements.',
    tag: 'Soft Skills',
    emoji: '🤝',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
    label: 'Career',
    textColor: 'white',
  },
]

const notes = {
  CSE: [
    { id: 1, title: 'Operating Systems — Chapter 1 to 3', subject: 'OS', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Database Management Systems Complete Notes', subject: 'DBMS', type: 'PDF', size: '5.1 MB' },
    { id: 3, title: 'Data Structures using C — Lecture Slides', subject: 'DSA', type: 'PPT', size: '8.7 MB' },
    { id: 4, title: 'Web Technology Syllabus & Guidelines', subject: 'WT', type: 'PDF', size: '1.2 MB' },
  ],
  AIML: [
    { id: 1, title: 'Introduction to Neural Networks', subject: 'Deep Learning', type: 'PDF', size: '3.2 MB' },
    { id: 2, title: 'Machine Learning Basics (Supervised)', subject: 'ML', type: 'PDF', size: '4.5 MB' },
    { id: 3, title: 'Python for Data Science Cheat Sheet', subject: 'Data Science', type: 'PDF', size: '1.1 MB' },
  ]
}

const assignments = {
  CSE: [
    { id: 1, title: 'DBMS Assignment 1: E-R Diagrams', subject: 'DBMS', deadline: 'Aug 25, 2026', status: 'Pending' },
    { id: 2, title: 'OS Assignment 2: CPU Scheduling Algorithms', subject: 'OS', deadline: 'Aug 28, 2026', status: 'Pending' },
    { id: 3, title: 'Web Tech Mini Project', subject: 'WT', deadline: 'Sep 10, 2026', status: 'Submitted' },
  ],
  AIML: [
    { id: 1, title: 'ML Assignment 1: Linear Regression', subject: 'ML', deadline: 'Aug 26, 2026', status: 'Pending' },
    { id: 2, title: 'Data Preprocessing Task', subject: 'Data Science', deadline: 'Aug 29, 2026', status: 'Pending' },
    { id: 3, title: 'Python Basics Assessment', subject: 'Python', deadline: 'Sep 5, 2026', status: 'Submitted' },
  ]
}

export default function GritCoursesPage() {
  const [activeTab, setActiveTab] = useState('courses')
  const [activeBranch, setActiveBranch] = useState('CSE')
  return (
    <div className="page-content" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>Learning Center</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Access your courses, notes, and assignments.
          </p>
        </div>
        
        {/* Branch Selector */}
        <div style={{ display: 'flex', background: '#f5f3ff', padding: 4, borderRadius: 20 }}>
          <button onClick={() => setActiveBranch('CSE')} style={{
            padding: '6px 16px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
            background: activeBranch === 'CSE' ? '#6c47ff' : 'transparent',
            color: activeBranch === 'CSE' ? 'white' : '#6b7280',
            boxShadow: activeBranch === 'CSE' ? '0 2px 8px rgba(108,71,255,0.2)' : 'none'
          }}>B.Tech CSE</button>
          <button onClick={() => setActiveBranch('AIML')} style={{
            padding: '6px 16px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
            background: activeBranch === 'AIML' ? '#6c47ff' : 'transparent',
            color: activeBranch === 'AIML' ? 'white' : '#6b7280',
            boxShadow: activeBranch === 'AIML' ? '0 2px 8px rgba(108,71,255,0.2)' : 'none'
          }}>B.Tech AIML</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e8e4ff', marginBottom: 24 }}>
        {[
          { id: 'courses', label: 'Video Courses' },
          { id: 'notes', label: 'Notes & Materials' },
          { id: 'assignments', label: 'Assignments' },
        ].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '0 4px 12px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: activeTab === tab.id ? '#6c47ff' : '#6b7280',
            borderBottom: activeTab === tab.id ? '2px solid #6c47ff' : '2px solid transparent',
            transition: 'all 0.2s'
          }}>
            {tab.label}
          </div>
        ))}
      </div>

      {activeTab === 'courses' && (
        <>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Courses Available', value: courses.length, color: '#6c47ff', bg: '#f5f3ff' },
              { label: 'In Progress', value: 2, color: '#f59e0b', bg: '#fff7ed' },
              { label: 'Completed', value: 1, color: '#22c55e', bg: '#ecfdf5' },
              { label: 'Miles Earned', value: '340', color: '#a855f7', bg: '#faf5ff' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '16px 20px', minWidth: 120 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Course cards */}
          <div>
            {courses.map(course => (
              <div key={course.id} className="grit-course-card">
                <div style={{
                  width: 160, height: 100, borderRadius: 12, background: course.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 40, position: 'relative', overflow: 'hidden'
                }}>
                  <span>{course.emoji}</span>
                  <div style={{
                    position: 'absolute', bottom: 6, right: 6,
                    background: 'rgba(0,0,0,0.35)', borderRadius: 20,
                    padding: '2px 8px', fontSize: 10, fontWeight: 700, color: course.textColor
                  }}>
                    {course.label}
                  </div>
                </div>

                <div className="grit-course-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ padding: '2px 10px', background: '#f5f3ff', color: '#6c47ff', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {course.tag}
                    </span>
                  </div>
                  <div className="grit-course-title">{course.title}</div>
                  <div className="grit-course-desc">{course.desc}</div>
                  <button className="start-btn">Start Learning</button>
                </div>
                <button className="grit-more-btn">···</button>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {notes[activeBranch].map(note => (
            <div key={note.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ padding: 12, background: '#f5f3ff', color: '#6c47ff', borderRadius: 12 }}>
                  {note.type === 'PDF' ? <FileText size={24} /> : <LayoutTemplate size={24} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', lineHeight: 1.4, marginBottom: 4 }}>{note.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#6c47ff', fontWeight: 600 }}>{note.subject}</span> • <span>{note.type}</span> • <span>{note.size}</span>
                  </div>
                </div>
              </div>
              <button style={{
                marginTop: 'auto', width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #e8e4ff',
                background: 'white', color: '#6c47ff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s'
              }}>
                <Download size={14} /> Download File
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {assignments[activeBranch].map(assn => (
            <div key={assn.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ padding: '2px 10px', background: '#f5f3ff', color: '#6c47ff', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {assn.subject}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: assn.status === 'Submitted' ? '#059669' : '#f59e0b', fontWeight: 600 }}>
                    {assn.status === 'Submitted' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {assn.status}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>{assn.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Deadline: {assn.deadline}</div>
              </div>
              <button style={{
                padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                background: assn.status === 'Submitted' ? '#f5f3ff' : '#6c47ff',
                color: assn.status === 'Submitted' ? '#6c47ff' : 'white',
              }}>
                {assn.status === 'Submitted' ? 'View Submission' : 'Start Assignment'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

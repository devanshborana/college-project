import { MonitorPlay, ExternalLink, PlayCircle } from 'lucide-react'

export default function CoursesPage() {
  const courses = [
    {
      title: 'Database Management Systems (DBMS)',
      channel: 'Gate Smashers',
      link: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y',
      color: '#ef4444', // YouTube red
      desc: 'Complete DBMS playlist covering SQL, Normalization, ER Diagrams and concurrency control.'
    },
    {
      title: 'Data Structures & Algorithms',
      channel: 'freeCodeCamp.org',
      link: 'https://www.youtube.com/watch?v=8hly31xKli0',
      color: '#ef4444',
      desc: 'Learn Data Structures and Algorithms from scratch in this comprehensive video course.'
    },
    {
      title: 'Web Technology (HTML, CSS, JS)',
      channel: 'SuperSimpleDev',
      link: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
      color: '#ef4444',
      desc: 'HTML & CSS Full Course - Beginner to Pro. Excellent for building beautiful responsive websites.'
    },
    {
      title: 'Object Oriented Programming (C++)',
      channel: 'CodeBeauty',
      link: 'https://www.youtube.com/watch?v=wN0x9eZLix4',
      color: '#ef4444',
      desc: 'C++ OOP Tutorial for Beginners. Understand classes, objects, inheritance, and polymorphism.'
    },
    {
      title: 'Digital Electronics',
      channel: 'Neso Academy',
      link: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm',
      color: '#ef4444',
      desc: 'Master Logic Gates, Boolean Algebra, and Combinational/Sequential Circuits.'
    },
    {
      title: 'Foundations of Data Science',
      channel: 'Krish Naik',
      link: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVNUL99R4bDlVYsncUNvwUBB',
      color: '#ef4444',
      desc: 'Complete Machine Learning and Data Science playlist with Python.'
    }
  ]

  return (
    <div className="page-content" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>Curated YouTube Courses</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>High-quality video playlists perfectly mapped to your college curriculum.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {courses.map((course, i) => (
          <a key={i} href={course.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="card fade-in-up" style={{ 
              padding: 24, display: 'flex', flexDirection: 'column', height: '100%',
              transition: 'all 0.25s', borderTop: `4px solid ${course.color}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, background: `${course.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MonitorPlay size={26} color={course.color} />
                </div>
                <ExternalLink size={18} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', marginBottom: 6 }}>{course.title}</h3>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 12 }}>by {course.channel}</div>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5, flex: 1 }}>{course.desc}</p>
              
              <div style={{ 
                marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 600, color: course.color,
                padding: '10px 16px', background: `${course.color}10`, borderRadius: 8,
                justifyContent: 'center'
              }}>
                <PlayCircle size={18} /> Watch on YouTube
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

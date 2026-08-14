import { useState } from 'react'
import { MonitorPlay, ExternalLink, PlayCircle, Filter } from 'lucide-react'
import { youtubeData } from '../data/youtubeData'

export default function CoursesPage() {
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedType, setSelectedType] = useState('All')

  // Extract unique subjects and types for the dropdown options
  const subjects = ['All', ...new Set(youtubeData.map(v => v.subject))]
  const types = ['All', ...new Set(youtubeData.map(v => v.type))]

  // Filter the videos based on dropdown selections
  const filteredVideos = youtubeData.filter(v => {
    const matchSubject = selectedSubject === 'All' || v.subject === selectedSubject
    const matchType = selectedType === 'All' || v.type === selectedType
    return matchSubject && matchType
  })

  return (
    <div className="page-content" style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>Video Library</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Filter by subject and video type to find exactly what you need.</p>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={12} /> Subject
            </label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 10, border: '1px solid #e5e7eb',
                outline: 'none', background: 'white', color: '#1e1b4b',
                fontSize: 14, fontWeight: 600, minWidth: 160, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub === 'All' ? 'All Subjects' : sub}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={12} /> Video Type
            </label>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 10, border: '1px solid #e5e7eb',
                outline: 'none', background: 'white', color: '#1e1b4b',
                fontSize: 14, fontWeight: 600, minWidth: 160, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <MonitorPlay size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>No videos found</h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filteredVideos.map((video) => (
            <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card fade-in-up" style={{ 
                padding: 20, display: 'flex', flexDirection: 'column', height: '100%',
                transition: 'all 0.25s', borderTop: `4px solid ${video.color}`
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 42, height: 42, borderRadius: 10, background: `${video.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MonitorPlay size={20} color={video.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: video.color }}>
                        {video.type}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{video.duration}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} color="#9ca3af" />
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, lineHeight: 1.4 }}>
                  {video.title}
                </h3>
                
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d1d5db' }} />
                  {video.channel}
                </div>
                
                <div style={{ 
                  marginTop: 'auto', display: 'inline-block',
                  fontSize: 12, fontWeight: 700, color: '#4b5563',
                  padding: '6px 12px', background: '#f3f4f6', borderRadius: 6,
                  alignSelf: 'flex-start'
                }}>
                  {video.subject}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

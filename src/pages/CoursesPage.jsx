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
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>Video Library</h1>
          <p style={{ fontSize: 14, color: '#525252', marginTop: 4 }}>Filter by subject and video type to find exactly what you need.</p>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#525252', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={12} /> Subject
            </label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 8, border: '1px solid #E7E5E4',
                outline: 'none', background: '#FFFFFF', color: '#1A1A1A',
                fontSize: 14, fontWeight: 500, minWidth: 160, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub === 'All' ? 'All Subjects' : sub}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#525252', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={12} /> Video Type
            </label>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 8, border: '1px solid #E7E5E4',
                outline: 'none', background: '#FFFFFF', color: '#1A1A1A',
                fontSize: 14, fontWeight: 500, minWidth: 160, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
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
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 12, border: '1px solid #E7E5E4' }}>
          <MonitorPlay size={48} color="#A3A3A3" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>No videos found</h3>
          <p style={{ color: '#525252', fontSize: 14 }}>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filteredVideos.map((video) => (
            <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card fade-in-up" style={{ 
                padding: 24, display: 'flex', flexDirection: 'column', height: '100%',
                transition: 'all 0.15s', border: '1px solid #E7E5E4', background: '#FFFFFF', borderRadius: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'
                e.currentTarget.style.borderColor = '#D4D4D4'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'
                e.currentTarget.style.borderColor = '#E7E5E4'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 8, background: '#F5F5F4', border: '1px solid #E7E5E4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MonitorPlay size={18} color="#1A1A1A" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: '#A3A3A3' }}>
                        {video.type}
                      </div>
                      <div style={{ fontSize: 12, color: '#A3A3A3', fontWeight: 500 }}>{video.duration}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} color="#D4D4D4" />
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 10, lineHeight: 1.4, letterSpacing: '-0.2px' }}>
                  {video.title}
                </h3>
                
                <div style={{ fontSize: 13, fontWeight: 500, color: '#525252', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D4D4D4' }} />
                  {video.channel}
                </div>
                
                <div style={{ 
                  marginTop: 'auto', display: 'inline-block',
                  fontSize: 12, fontWeight: 600, color: '#1A1A1A',
                  padding: '4px 10px', background: '#FAFAFA', borderRadius: 6, border: '1px solid #E7E5E4',
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

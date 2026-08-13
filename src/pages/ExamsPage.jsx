import { FileText } from 'lucide-react'

export default function ExamsPage() {
  return (
    <div className="page-content" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>Exams</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>View exam results and schedules</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Exams', value: '0', color: '#6c47ff', bg: '#f5f3ff' },
          { label: 'Completed', value: '0', color: '#22c55e', bg: '#ecfdf5' },
          { label: 'Upcoming', value: '0', color: '#f59e0b', bg: '#fff7ed' },
          { label: 'Average Score', value: 'N/A', color: '#3b82f6', bg: '#eff6ff' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="card">
        <div className="empty-state">
          <div style={{ 
            width: 120, height: 120, background: '#f5f3ff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20
          }}>
            <FileText size={52} color="#c4b5fd" />
          </div>
          <h3>No Exams Scheduled Yet</h3>
          <p>Your upcoming exams will appear here once they are scheduled. Keep learning and practicing to stay prepared.</p>
          <button style={{
            marginTop: 20, padding: '10px 24px', background: '#6c47ff', color: 'white',
            border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(108,71,255,0.3)'
          }}>
            Browse Question Bank
          </button>
        </div>
      </div>
    </div>
  )
}

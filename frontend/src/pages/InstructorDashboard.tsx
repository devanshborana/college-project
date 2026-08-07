import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, BookOpen, FileCode } from 'lucide-react';

export default function InstructorDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState([]);
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    if (!token || user?.role !== 'instructor') return;
    
    fetch('http://localhost:8000/instructor/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(console.error);
    
    fetch('http://localhost:8000/instructor/flagged-sessions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setFlagged(data))
    .catch(console.error);
  }, [token, user]);

  if (user?.role !== 'instructor') {
    return <div className="p-12 text-center text-red-500 font-bold">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-text mb-8">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Flagged Test Sessions
          </h2>
          <div className="space-y-4">
            {flagged.map((f: any) => (
              <div key={f.session_id} className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-semibold text-red-800">{f.user_name}</div>
                  <div className="text-sm text-red-600">Session #{f.session_id} • Subject #{f.subject_id}</div>
                </div>
                <div className="px-3 py-1 bg-red-100 text-red-800 font-bold rounded-full text-sm">
                  {f.violation_count} Violations
                </div>
              </div>
            ))}
            {flagged.length === 0 && <div className="text-gray-500">No flagged sessions.</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <FileCode className="text-accent" /> Problem Failure Rates
          </h2>
          <div className="h-64">
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="problem_title" type="category" width={150} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="fail_rate" fill="#319795" name="Failure Rate (%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No stats available.</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          <BookOpen className="text-accent" /> Quick Actions
        </h2>
        <div className="text-sm text-gray-500 mb-4">Content management forms would go here to interact with the CRUD API directly.</div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-100 text-text rounded-md hover:bg-gray-200 font-medium">+ Add Syllabus Item</button>
          <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 font-medium">+ Add Practice Problem</button>
        </div>
      </div>
    </div>
  );
}

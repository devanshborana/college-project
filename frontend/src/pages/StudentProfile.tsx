import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Activity } from 'lucide-react';

export default function StudentProfile() {
  const { token, user } = useAuth();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/gamification/profile/chart-data', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setChartData(data))
    .catch(console.error);
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <User size={40} className="text-gray-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text mb-1">{user?.full_name || 'Student Name'}</h1>
          <p className="text-gray-500">{user?.email || 'student@example.com'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          <Activity className="text-accent" /> Points Progression (Daily)
        </h2>
        
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="points" stroke="#319795" strokeWidth={3} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
              No points data available yet. Complete some problems!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

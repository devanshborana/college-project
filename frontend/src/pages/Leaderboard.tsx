import React, { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  user_id: number;
  full_name: string;
  total_points: int;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/gamification/leaderboard')
      .then(res => res.json())
      .then(data => setLeaders(data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center gap-3 mb-8">
        <Trophy size={32} className="text-accent" />
        <h1 className="text-3xl font-bold text-text">Global Leaderboard</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rank</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaders.map((leader, idx) => (
              <tr key={leader.user_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  {idx === 0 ? <Medal className="text-yellow-500" size={20} /> :
                   idx === 1 ? <Medal className="text-gray-400" size={20} /> :
                   idx === 2 ? <Medal className="text-amber-600" size={20} /> : 
                   `#${idx + 1}`}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-text">
                  {leader.full_name}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-accent text-right">
                  {leader.total_points} pts
                </td>
              </tr>
            ))}
            {leaders.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No data available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

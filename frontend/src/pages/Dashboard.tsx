import React from 'react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  { id: 'ppce', name: 'PPCE', description: 'Principles of Programming & C/C++' },
  { id: 'math', name: 'Math', description: 'Applied Mathematics' },
  { id: 'cpp', name: 'C++', description: 'Object Oriented Programming' },
  { id: 'c', name: 'C', description: 'Advanced C Programming' },
  { id: 'python', name: 'Python', description: 'Python for Data Science' },
  { id: 'w7', name: 'W.7', description: 'Web Technology' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text">Dashboard</h2>
        <p className="text-gray-500 mt-2">Select a subject to enter its workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <div 
            key={subject.id}
            onClick={() => navigate(`/subject/${subject.id}/practice`)}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-accent font-bold text-xl">{subject.name.substring(0, 2)}</span>
            </div>
            <h3 className="text-xl font-bold text-text">{subject.name}</h3>
            <p className="text-gray-500 mt-2 flex-1">{subject.description}</p>
            <div className="mt-4 text-accent font-medium text-sm flex items-center group">
              Enter Workspace 
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

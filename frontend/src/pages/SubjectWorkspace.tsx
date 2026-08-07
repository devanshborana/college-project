import React from 'react';
import { useParams, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import CodingEnvironment from '../components/CodingEnvironment';
import TestMode from './TestMode';

const PlaceholderTab = ({ name }: { name: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
    <div className="space-y-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-gray-400 text-2xl">🚧</span>
      </div>
      <h3 className="text-2xl font-bold text-text">{name} Workspace</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        This section is currently a placeholder. Real data and features for {name.toLowerCase()} will be wired up in later steps.
      </p>
    </div>
  </div>
);

export default function SubjectWorkspace() {
  const { subjectId } = useParams();

  const TABS = [
    { id: 'test', label: 'Test / Test Series' },
    { id: 'notes', label: 'Notes' },
    { id: 'assignment', label: 'Assignment' },
    { id: 'practice', label: 'Practice' },
    { id: 'syllabus', label: 'Syllabus' },
  ];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col h-full">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-3xl font-bold text-text uppercase">{subjectId}</h2>
        <span className="text-gray-400">|</span>
        <h3 className="text-xl text-gray-500">Workspace</h3>
      </div>

      <nav className="flex flex-wrap gap-3 mb-8">
        {TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/subject/${subjectId}/${tab.id}`}
            className={({ isActive }) => 
              `px-5 py-2 rounded-full border text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-accent/10 border-accent text-accent' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="practice" replace />} />
          <Route path="test" element={<TestMode />} />
          <Route path="notes" element={<PlaceholderTab name="Notes" />} />
          <Route path="assignment" element={<PlaceholderTab name="Assignment" />} />
          <Route path="practice" element={<CodingEnvironment />} />
          <Route path="syllabus" element={<PlaceholderTab name="Syllabus" />} />
        </Routes>
      </div>
    </main>
  );
}

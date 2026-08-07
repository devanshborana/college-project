import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubjectWorkspace from './pages/SubjectWorkspace';
import Leaderboard from './pages/Leaderboard';
import StudentProfile from './pages/StudentProfile';
import InstructorDashboard from './pages/InstructorDashboard';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <ul className="flex items-center gap-6">
        <li><Link to="/" className="hover:text-accent font-medium transition-colors text-text">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/" className="hover:text-accent font-medium transition-colors text-text">Subjects</Link></li>
            <li><Link to="/leaderboard" className="hover:text-accent font-medium transition-colors text-text">Leaderboard</Link></li>
            <li><Link to="/profile" className="hover:text-accent font-medium transition-colors text-text">Profile</Link></li>
            {useAuth().user?.role === 'instructor' && (
              <li><Link to="/instructor" className="hover:text-accent font-medium transition-colors text-text">Instructor</Link></li>
            )}
            <li><button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium transition-colors">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="hover:text-accent font-medium transition-colors text-text">Login</Link></li>
            <li><Link to="/signup" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <h1 className="text-xl font-bold tracking-tight text-text hidden sm:block">Lachoo Memorial College of Science and Technology</h1>
              <h1 className="text-xl font-bold tracking-tight text-text sm:hidden">LMCST Learn</h1>
            </Link>
            <Navigation />
          </header>

          {/* Main Content */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/subject/:subjectId/*" element={<SubjectWorkspace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-6 text-center mt-auto">
            <div className="text-text font-bold mb-2">Lachoo Memorial College of Science and Technology</div>
            <div className="text-gray-500 text-sm">Sector-A, Shastri Nagar, Jodhpur, Rajasthan 342003</div>
            <div className="text-gray-400 text-xs mt-4">© {new Date().getFullYear()} LMCST Learn. All rights reserved.</div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 h-12 border-b-2 border-black"></div></div>;
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white text-black transition-colors duration-300 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/organizer/dashboard" element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
export default App;

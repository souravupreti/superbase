import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Community from './pages/Community';
import CreateCommunity from './pages/CreateCommunity';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import SavedPosts from './pages/SavedPosts';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-brand-text">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-xs text-brand-muted font-bold tracking-widest uppercase">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main Layout containing Sidebars and Headers */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="r/:communityId" element={<Community />} />
            <Route path="community/create" element={<ProtectedRoute><CreateCommunity /></ProtectedRoute>} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="u/:userId" element={<Profile />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="saved" element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>

        {/* Global Toast Alerts */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

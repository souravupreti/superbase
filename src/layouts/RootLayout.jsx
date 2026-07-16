import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notifications';
import { communityService } from '../services/community';
import { getDeterministicUser } from '../utils/userHelper';
import {
  Home, 
  Bookmark, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  TrendingUp, 
  Compass, 
  Menu, 
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const RootLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentCommunities, setRecentCommunities] = useState([]);

  // Fetch initial layout data
  useEffect(() => {
    if (!user) return;
    
    // Unread notifications
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (err) {
        console.warn('Failed to fetch unread count:', err);
      }
    };

    // Communities
    const fetchCommunities = async () => {
      try {
        const list = await communityService.getCommunities();
        setCommunities(list);
      } catch (err) {
        console.warn('Failed to fetch communities:', err);
      }
    };

    fetchUnreadCount();
    fetchCommunities();

    // Poll for notifications every 30s as a secondary fallback
    const interval = setInterval(fetchUnreadCount, 30000);

    // Get recent communities from localstorage
    try {
      const savedRecents = JSON.parse(localStorage.getItem('recent_communities') || '[]');
      setRecentCommunities(savedRecents);
    } catch (e) {
      console.warn('Failed to load recent communities from localStorage:', e);
    }

    return () => clearInterval(interval);
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error('Failed to log out: ' + err.message);
    }
  };

  // Profile data for active user
  const profile = getDeterministicUser(user?.id, user);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10rem] top-28 h-80 w-80 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute right-[-12rem] top-10 h-96 w-96 rounded-full bg-brand-secondary/18 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
      </div>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-bg/72 px-4 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-3">
            <span className="brand-gradient pulse-ring flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black tracking-widest text-white shadow-xl shadow-brand-primary/25">
              NX
            </span>
            <span className="hidden font-display text-xl font-black text-white sm:inline">
              Nexus<span className="text-brand-accent">/</span>
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search posts, communities, people..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.055] py-2.5 pl-10 pr-4 text-xs font-semibold text-brand-text shadow-inner shadow-black/20 outline-none transition-all placeholder:text-brand-muted focus:border-brand-accent/60 focus:bg-white/[0.09]"
          />
        </form>

        {/* Header Right */}
        <div className="flex items-center gap-3">
          {user ? <Link 
            to="/settings"
            className="hidden h-9 w-9 overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-brand-accent md:block"
          >
            <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </Link> : (
            <Link to="/login" className="hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/[0.1] md:inline-flex">
              Sign in
            </Link>
          )}
          {user && <button 
            onClick={handleLogout} 
            className="p-2 rounded-lg hover:bg-brand-danger/10 hover:text-brand-danger transition-all hidden md:grid" 
            title="Log Out"
          >
            <LogOut size={18} />
          </button>}
        </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 gap-6 px-0 sm:px-4 md:px-6">
        
        {/* 1. Left Sidebar Navigation (Desktop) */}
        <aside className="w-60 shrink-0 sticky top-20 self-start hidden md:flex flex-col gap-6 py-5">
          {/* Main Links */}
          <nav className="flex flex-col gap-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-primary/25' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.07]'
                }`
              }
            >
              <Home size={18} />
              Home Feed
            </NavLink>

            <NavLink 
              to="/saved" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-primary/25' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.07]'
                }`
              }
            >
              <Bookmark size={18} />
              Saved Posts
            </NavLink>

            <NavLink 
              to="/notifications" 
              className={({ isActive }) => 
                `flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-primary/25' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.07]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </div>
              {unreadCount > 0 && (
                <span className="bg-brand-danger text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                  {unreadCount}
                </span>
              )}
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-primary/25' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.07]'
                }`
              }
            >
              <User size={18} />
              My Profile
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-primary/25' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/[0.07]'
                }`
              }
            >
              <Settings size={18} />
              Settings
            </NavLink>
          </nav>

          {/* Communities Header / Creator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted">
                My Communities
              </span>
              <Link 
                to="/community/create" 
                className="p-1 rounded-md text-brand-muted hover:text-brand-primary hover:bg-white/5 transition-colors"
                title="Create Community"
              >
                <Plus size={14} />
              </Link>
            </div>
            
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {communities.length === 0 ? (
                <span className="text-[11px] text-brand-muted italic px-3 py-1">No communities created</span>
              ) : (
                communities.slice(0, 5).map(comm => (
                  <Link 
                    key={comm.id} 
                    to={`/r/${comm.id}`} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors truncate font-semibold"
                  >
                    <span className="w-5 h-5 rounded bg-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-[10px]">
                      r/
                    </span>
                    {comm.name}
                  </Link>
                ))
              )}
              {communities.length > 5 && (
                <Link to="/search" className="text-[11px] text-brand-primary hover:underline px-3 py-1 font-semibold">
                  View all ({communities.length})
                </Link>
              )}
            </div>
          </div>

          {/* Connected User Card */}
          {user && <div className="mt-auto premium-card p-3 rounded-3xl flex items-center gap-3">
            <img src={profile.avatar} alt="" className="w-8 h-8 rounded-full border border-white/10" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs truncate">{profile.username}</p>
              <p className="text-[10px] text-brand-muted truncate font-medium">u/{user?.email?.split('@')[0]}</p>
            </div>
          </div>}
        </aside>

        {/* Mobile Slide-out Menu Overlay */}
        <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-72 max-w-[85vw] h-full bg-brand-bg/92 backdrop-blur-2xl border-r border-white/10 flex flex-col gap-6 p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base bg-gradient-to-r from-white to-brand-muted bg-clip-text text-transparent">
                  Navigation
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {user ? <div className="flex items-center gap-3 p-3 bg-brand-card rounded-xl border border-white/5">
                <img src={profile.avatar} alt="" className="w-9 h-9 rounded-full" />
                <div className="min-w-0">
                  <p className="font-bold text-xs">{profile.username}</p>
                  <p className="text-[10px] text-brand-muted truncate">{user?.email}</p>
                </div>
              </div> : <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="luxury-button rounded-2xl px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-white">Sign in</Link>}

              <nav className="flex flex-col gap-1" onClick={() => setMobileMenuOpen(false)}>
                <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold">
                  <Home size={18} /> Home Feed
                </NavLink>
                <NavLink to="/saved" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold">
                  <Bookmark size={18} /> Saved Posts
                </NavLink>
                <NavLink to="/notifications" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold">
                  <div className="flex items-center gap-3"><Bell size={18} /> Notifications</div>
                  {unreadCount > 0 && <span className="bg-brand-danger text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </NavLink>
                <NavLink to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold">
                  <User size={18} /> Profile
                </NavLink>
                <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold">
                  <Settings size={18} /> Settings
                </NavLink>
              </nav>

              {user && <button 
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-danger hover:bg-brand-danger/10 font-bold text-xs"
              >
                <LogOut size={18} /> Log Out
              </button>}
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* 2. Center Content Stream (Varies per page) */}
        <main className="flex-1 py-5 min-w-0 max-w-full">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <Outlet />
          </motion.div>
        </main>

        {/* 3. Right Sidebar Navigation (Desktop) */}
        <aside className="w-80 shrink-0 sticky top-20 self-start hidden lg:flex flex-col gap-6 py-5">
          
          {/* Active Profile Card */}
          {user && <div className="premium-card p-4 rounded-[1.75rem] hover:border-white/15 transition-all flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20" />
            
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-bg relative mt-8 z-10 bg-brand-card shadow-lg">
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            </div>

            <h3 className="font-extrabold text-sm mt-3">{profile.username}</h3>
            <p className="text-[10px] text-brand-muted font-medium mb-3">u/{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-brand-muted px-2 line-clamp-2">{profile.bio}</p>

            <div className="grid grid-cols-2 w-full gap-2 mt-4 pt-4 border-t border-white/5">
              <Link to="/profile" className="text-center hover:bg-white/5 p-2 rounded-xl transition-all">
                <span className="block font-black text-sm text-brand-primary">See Profile</span>
              </Link>
              <Link to="/settings" className="text-center hover:bg-white/5 p-2 rounded-xl transition-all">
                <span className="block font-black text-sm text-brand-accent">Edit settings</span>
              </Link>
            </div>
          </div>}

          {/* Popular / Trending Communities */}
          <div className="premium-card p-4 rounded-[1.75rem] flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <TrendingUp size={16} className="text-brand-primary" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted">
                Popular Communities
              </h4>
            </div>

            <div className="flex flex-col gap-3">
              {communities.length === 0 ? (
                <div className="text-xs text-brand-muted italic py-1 px-1">No communities registered yet. Get public posts by creating one.</div>
              ) : (
                communities.slice(0, 4).map(comm => (
                  <div key={comm.id} className="flex items-center justify-between gap-3 px-1">
                    <Link to={`/r/${comm.id}`} className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {comm.name.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-white truncate hover:underline hover:text-brand-primary transition-colors">
                          r/{comm.name}
                        </p>
                        <p className="text-[10px] text-brand-muted truncate font-medium">Created {new Date(comm.created_at).toLocaleDateString(undefined, {month:'short', year:'numeric'})}</p>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Communities */}
          {recentCommunities.length > 0 && (
            <div className="premium-card p-4 rounded-[1.75rem] flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <Compass size={16} className="text-brand-accent" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted">
                  Recently Visited
                </h4>
              </div>

              <div className="flex flex-col gap-2">
                {recentCommunities.map(item => (
                  <Link 
                    key={item.id} 
                    to={`/r/${item.id}`}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-colors font-semibold"
                  >
                    <span className="w-6 h-6 rounded bg-brand-card text-brand-muted border border-white/5 flex items-center justify-center text-[10px]">
                      r/
                    </span>
                    <span className="text-xs truncate text-brand-muted hover:text-white transition-colors">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <footer className="px-4 text-[10px] text-brand-muted leading-relaxed">
            <p className="font-semibold">© 2026 Nexus Community Labs.</p>
            <p className="mt-1 font-medium">React 19, Supabase, Framer Motion, and a dark-first design system.</p>
          </footer>
        </aside>
      </div>

      {/* Mobile Bottom Navigation Bar (Alternative for Mobile Screens) */}
      <nav className="sticky bottom-0 z-40 bg-brand-bg/86 backdrop-blur-2xl border-t border-white/10 py-2 px-3 grid grid-cols-5 md:hidden">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-0.5 justify-center py-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted'}`}>
          <Home size={18} />
          <span className="text-[9px] font-bold">Home</span>
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => `flex flex-col items-center gap-0.5 justify-center py-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted'}`}>
          <Bookmark size={18} />
          <span className="text-[9px] font-bold">Saved</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center gap-0.5 justify-center py-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted'}`}>
          <Search size={18} />
          <span className="text-[9px] font-bold">Search</span>
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `flex flex-col items-center gap-0.5 justify-center py-1 relative transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted'}`}>
          <Bell size={18} />
          <span className="text-[9px] font-bold">Alerts</span>
          {unreadCount > 0 && <span className="absolute top-1 right-4 w-4 h-4 bg-brand-danger text-[8px] text-white font-black flex items-center justify-center rounded-full">{unreadCount}</span>}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-0.5 justify-center py-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted'}`}>
          <User size={18} />
          <span className="text-[9px] font-bold">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default RootLayout;

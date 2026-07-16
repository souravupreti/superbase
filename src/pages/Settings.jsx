import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Moon, Sun, Save, Shuffle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  
  // Custom states
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dark mode details
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize fields
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setUsername(meta.username || user.email?.split('@')[0] || '');
    setAvatarUrl(meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || 'user'}`);
    setBio(meta.bio || '');

    // Set theme state
    const currentTheme = localStorage.getItem('theme');
    setIsDarkMode(currentTheme !== 'light');
  }, [user]);

  const handleToggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    if (newIsDark) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode activated');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode activated');
    }
  };

  const handleRandomizeAvatar = () => {
    // Pick a random DiceBear model
    const styles = ['bottts', 'lorelei', 'micah', 'shapes', 'personas', 'fun-emoji'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.floor(Math.random() * 100000);
    const newUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
    setAvatarUrl(newUrl);
    toast.success('Randomized avatar template!');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        username: username.replace(/\s+/g, ''), // remove spaces
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim()
      });
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-4 shadow-md">
        <h3 className="font-extrabold text-sm text-white">Access Denied</h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          Please authenticate your session to view and modify user settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Ribbon Title */}
      <div className="flex items-center gap-2 bg-brand-card/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted">
          User Settings
        </h2>
      </div>

      {/* Main Settings Card */}
      <div className="bg-brand-card rounded-3xl border border-white/5 p-5 md:p-6 space-y-6">
        
        {/* Theme Settings Section */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">Appearance Mode</h3>
            <p className="text-[11px] text-brand-muted">Toggle between slick dark mode and light theme layouts.</p>
          </div>
          
          <button 
            type="button" 
            onClick={handleToggleTheme}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border border-white/5"
          >
            {isDarkMode ? (
              <>
                <Sun size={15} className="text-yellow-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-brand-accent" />
                <span>Dark Theme</span>
              </>
            )}
          </button>
        </div>

        {/* Credentials Form Section */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-white pb-1 group-focus-within:text-brand-primary transition-colors">
            Profile Credentials
          </h3>
          
          {/* Avatar Preview + shuffle URL */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/3 p-4 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden bg-brand-bg shrink-0">
              <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="https://api.dicebear.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="flex-1 bg-black/25 border border-white/5 rounded-xl py-2 px-3 text-[11px] font-semibold text-white focus:outline-none focus:border-brand-primary placeholder-brand-muted transition-all"
                  disabled={loading}
                />
                
                <button 
                  type="button" 
                  onClick={handleRandomizeAvatar}
                  className="p-2 bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white rounded-xl border border-white/5 transition-all outline-none"
                  title="Randomize avatar template"
                  disabled={loading}
                >
                  <Shuffle size={14} />
                </button>
              </div>
              <p className="text-[10px] text-brand-muted leading-relaxed">
                DiceBear is used for random avatars, or paste any direct valid image URL.
              </p>
            </div>
          </div>

          {/* Username form */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Display Username
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 px-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
              placeholder="e.g. tech_wiz"
              disabled={loading}
            />
          </div>

          {/* Bio Form */}
          <div className="flex flex-col gap-1.5 font-sans">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              About Bio Description
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 px-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all leading-relaxed"
              rows={4}
              placeholder="Share details about what you build..."
              disabled={loading}
            />
          </div>

          {/* Submit Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Settings;

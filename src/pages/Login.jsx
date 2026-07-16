import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Navigate to redirect page or root feed
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all credentials');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="orbital-bg" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <span className="brand-gradient pulse-ring mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl text-lg font-black tracking-widest text-white shadow-xl shadow-brand-primary/30">
            NX
          </span>
          <div className="mb-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-accent">
            <Sparkles size={13} />
            Nexus access
          </div>
          <h2 className="font-display text-4xl font-black tracking-normal text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Log in to access your community command center
          </p>
        </div>

        {/* Login Card */}
        <div className="premium-card p-6 md:p-8 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
                  placeholder="name@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-brand-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
                  placeholder="••••••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="luxury-button w-full text-white font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Social / Registration Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-brand-muted font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-brand-primary hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error('All fields are required');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      toast.success('Registration successful! Please check your email for verification link.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to sign up');
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
            Create your space
          </div>
          <h2 className="font-display text-4xl font-black tracking-normal text-white">
            Create Account
          </h2>
          <p className="mt-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Join the community feed today
          </p>
        </div>

        {/* Register Card */}
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

            {/* Input Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))} // No spaces in usernames
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
                  placeholder="epic_coder"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
                  placeholder="Min. 6 characters"
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
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Login redirection */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-brand-muted font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-brand-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Loader2, Mail, ArrowLeft, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (error) throw error;
      setSuccess(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reset email');
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
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline mb-4">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Enter your email to receive a recovery link
          </p>
        </div>

        <div className="premium-card p-6 md:p-8 rounded-[2rem]">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-brand-success/15 text-brand-success rounded-full flex items-center justify-center mx-auto">
                <Mail size={22} className="animate-pulse" />
              </div>
              <h3 className="font-extrabold text-sm text-white">Check Your Inbox</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We have dispatched a secure password-reset link to <strong className="text-white">{email}</strong>. 
                Please proceed with the instructions inside to change your login credentials.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="luxury-button w-full text-white font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                disabled={loading || !email}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <>
                    <Key size={16} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

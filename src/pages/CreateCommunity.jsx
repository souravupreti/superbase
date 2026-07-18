import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/community';
import { Loader2, Plus, ArrowLeft, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateCommunity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    // lowercase alphanumeric characters only, matching standard subreddit slugs
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setName(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Community name is required');
      return;
    }

    if (name.length < 3) {
      toast.error('Name must be at least 3 characters');
      return;
    }

    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const comm = await communityService.createCommunity(name.trim(), description.trim(), user.id);
      toast.success(`r/${comm.name} created successfully!`);
      // Redirect to the newly created page
      navigate(`/r/${comm.id}`);
    } catch (err) {
      toast.error('Failed to create community: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-4 shadow-md">
        <h3 className="font-extrabold text-sm text-white">Login Required</h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          Please authenticate your session to register new community feeds.
        </p>
        <Link to="/login" className="inline-block bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back link */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-white font-bold transition-all">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-brand-card border border-white/5 rounded-3xl p-5 md:p-6 space-y-5 shadow-md">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-3">
          <h2 className="font-black text-sm uppercase tracking-wider text-white">
            Create Community
          </h2>
          <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
            Communities house discussions for specific topics. Choose a clean and matching name!
          </p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Community Name
            </span>
            
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted select-none">
                r/
              </span>
              <input
                type="text"
                required
                maxLength={20}
                value={name}
                onChange={handleNameChange}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-8 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all"
                placeholder="techtopics"
                disabled={loading}
              />
            </div>
            
            <p className="text-[10px] text-brand-muted">
              Names must be lowercase, alphanumeric, 3-20 characters. Spaces and symbols are automatically stripped.
            </p>
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Description / Motto
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 px-4 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary focus:bg-black/30 placeholder-brand-muted transition-all leading-relaxed"
              rows={4}
              maxLength={150}
              placeholder="e.g. A space to share code snippets, SaaS workflows, and frontend styling hacks."
              disabled={loading}
            />
            <p className="text-[10px] text-brand-muted text-right">
              {description.length}/150 characters
            </p>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-xl text-xs hover:bg-white/5 text-brand-muted border border-white/5 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-primary/10 transition-all flex items-center gap-1.5 cursor-pointer"
              disabled={loading || !name.trim()}
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Create Community
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateCommunity;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/posts';
import { communityService } from '../services/community';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/SkeletonLoader';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Image as ImageIcon, 
  Send,
  HelpCircle,
  Plus,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  MessageCircle,
  Layers3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../assets/hero.png';

const LandingShowcase = () => {
  const stats = [
    ['2.4M', 'monthly readers'],
    ['86K', 'active rooms'],
    ['14ms', 'vote feedback'],
  ];

  const features = [
    { icon: Users, title: 'Community Graph', text: 'Room discovery, member states, owner signals, and high trust participation.' },
    { icon: MessageCircle, title: 'Threaded Discussion', text: 'Nested replies, markdown-ready writing, live-feeling motion, and readable long-form posts.' },
    { icon: ShieldCheck, title: 'Identity Layer', text: 'Auth, profiles, saved posts, notifications, and settings wrapped in one premium shell.' },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-card/70 p-5 md:p-8 shadow-2xl premium-card">
      <div className="orbital-bg" />
      <div className="grid items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-accent">
            <Sparkles size={14} />
            Community OS
          </div>

          <div className="space-y-4">
            <h1 className="text-balance font-display text-4xl font-black leading-[0.95] text-white md:text-6xl">
              Build signal-rich communities without the clutter.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-brand-muted md:text-base">
              Nexus turns posts, votes, saves, notifications, profiles, and nested discussion into a polished social workspace for serious communities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="luxury-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white">
              Launch your space
              <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-white/[0.1]">
              Sign in
            </Link>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="font-display text-xl font-black text-white">{value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotateX: 10, rotateY: -12, y: 28 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative min-h-[380px] perspective-distant"
        >
          <div className="absolute inset-x-10 top-0 h-64 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-md rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-2xl card-tilt">
            <img src={heroImage} alt="" className="h-48 w-full rounded-[1.25rem] object-cover opacity-90" />
            <div className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">Live room</p>
                  <h3 className="mt-1 text-lg font-black text-white">Founders building in public</h3>
                </div>
                <div className="rounded-2xl bg-brand-success/15 px-3 py-1 text-[10px] font-black uppercase text-brand-success">Online</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Votes', 'Replies', 'Saved'].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                    <div className="font-display text-lg font-black text-white">{[924, 318, 76][index]}</div>
                    <div className="text-[10px] font-bold text-brand-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="floating absolute -left-2 bottom-8 hidden rounded-3xl border border-white/10 bg-brand-card-strong p-4 shadow-2xl backdrop-blur-xl sm:block">
            <Zap size={18} className="text-brand-accent" />
            <p className="mt-2 max-w-[10rem] text-xs font-bold text-white">Instant ranking and micro-interactions.</p>
          </div>
          <div className="floating absolute -right-1 top-12 hidden rounded-3xl border border-white/10 bg-brand-card-strong p-4 shadow-2xl backdrop-blur-xl sm:block" style={{ animationDelay: '-2s' }}>
            <Layers3 size={18} className="text-brand-secondary" />
            <p className="mt-2 max-w-[10rem] text-xs font-bold text-white">Layered glass system across every view.</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl card-tilt"
            >
              <Icon size={20} className="text-brand-accent" />
              <h3 className="mt-4 text-sm font-black text-white">{feature.title}</h3>
              <p className="mt-2 text-xs leading-6 text-brand-muted">{feature.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

const Home = () => {
  const { user } = useAuth();
  
  // Feed states
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // newest, top, trending
  
  // Post Creator states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [communities, setCommunities] = useState([]);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [showImageMock, setShowImageMock] = useState(false);

  // Load feed posts and communities
  const loadFeed = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const feedPosts = await postService.getPosts({ sortBy });
      setPosts(feedPosts);
    } catch (err) {
      toast.error('Failed to load feed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [sortBy]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const list = await communityService.getCommunities();
        setCommunities(list);
      } catch (err) {
        console.warn('Failed to load communities for selector:', err);
      }
    };
    fetchCommunities();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('A title is required to post');
      return;
    }

    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setCreatorLoading(true);
    try {
      await postService.createPost({
        title: title.trim(),
        content: content.trim(),
        userId: user.id,
        communityId: selectedCommunity || null
      });
      
      toast.success('Post published!');
      
      // Reset creator values
      setTitle('');
      setContent('');
      setSelectedCommunity('');
      setIsCreating(false);
      setShowImageMock(false);
      
      // Reload posts
      loadFeed(true);
    } catch (err) {
      toast.error('Could not publish post: ' + err.message);
    } finally {
      setCreatorLoading(false);
    }
  };

  // Local state modifiers for instant updates (optimistic deletes/edits)
  const handlePostDeletedLocal = (deletedId) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId));
  };

  const handlePostEditedLocal = (id, updatedFields) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, title: updatedFields.title, content: updatedFields.content };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-5">
      {!user && <LandingShowcase />}
      
      {/* 1. Create Post Panel (Visible when logged in) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card rounded-[1.75rem] p-4 transition-all"
        >
          {/* Closed State */}
          {!isCreating ? (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-2xl brand-gradient text-xs font-black text-white shadow-lg shadow-brand-primary/20">
                NX
              </span>
              <input 
                type="text" 
                placeholder="Create a new post in text or markdown..." 
                onClick={() => setIsCreating(true)}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-xs font-semibold focus:outline-none hover:bg-white/10 transition-all cursor-pointer placeholder-brand-muted"
                readOnly
              />
              <button 
                onClick={() => { setIsCreating(true); setShowImageMock(true); }}
                className="p-2 rounded-xl hover:bg-white/5 text-brand-muted hover:text-white transition-colors"
                title="Create Image Post"
              >
                <ImageIcon size={18} />
              </button>
            </div>
          ) : (
            // Expanded Creator State
            <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Plus size={14} className="text-brand-primary" /> Create New Post
                </h3>
  
                {/* Select Community */}
                <div className="relative flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-brand-muted">Post to:</span>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="bg-white/5 border border-white/5 rounded-xl px-2.5 py-1 text-[11px] font-bold text-brand-primary focus:outline-none focus:bg-brand-card hover:bg-white/10 transition-colors uppercase outline-none"
                  >
                    <option value="" className="text-brand-text bg-brand-card font-bold">Choose Feed</option>
                    {communities.map(comm => (
                      <option key={comm.id} value={comm.id} className="text-brand-text bg-brand-card font-bold uppercase">
                        r/{comm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title input */}
              <input 
                type="text" 
                placeholder="Title (required)" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/3 border border-white/5 rounded-2xl py-2 px-4 text-sm font-bold text-white focus:outline-none focus:border-brand-primary focus:bg-white/5 placeholder-brand-muted transition-all"
                disabled={creatorLoading}
              />

              {/* Content text */}
              <textarea 
                placeholder="Share your thoughts, codes, markdown snippet..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-white/3 border border-white/5 rounded-2xl py-2 px-4 text-xs text-white focus:outline-none focus:border-brand-primary focus:bg-white/5 placeholder-brand-muted transition-all font-mono"
                disabled={creatorLoading}
              />

              {/* Mock media placeholder if toggled */}
              {showImageMock && (
                <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center space-y-2 bg-white/[0.01]">
                  <ImageIcon className="mx-auto text-brand-muted" size={28} />
                  <p className="text-xs font-bold text-white">Attachment Mock Zone</p>
                  <p className="text-[10px] text-brand-muted max-w-xs mx-auto">
                    Image uploads store attachments dynamically in supabase buckets. (Feature visual template active)
                  </p>
                  <button 
                    type="button"
                    onClick={() => setShowImageMock(false)}
                    className="text-[10px] font-bold text-brand-danger hover:underline"
                  >
                    Remove attachment
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowImageMock(true)}
                    className="p-2 rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all text-xs flex items-center gap-1.5 font-semibold"
                    disabled={creatorLoading}
                  >
                    <ImageIcon size={16} />
                    <span className="hidden sm:inline">Add Image</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all text-xs flex items-center gap-1.5 font-semibold"
                    title="Markdown supports enabled"
                    disabled={creatorLoading}
                  >
                    <HelpCircle size={16} />
                    <span className="hidden sm:inline">Writing Help</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-bold text-brand-muted transition-all border border-white/5"
                    disabled={creatorLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-brand-primary text-white hover:bg-brand-primary/95 rounded-xl text-xs font-extrabold shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    disabled={creatorLoading || !title.trim()}
                  >
                    {creatorLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    Post
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </motion.div>
      )}

      {/* 2. Sorting Ribbon Bar */}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.045] p-2 backdrop-blur-xl">
        <div className="flex items-center gap-1">
          {/* Newest Sort */}
          <button 
            onClick={() => setSortBy('newest')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all ${
              sortBy === 'newest' 
                ? 'bg-white/8 text-white' 
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <Clock size={14} />
            Newest
          </button>
          
          {/* Top Sort */}
          <button 
            onClick={() => setSortBy('top')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all ${
              sortBy === 'top' 
                ? 'bg-white/8 text-white' 
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Top Score
          </button>
          
          {/* Trending Sort */}
          <button 
            onClick={() => setSortBy('trending')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all ${
              sortBy === 'trending' 
                ? 'bg-white/8 text-white' 
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <Flame size={14} />
            Trending
          </button>
        </div>
      </div>

      {/* 3. Feeds Container */}
      <div className="space-y-4">
        {loading ? (
          // Load skeletons
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          // Empty State
          <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-4">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-muted">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-white">Your Feed is Empty</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                No posts are currently publishable. Join communities or create the very first post using the editor card above!
              </p>
            </div>
            {user && !isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:bg-brand-primary/95 transition-all outline-none"
              >
                Publish First Post
              </button>
            )}
          </div>
        ) : (
          // Posts map list
          <AnimatePresence>
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post}
                onPostDeleted={handlePostDeletedLocal}
                onPostEdited={handlePostEditedLocal}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Home;

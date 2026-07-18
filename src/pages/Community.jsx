import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/community';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/SkeletonLoader';
import { Compass, Users, Sparkles, Plus, Loader2, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Community = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [membersCount, setMembersCount] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  const fetchCommunityDetails = async () => {
    try {
      const data = await communityService.getCommunityById(communityId);
      setCommunity(data);

      // Add to recently visited communities in localStorage
      try {
        const savedRecents = JSON.parse(localStorage.getItem('recent_communities') || '[]');
        const filtered = savedRecents.filter(item => item.id !== data.id);
        const updated = [{ id: data.id, name: data.name }, ...filtered].slice(0, 5);
        localStorage.setItem('recent_communities', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to parse recents in localStorage:', e);
      }

      // Check owner status or user join status
      if (user) {
        const memberStatus = await communityService.checkMemberStatus(data.id, user.id);
        setIsJoined(!!memberStatus);
      }

      // Fetch count of members
      const count = await communityService.getMembersCount(data.id);
      setMembersCount(count);

    } catch (err) {
      toast.error('Failed to load community details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityPosts = async () => {
    try {
      const communityPosts = await postService.getPosts({ communityId, sortBy: 'newest' });
      setPosts(communityPosts);
    } catch (err) {
      toast.error('Failed to load posts: ' + err.message);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPostsLoading(true);
    fetchCommunityDetails();
    fetchCommunityPosts();
  }, [communityId, user]);

  const handleJoinToggle = async () => {
    if (!user) {
      toast.error('Please log in to join communities');
      navigate('/login');
      return;
    }

    setJoinLoading(true);
    try {
      if (isJoined) {
        // Can't leave if they are the owner!
        if (user.id === community.owner_id) {
          toast.error('Owners cannot leave their own community!');
          return;
        }
        await communityService.leaveCommunity(community.id, user.id);
        setIsJoined(false);
        setMembersCount(prev => Math.max(0, prev - 1));
        toast.success(`You have left r/${community.name}`);
      } else {
        await communityService.joinCommunity(community.id, user.id);
        setIsJoined(true);
        setMembersCount(prev => prev + 1);
        toast.success(`You joined r/${community.name}`);
      }
    } catch (err) {
      toast.error('Action failed: ' + err.message);
    } finally {
      setJoinLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-text">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-xs text-brand-muted font-bold tracking-widest uppercase">Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-brand-card rounded-3xl border border-white/5 p-12 text-center space-y-4 shadow-md">
        <h3 className="font-extrabold text-sm text-white">Community Not Found</h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          The requested community does not exist. Browse other topics in search or build yours!
        </p>
        <Link to="/" className="inline-block bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
          Back to Feed
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === community.owner_id;

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-white font-bold transition-all">
          <ArrowLeft size={16} /> Back to Feed
        </Link>
      </div>

      {/* Community Banner details */}
      <div className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden shadow-md">
        {/* Banner mock theme color */}
        <div className="h-28 bg-brand-bg border-b border-white/5" />
        
        {/* Profile elements */}
        <div className="p-4 md:p-6 -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <span className="w-16 h-16 rounded-2xl bg-brand-primary text-white border-4 border-brand-card flex items-center justify-center font-black text-2xl shadow-xl select-none">
              {community.name.substring(0, 2).toUpperCase()}
            </span>
            <div className="pb-1.5">
              <h2 className="text-base sm:text-lg font-black text-white leading-tight uppercase">
                r/{community.name}
              </h2>
              {community.description && (
                <p className="text-[11px] md:text-xs text-brand-muted leading-relaxed mt-1 max-w-xl">
                  {community.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pb-1.5">
            {/* Owner badge */}
            {isOwner && (
              <div className="flex items-center gap-1 bg-brand-accent/15 border border-brand-accent/30 text-brand-accent font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider">
                <Shield size={12} />
                <span>Owner</span>
              </div>
            )}

            {/* Member count */}
            <div className="flex items-center gap-1 text-xs text-brand-muted font-bold">
              <Users size={14} />
              <span>{membersCount} {membersCount === 1 ? 'member' : 'members'}</span>
            </div>

            {/* Join Form button */}
            <button
              onClick={handleJoinToggle}
              disabled={joinLoading}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                isJoined 
                  ? 'bg-transparent text-brand-muted border-white/10 hover:text-brand-danger hover:border-brand-danger/25 hover:bg-brand-danger/5' 
                  : 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25'
              }`}
            >
              {joinLoading ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : isJoined ? (
                'Leave'
              ) : (
                'Join'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Community Feed block */}
      <div className="space-y-4">
        {/* ribbon */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted">
            Posts in r/{community.name}
          </h3>
          {/* Create post in community redirect */}
          {user && (
            <Link 
              to={`/?community=${community.id}`}
              className="flex items-center gap-1 text-[10px] font-extrabold text-brand-primary uppercase hover:underline"
            >
              <Plus size={12} />
              <span>Create Post Here</span>
            </Link>
          )}
        </div>

        {postsLoading ? (
          Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-muted">
              <Compass size={18} />
            </div>
            <h3 className="font-extrabold text-sm text-white">No Posts In This Community</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto">
              Be the first user to share something interesting inside r/{community.name}!
            </p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              onPostDeleted={handlePostDeletedLocal}
              onPostEdited={handlePostEditedLocal}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Community;

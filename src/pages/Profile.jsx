import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/posts';
import { communityService } from '../services/community';
import supabase from '../lib/supabase';
import PostCard from '../components/PostCard';
import { PostSkeleton, ProfileHeaderSkeleton } from '../components/SkeletonLoader';
import { getDeterministicUser } from '../utils/userHelper';
import { User, MessageSquare, Compass, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  
  // Resolve which user we are viewing (defaults to current user if parameter is empty)
  const targetUserId = userId || currentUser?.id;
  const isOwner = currentUser?.id === targetUserId;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Statistics
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [communitiesJoinedCount, setCommunitiesJoinedCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const author = getDeterministicUser(targetUserId, isOwner ? currentUser : null);

  const fetchProfileData = async () => {
    if (!targetUserId) {
      setLoading(false);
      setStatsLoading(false);
      return;
    }
    
    setLoading(true);
    setStatsLoading(true);

    try {
      // 1. Fetch user's posts
      const userPosts = await postService.getPosts({ userId: targetUserId });
      setPosts(userPosts);
      setPostsCount(userPosts.length);
      setLoading(false);

      // 2. Fetch comments count
      const { count: commsCount, error: commentsError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);
      
      if (commentsError) throw commentsError;
      setCommentsCount(commsCount || 0);

      // 3. Fetch communities joined count
      const { count: joinedCount, error: joinedError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      if (joinedError) throw joinedError;
      setCommunitiesJoinedCount(joinedCount || 0);

    } catch (err) {
      console.warn('Failed to load profile aggregates:', err);
      toast.error('Unable to fetch profile stats: ' + err.message);
    } finally {
      setStatsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [targetUserId]);

  const handlePostDeletedLocal = (deletedId) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId));
    setPostsCount(prev => Math.max(0, prev - 1));
  };

  const handlePostEditedLocal = (id, updatedFields) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, title: updatedFields.title, content: updatedFields.content };
      }
      return p;
    }));
  };

  if (!targetUserId) {
    return (
      <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-4">
        <h3 className="font-extrabold text-sm text-white">Login Required</h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          Please log in to view user profile directories or see your details.
        </p>
        <Link to="/login" className="inline-block bg-brand-primary text-white text-xs font-bold px-5 py-2 rounded-2xl shadow-md">
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button (Only shown if viewing another user) */}
      {userId && (
        <div>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-white font-bold transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      )}

      {/* User Header Profile Card */}
      {statsLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <div className="bg-brand-card border border-white/5 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-brand-primary/25 to-brand-accent/25" />
          
          <img 
            src={author.avatar} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-4 border-brand-card relative mt-10 z-10 bg-brand-bg shadow-md"
          />

          <h2 className="font-black text-lg text-white mt-4">{author.username}</h2>
          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mt-0.5">
            Member ID: u/{targetUserId.substring(0, 8)}
          </p>

          <p className="text-xs text-brand-muted text-center max-w-md mt-4 line-clamp-3 leading-relaxed px-4">
            {author.bio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-sm pt-5 mt-5 border-t border-white/5">
            <div className="flex flex-col items-center">
              <span className="font-black text-sm text-brand-primary">{postsCount}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">Posts</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="font-black text-sm text-brand-secondary">{commentsCount}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">Replies</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-black text-sm text-brand-accent">{communitiesJoinedCount}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">Groups</span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Title */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <User size={16} className="text-brand-primary" />
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted">
          {isOwner ? 'Your Postings feed' : `Recent activity by ${author.username}`}
        </h3>
      </div>

      {/* Activity posts feed list */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-muted">
              <Sparkles size={18} />
            </div>
            <h3 className="font-extrabold text-sm text-white">No Submissions Found</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto">
              This user hasn't created any posts in the community board yet.
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

export default Profile;

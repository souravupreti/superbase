import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/SkeletonLoader';
import { Bookmark, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const SavedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    if (!user) return;
    try {
      const data = await postService.getPosts({ savedByUser: user.id });
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load saved posts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

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
      {/* Header ribbon */}
      <div className="flex items-center gap-2 bg-brand-card/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <Bookmark size={18} className="text-brand-primary" />
        <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted">
          Your Saved Posts
        </h2>
      </div>

      {/* Results listing */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-muted">
              <Bookmark size={18} />
            </div>
            <h3 className="font-extrabold text-sm text-white">No Saved Posts</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto">
              You haven't bookmarked any posts yet. Click the "Save" bookmark on any post in the feeds to store it here.
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

export default SavedPosts;

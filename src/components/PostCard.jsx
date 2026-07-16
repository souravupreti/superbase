import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { voteService } from '../services/votes';
import { savedService } from '../services/saved';
import { getDeterministicUser, formatTimeAgo } from '../utils/userHelper';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Trash2, 
  Edit3,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PostCard = ({ post, onPostDeleted = null, onPostEdited = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for optimistic updates
  const [userVote, setUserVote] = useState(null); // 1, -1, or null
  const [score, setScore] = useState(post.score || 0);
  const [saved, setSaved] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // States for inline edit
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editLoading, setEditLoading] = useState(false);

  const author = getDeterministicUser(post.user_id, user);
  const isOwner = user?.id === post.user_id;

  // Load user vote & save status
  useEffect(() => {
    if (!user) return;
    
    const checkStatus = async () => {
      try {
        const [vote, isPostSaved] = await Promise.all([
          voteService.getUserVote(post.id, user.id),
          savedService.isSaved(post.id, user.id)
        ]);
        
        if (vote) setUserVote(vote.vote_type);
        setSaved(isPostSaved);
      } catch (err) {
        console.warn('Failed to load post status:', err);
      }
    };
    
    checkStatus();
  }, [post.id, user]);

  const handleVote = async (type) => {
    if (!user) {
      toast.error('Please log in to vote');
      navigate('/login');
      return;
    }

    if (votingLoading) return;

    // Save previous state for rollback
    const prevVote = userVote;
    const prevScore = score;
    
    // Optimistic UI updates
    if (type === 'up') {
      if (userVote === 1) {
        // Redo upvote
        setUserVote(null);
        setScore(prev => prev - 1);
      } else {
        // Switch/create to upvote
        setUserVote(1);
        setScore(prev => prev + (prevVote === -1 ? 2 : 1));
      }
    } else {
      if (userVote === -1) {
        // Redo downvote
        setUserVote(null);
        setScore(prev => prev + 1);
      } else {
        // Switch/create to downvote
        setUserVote(-1);
        setScore(prev => prev - (prevVote === 1 ? 2 : 1));
      }
    }

    setVotingLoading(true);

    try {
      if (type === 'up') {
        await voteService.upvotePost(post.id, user.id);
      } else {
        await voteService.downvotePost(post.id, user.id);
      }
    } catch (err) {
      // Rollback
      setUserVote(prevVote);
      setScore(prevScore);
      toast.error('Failed to register vote: ' + err.message);
    } finally {
      setVotingLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error('Please log in to save posts');
      navigate('/login');
      return;
    }

    if (saveLoading) return;
    
    const prevSaved = saved;
    setSaved(!prevSaved);
    setSaveLoading(true);

    try {
      if (prevSaved) {
        await savedService.unsavePost(post.id, user.id);
        toast.success('Post unsaved');
      } else {
        await savedService.savePost(post.id, user.id);
        toast.success('Post saved');
      }
    } catch (err) {
      setSaved(prevSaved);
      toast.error('Failed to save post: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success('Post link copied to clipboard!');
  };

  const handleDelete = async () => {
    try {
      if (onPostDeleted) {
        await onPostDeleted(post.id);
      }
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message);
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error('Post title cannot be empty');
      return;
    }
    
    setEditLoading(true);
    try {
      if (onPostEdited) {
        await onPostEdited(post.id, { title: editTitle, content: editContent });
      }
      setIsEditing(false);
      toast.success('Post updated');
    } catch (err) {
      toast.error('Failed to update post: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className="premium-card card-tilt group flex gap-4 rounded-[1.75rem] p-4 md:p-5"
    >
      {/* 1. Vote Left Section (Reddit style) */}
      <div className="flex h-fit shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-black/20 px-1.5 py-2 shadow-inner shadow-black/30">
        <motion.button 
          whileTap={{ scale: 1.25 }}
          onClick={() => handleVote('up')}
          className={`p-1 rounded-xl transition-all ${
            userVote === 1 
              ? 'text-brand-primary bg-brand-primary/10' 
              : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
          aria-label="Upvote"
        >
          <ArrowBigUp size={24} className={userVote === 1 ? 'fill-current' : ''} />
        </motion.button>
        
        <span className={`text-xs font-black select-none tracking-wide ${
          userVote === 1 
            ? 'text-brand-primary' 
            : userVote === -1 
              ? 'text-brand-danger' 
              : 'text-brand-text'
        }`}>
          {score}
        </span>

        <motion.button 
          whileTap={{ scale: 1.25 }}
          onClick={() => handleVote('down')}
          className={`p-1 rounded-xl transition-all ${
            userVote === -1 
              ? 'text-brand-danger bg-brand-danger/10' 
              : 'text-brand-muted hover:text-white hover:bg-white/5'
          }`}
          aria-label="Downvote"
        >
          <ArrowBigDown size={24} className={userVote === -1 ? 'fill-current' : ''} />
        </motion.button>
      </div>

      {/* 2. Main Content Right Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        
        {/* Post Metadata Header */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {post.community && (
            <Link 
              to={`/r/${post.community.id}`} 
              className="rounded-full border border-brand-accent/20 bg-brand-accent/10 px-2.5 py-0.5 font-bold text-brand-accent transition-colors hover:bg-brand-accent/15 truncate"
            >
              r/{post.community.name}
            </Link>
          )}
          <span className="text-brand-muted font-medium">•</span>
          <span className="text-brand-muted font-medium flex items-center gap-1">
            Posted by 
            <Link to={`/u/${post.user_id}`} className="hover:underline text-brand-text font-bold">
              {author.username}
            </Link>
          </span>
          <span className="text-brand-muted font-medium">•</span>
          <span className="text-brand-muted font-medium">{formatTimeAgo(post.created_at)}</span>
        </div>

        {/* Content Body / Inline Edit Mode */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3 mt-1">
            <input 
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-primary"
              placeholder="Title"
              disabled={editLoading}
            />
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary"
              rows={4}
              placeholder="Post content (optional)"
              disabled={editLoading}
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-xl hover:bg-white/5 text-xs font-semibold text-brand-muted border border-white/5 transition-colors"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/95 transition-all shadow-md shadow-brand-primary/20 flex items-center gap-1.5"
                disabled={editLoading}
              >
                {editLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                Save Edits
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Link to={`/post/${post.id}`} className="hover:text-brand-primary transition-colors cursor-pointer block">
              <h2 className="font-display text-base font-black leading-snug text-white md:text-lg">
                {post.title}
              </h2>
            </Link>
            
            {post.content && (
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed whitespace-pre-wrap line-clamp-4">
                {post.content}
              </p>
            )}
          </div>
        )}

        {/* Footer Actions Row */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/8 pt-2.5">
          <div className="flex items-center gap-2">
            {/* Comments Counter link */}
            <Link 
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-white/5 text-xs text-brand-muted hover:text-white transition-all font-semibold"
            >
              <MessageSquare size={16} />
              <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
            </Link>

            {/* Share link */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-white/5 text-xs text-brand-muted hover:text-white transition-all font-semibold"
              title="Copy original link"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>

            {/* Save button */}
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-white/5 text-xs transition-all font-semibold ${
                saved ? 'text-brand-primary hover:text-brand-primary/95' : 'text-brand-muted hover:text-white'
              }`}
              disabled={saveLoading}
            >
              <Bookmark size={16} className={saved ? 'fill-current' : ''} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Owner specific functions */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-brand-muted hover:text-white hover:bg-white/5 transition-all"
                title="Edit Post"
              >
                <Edit3 size={15} />
              </button>
              
              {confirmDelete ? (
                <div className="flex items-center gap-1 bg-brand-danger/10 border border-brand-danger/25 p-1 rounded-xl">
                  <button 
                    onClick={handleDelete}
                    className="px-2 py-1 bg-brand-danger text-white hover:bg-brand-danger/95 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 hover:bg-white/10 rounded-lg text-[10px] text-brand-muted font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 rounded-xl text-brand-muted hover:text-brand-danger hover:bg-brand-danger/10 transition-all font-semibold"
                  title="Delete Post"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;

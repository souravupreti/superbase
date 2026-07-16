import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/posts';
import { commentService, buildCommentTree } from '../services/comments';
import PostCard from '../components/PostCard';
import CommentNode from '../components/CommentNode';
import { CommentSkeleton } from '../components/SkeletonLoader';
import { ArrowLeft, MessageSquare, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  
  // Top level comment form state
  const [commentText, setCommentText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPostDetails = async () => {
    try {
      const data = await postService.getPostById(id);
      setPost(data);
    } catch (err) {
      toast.error('Failed to load post details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const rawComments = await commentService.getCommentsForPost(id);
      setComments(rawComments);
    } catch (err) {
      toast.error('Failed to load comments: ' + err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setCommentsLoading(true);
    fetchPostDetails();
    fetchComments();
  }, [id]);

  const handleCreateTopLevelComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    setSubmitLoading(true);
    try {
      const newComment = await commentService.createComment({
        postId: id,
        content: commentText.trim(),
        userId: user.id
      });
      toast.success('Comment posted successfully');
      setCommentText('');
      
      // Inject newly created comment locally into the flat comments array
      setComments(prev => [...prev, newComment]);
      
      // Update comment count on post locally
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
    } catch (err) {
      toast.error('Could not post comment: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddReplyLocal = async ({ postId, content, parentCommentId }) => {
    if (!user) throw new Error('Must be logged in to reply');
    
    const newReply = await commentService.createComment({
      postId,
      content,
      userId: user.id,
      parentCommentId
    });

    setComments(prev => [...prev, newReply]);
    setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
  };

  const handleEditCommentLocal = async (commentId, content) => {
    const updated = await commentService.updateComment(commentId, content);
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: updated.content } : c));
  };

  const handleDeleteCommentLocal = async (commentId) => {
    const res = await commentService.deleteComment(commentId);
    
    if (res.softDeleted) {
      // Soft deleted (changed text to [deleted] and user_id to null)
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, content: '[deleted]', user_id: null } 
          : c
      ));
    } else {
      // Hard deleted, remove from local list
      setComments(prev => prev.filter(c => c.id !== commentId));
      setPost(prev => prev ? { ...prev, commentCount: Math.max(0, prev.commentCount - 1) } : null);
    }
  };

  const handlePostEdited = (postId, updatedFields) => {
    setPost(prev => prev ? { ...prev, title: updatedFields.title, content: updatedFields.content } : null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-text">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-xs text-brand-muted font-semibold tracking-wider uppercase">Loading post details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-brand-card border border-white/5 rounded-3xl p-12 text-center space-y-4">
        <h3 className="font-extrabold text-sm text-white">Post Not Found</h3>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          The post you are trying to view does not exist or may have been deleted by the owner.
        </p>
        <Link to="/" className="inline-block bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
          Back to Feed
        </Link>
      </div>
    );
  }

  // Build comments tree mapping
  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-white font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </Link>
      </div>

      {/* Main post card */}
      <PostCard 
        post={post} 
        onPostEdited={handlePostEdited}
        onPostDeleted={() => {
          toast.success('Post deleted');
          window.history.back();
        }}
      />

      {/* Comments section card */}
      <div className="bg-brand-card border border-white/5 rounded-3xl p-4 md:p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3.5 border-b border-white/5">
          <MessageSquare size={16} className="text-brand-primary" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-brand-muted">
            Discussion ({comments.length})
          </h3>
        </div>

        {/* Comment creator */}
        {user ? (
          <form onSubmit={handleCreateTopLevelComment} className="flex flex-col gap-3 py-1">
            <textarea
              placeholder="What are your thoughts on this post? Supports markdown..."
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white/3 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-primary focus:bg-white/5 placeholder-brand-muted transition-all"
              rows={3}
              disabled={submitLoading}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-extrabold shadow-md shadow-brand-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
                disabled={submitLoading || !commentText.trim()}
              >
                {submitLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                Add Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-xs text-brand-muted">
              You must be{' '}
              <Link to="/login" className="font-extrabold text-brand-primary hover:underline">
                logged in
              </Link>{' '}
              to leave a comment.
            </p>
          </div>
        )}

        {/* Discussion items list */}
        <div className="pt-2">
          {commentsLoading ? (
            <CommentSkeleton />
          ) : comments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-brand-muted italic">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {commentTree.map(commentNode => (
                <CommentNode
                  key={commentNode.id}
                  comment={commentNode}
                  onAddReply={handleAddReplyLocal}
                  onEditComment={handleEditCommentLocal}
                  onDeleteComment={handleDeleteCommentLocal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

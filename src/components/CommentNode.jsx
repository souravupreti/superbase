import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDeterministicUser, formatTimeAgo } from '../utils/userHelper';
import { 
  CornerDownRight, 
  Trash2, 
  Edit3, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CommentNode = ({ comment, onAddReply, onDeleteComment, onEditComment }) => {
  const { user } = useAuth();
  
  // Interaction states
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [editLoading, setEditLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Author could be null if soft-deleted
  const isDeleted = !comment.user_id && comment.content === '[deleted]';
  const author = isDeleted 
    ? { username: '[deleted]', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=deleted' } 
    : getDeterministicUser(comment.user_id, user);
  const isOwner = user?.id === comment.user_id && !isDeleted;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      await onAddReply({
        postId: comment.post_id,
        content: replyText.trim(),
        parentCommentId: comment.id
      });
      setReplyText('');
      setShowReplyForm(false);
      toast.success('Reply posted!');
    } catch (err) {
      toast.error('Failed to reply: ' + err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) {
      toast.error('Comment body cannot be empty');
      return;
    }

    setEditLoading(true);
    try {
      await onEditComment(comment.id, editText.trim());
      setIsEditing(false);
      toast.success('Comment updated!');
    } catch (err) {
      toast.error('Failed to update: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteComment(comment.id);
      toast.success('Comment removed');
    } catch (err) {
      toast.error('Failed to delete comment: ' + err.message);
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-col mt-3.5 group/node">
      {/* Comment Header & Body Container */}
      <div className="flex gap-2.5">
        
        {/* Left Side: Avatar + Collapsible Line */}
        <div className="flex flex-col items-center shrink-0">
          <img 
            src={author.avatar} 
            alt="" 
            className="w-7 h-7 rounded-full border border-white/5 bg-brand-card" 
          />
          {/* Threadline */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="flex-1 w-[2px] bg-white/5 group-hover/node:bg-brand-primary/20 hover:bg-brand-primary/60 outline-none my-1 rounded cursor-pointer transition-colors"
            title={collapsed ? "Expand comment" : "Collapse comment"}
          />
        </div>

        {/* Right Side: Metadata / Text / Actions */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* Info Header */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-bold ${isDeleted ? 'text-brand-muted italic' : 'text-brand-text'}`}>
              {author.username}
            </span>
            {comment.user_id && comment.post_id && (
              // Option badge for post author mapping
              // In this prototype, we just render time ago
              null
            )}
            <span className="text-[10px] text-brand-muted font-medium">
              {formatTimeAgo(comment.created_at)}
            </span>
            {collapsed && (
              <button 
                onClick={() => setCollapsed(false)}
                className="flex items-center gap-1 text-[10px] text-brand-primary font-bold hover:underline"
              >
                <ChevronRight size={12} />
                <span>Expand thread ({comment.replies?.length || 0})</span>
              </button>
            )}
          </div>

          {/* Comment body */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-1"
              >
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="mt-1 flex flex-col gap-2">
                    <textarea 
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary"
                      rows={2}
                      disabled={editLoading}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="p-1 rounded hover:bg-white/5 text-brand-muted"
                        title="Cancel"
                        disabled={editLoading}
                      >
                        <X size={14} />
                      </button>
                      <button 
                        type="submit" 
                        className="p-1 bg-brand-primary text-white rounded hover:bg-brand-primary/95 flex items-center gap-1"
                        title="Save Changes"
                        disabled={editLoading}
                      >
                        {editLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className={`text-xs md:text-sm leading-relaxed ${isDeleted ? 'text-brand-muted italic' : 'text-brand-text'}`}>
                    {comment.content}
                  </p>
                )}

                {/* Actions row */}
                {!isEditing && (
                  <div className="flex items-center gap-3.5 mt-1.5">
                    {/* Reply Action */}
                    {user && !isDeleted && (
                      <button 
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                          showReplyForm ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'
                        }`}
                      >
                        <MessageSquare size={13} />
                        <span>Reply</span>
                      </button>
                    )}

                    {/* Owner controls */}
                    {isOwner && (
                      <>
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1 text-[11px] text-brand-muted hover:text-brand-text font-bold transition-all"
                        >
                          <Edit3 size={13} />
                        </button>
                        
                        {confirmDelete ? (
                          <div className="flex items-center gap-1.5 bg-brand-danger/10 border border-brand-danger/20 px-1.5 py-0.5 rounded-lg">
                            <button 
                              onClick={handleDelete}
                              className="text-[9px] font-extrabold text-brand-danger uppercase hover:underline"
                            >
                              Yes, Delete
                            </button>
                            <span className="text-[9px] text-brand-muted font-bold">/</span>
                            <button 
                              onClick={() => setConfirmDelete(false)}
                              className="text-[9px] font-extrabold text-brand-muted uppercase hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-1 text-[11px] text-brand-muted hover:text-brand-danger font-bold transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {showReplyForm && (
                  <form onSubmit={handleReplySubmit} className="mt-3 flex flex-col gap-2 bg-brand-card/50 p-2.5 rounded-xl border border-white/5 max-w-lg">
                    <div className="flex items-start gap-2">
                      <CornerDownRight size={14} className="text-brand-muted shrink-0 mt-1" />
                      <textarea
                        placeholder={`Reply to ${author.username}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary placeholder-brand-muted shrink-0"
                        rows={2}
                        disabled={replyLoading}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowReplyForm(false)}
                        className="px-3 py-1.5 rounded-lg font-bold text-[10px] text-brand-muted hover:bg-white/5 transition-colors border border-white/5"
                        disabled={replyLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-lg font-bold text-[10px] shadow-sm shadow-brand-primary/10 transition-colors flex items-center gap-1"
                        disabled={replyLoading || !replyText.trim()}
                      >
                        {replyLoading ? <Loader2 size={10} className="animate-spin" /> : null}
                        Post Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies Rendering */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="border-l border-white/5 pl-2.5 md:pl-3.5 space-y-1.5 mt-1.5">
                    {comment.replies.map(reply => (
                      <CommentNode 
                        key={reply.id} 
                        comment={reply}
                        onAddReply={onAddReply}
                        onDeleteComment={onDeleteComment}
                        onEditComment={onEditComment}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommentNode;

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notifications';
import { getDeterministicUser, formatTimeAgo } from '../utils/userHelper';
import { Bell, Check, Loader2, Sparkles, MessageSquare, ArrowBigUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to load notifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notif) => {
    if (notif.is_read) {
      navigate(`/post/${notif.post_id}`);
      return;
    }
    
    try {
      await notificationService.markAsRead(notif.id);
      // Update local state
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
    navigate(`/post/${notif.post_id}`);
  };

  const handleMarkAllRead = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to clear notifications: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-brand-card/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-brand-primary" />
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted">
            Notifications
          </h2>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-brand-text border border-white/5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications timeline list */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-3" />
            <p className="text-xs text-brand-muted font-bold tracking-wider uppercase">Loading Notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-brand-card rounded-3xl border border-white/5 py-12 px-6 text-center space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-muted">
              <Sparkles size={18} />
            </div>
            <h3 className="font-extrabold text-sm text-white">Inbox Clean</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto">
              You are all caught up! When other users upvote your posts, write comments, or reply to your comments, they will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map(notif => {
              const sender = getDeterministicUser(notif.sender_id, user);
              let icon = <Bell size={14} className="text-brand-primary" />;
              let text = 'interacted with your post';
              
              if (notif.type === 'upvote') {
                icon = <ArrowBigUp size={16} className="text-brand-primary fill-current" />;
                text = 'upvoted your post';
              } else if (notif.type === 'comment') {
                icon = <MessageSquare size={14} className="text-brand-secondary" />;
                text = 'commented on your post';
              } else if (notif.type === 'reply') {
                icon = <MessageSquare size={14} className="text-brand-accent" />;
                text = 'replied to your comment';
              }

              return (
                <div 
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif)}
                  className={`flex items-start gap-4 p-4 rounded-3xl border transition-all cursor-pointer ${
                    notif.is_read 
                      ? 'bg-brand-card/40 hover:bg-brand-card/65 border-white/3' 
                      : 'bg-brand-primary/5 hover:bg-brand-primary/10 border-brand-primary/20'
                  }`}
                >
                  {/* Actor image */}
                  <img src={sender.avatar} alt="" className="w-9 h-9 rounded-full border border-white/10 shrink-0 bg-brand-bg" />

                  {/* Body text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-muted">
                      <strong className="text-white font-black">{sender.username}</strong> {text}
                    </p>
                    {notif.posts && (
                      <p className="text-xs font-bold text-brand-primary truncate mt-0.5 max-w-md">
                        "{notif.posts.title}"
                      </p>
                    )}
                    {notif.comments && notif.type === 'reply' && (
                      <p className="text-[11px] text-brand-muted italic truncate mt-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        "{notif.comments.content}"
                      </p>
                    )}
                    <span className="text-[10px] text-brand-muted font-medium block mt-1.5">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>

                  {/* Mark Indicator */}
                  <div className="shrink-0 flex items-center h-full pt-1.5">
                    {icon}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

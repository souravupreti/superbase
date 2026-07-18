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
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Dropdown,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Stack,
  Textarea,
  Typography,
} from '@mui/joy';

const PostCard = ({ post, onPostDeleted = null, onPostEdited = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(post.score || 0);
  const [saved, setSaved] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editLoading, setEditLoading] = useState(false);

  const author = getDeterministicUser(post.user_id, user);
  const isOwner = user?.id === post.user_id;

  useEffect(() => {
    if (!user) return;

    const checkStatus = async () => {
      try {
        const [vote, isPostSaved] = await Promise.all([
          voteService.getUserVote(post.id, user.id),
          savedService.isSaved(post.id, user.id),
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

    const prevVote = userVote;
    const prevScore = score;

    if (type === 'up') {
      if (userVote === 1) {
        setUserVote(null);
        setScore((prev) => prev - 1);
      } else {
        setUserVote(1);
        setScore((prev) => prev + (prevVote === -1 ? 2 : 1));
      }
    } else if (userVote === -1) {
      setUserVote(null);
      setScore((prev) => prev + 1);
    } else {
      setUserVote(-1);
      setScore((prev) => prev - (prevVote === 1 ? 2 : 1));
    }

    setVotingLoading(true);

    try {
      if (type === 'up') {
        await voteService.upvotePost(post.id, user.id);
      } else {
        await voteService.downvotePost(post.id, user.id);
      }
    } catch (err) {
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
    <Card
      component={motion.article}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '16px',
        bgcolor: 'background.surface',
        borderColor: 'neutral.outlinedBorder',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          borderColor: 'primary.200',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.07)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Stack
          alignItems="center"
          spacing={0.25}
          sx={{
            width: 42,
            flexShrink: 0,
            borderRadius: '14px',
            bgcolor: 'background.level1',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            py: 0.75,
          }}
        >
          <IconButton
            size="sm"
            variant={userVote === 1 ? 'soft' : 'plain'}
            color={userVote === 1 ? 'primary' : 'neutral'}
            onClick={() => handleVote('up')}
            disabled={votingLoading}
            aria-label="Upvote"
          >
            <ArrowBigUp size={22} fill={userVote === 1 ? 'currentColor' : 'none'} />
          </IconButton>
          <Typography
            level="body-sm"
            fontWeight="xl"
            textColor={userVote === 1 ? 'primary.600' : userVote === -1 ? 'danger.600' : 'text.primary'}
          >
            {score}
          </Typography>
          <IconButton
            size="sm"
            variant={userVote === -1 ? 'soft' : 'plain'}
            color={userVote === -1 ? 'danger' : 'neutral'}
            onClick={() => handleVote('down')}
            disabled={votingLoading}
            aria-label="Downvote"
          >
            <ArrowBigDown size={22} fill={userVote === -1 ? 'currentColor' : 'none'} />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: 'wrap' }}>
              <Avatar src={author.avatar} alt={author.username} size="sm" />
              {post.community && (
                <Chip component={Link} to={`/r/${post.community.id}`} size="sm" variant="soft" color="primary">
                  r/{post.community.name}
                </Chip>
              )}
              <Typography level="body-xs" textColor="text.secondary">
                by{' '}
                <Typography component={Link} to={`/u/${post.user_id}`} level="body-xs" fontWeight="lg" textColor="text.primary">
                  {author.username}
                </Typography>
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {formatTimeAgo(post.created_at)}
              </Typography>
            </Stack>

            {isOwner && !isEditing && (
              <Dropdown>
                <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}>
                  <MoreHorizontal size={18} />
                </MenuButton>
                <Menu placement="bottom-end" size="sm">
                  <MenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 size={15} />
                    Edit
                  </MenuItem>
                  <MenuItem color="danger" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={15} />
                    Delete
                  </MenuItem>
                </Menu>
              </Dropdown>
            )}
          </Stack>

          {isEditing ? (
            <Box component="form" onSubmit={handleSaveEdit} sx={{ mt: 1.5 }}>
              <Stack spacing={1.25}>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  disabled={editLoading}
                  autoFocus
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  minRows={4}
                  placeholder="Post content (optional)"
                  disabled={editLoading}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button type="button" variant="plain" color="neutral" onClick={() => setIsEditing(false)} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="solid" color="primary" disabled={editLoading} startDecorator={editLoading ? <Loader2 size={14} className="animate-spin" /> : null}>
                    Save Edits
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
              <Typography
                component={Link}
                to={`/post/${post.id}`}
                level="title-lg"
                fontWeight="xl"
                sx={{
                  display: 'block',
                  lineHeight: 1.28,
                  color: 'text.primary',
                  '&:hover': { color: 'primary.600' },
                }}
              >
                {post.title}
              </Typography>
              {post.content && (
                <Typography
                  level="body-sm"
                  textColor="text.secondary"
                  sx={{ mt: 0.75, whiteSpace: 'pre-wrap', lineHeight: 1.65 }}
                  className="line-clamp-4"
                >
                  {post.content}
                </Typography>
              )}
            </Box>
          )}

          {confirmDelete && (
            <Sheet variant="soft" color="danger" sx={{ mt: 1.5, p: 1.25, borderRadius: '12px' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Typography level="body-sm" fontWeight="lg">
                  Delete this post?
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="sm" variant="plain" color="neutral" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="solid" color="danger" onClick={handleDelete}>
                    Confirm Delete
                  </Button>
                </Stack>
              </Stack>
            </Sheet>
          )}

          <Divider sx={{ my: 1.75 }} />

          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
            <Button component={Link} to={`/post/${post.id}`} size="sm" variant="plain" color="neutral" startDecorator={<MessageSquare size={16} />}>
              {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
            </Button>
            <Button size="sm" variant="plain" color="neutral" onClick={handleShare} startDecorator={<Share2 size={16} />}>
              Share
            </Button>
            <Button
              size="sm"
              variant="plain"
              color={saved ? 'primary' : 'neutral'}
              onClick={handleSaveToggle}
              disabled={saveLoading}
              startDecorator={<Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default PostCard;

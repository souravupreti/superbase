import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/posts';
import { communityService } from '../services/community';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/SkeletonLoader';
import {
  Flame,
  Clock,
  Image as ImageIcon,
  Send,
  HelpCircle,
  Plus,
  Loader2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Option,
  Select,
  Sheet,
  Stack,
  Tab,
  TabList,
  Tabs,
  Textarea,
  Typography,
  Input,
} from '@mui/joy';

const Home = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [communities, setCommunities] = useState([]);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [showImageMock, setShowImageMock] = useState(false);

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
        communityId: selectedCommunity || null,
      });

      toast.success('Post published!');

      setTitle('');
      setContent('');
      setSelectedCommunity('');
      setIsCreating(false);
      setShowImageMock(false);

      loadFeed(true);
    } catch (err) {
      toast.error('Could not publish post: ' + err.message);
    } finally {
      setCreatorLoading(false);
    }
  };

  const handlePostDeletedLocal = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const handlePostEditedLocal = (id, updatedFields) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, title: updatedFields.title, content: updatedFields.content } : p)));
  };

  return (
    <Stack spacing={2.5}>
      {!user && (
        <Sheet variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', bgcolor: 'background.surface' }}>
          <Stack spacing={1.5}>
            <Chip size="sm" variant="soft" color="primary" startDecorator={<MessageSquare size={14} />} sx={{ alignSelf: 'flex-start' }}>
              Professional Community
            </Chip>
            <Typography level="h2" fontWeight="xl">
              Focused discussions, organized professionally.
            </Typography>
            <Typography level="body-md" textColor="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7 }}>
              Read posts, follow communities, save useful threads, and participate in thoughtful discussions.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/register" color="primary">
                Create account
              </Button>
              <Button component={Link} to="/login" variant="soft" color="neutral">
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      )}

      {user && (
        <Card variant="outlined" sx={{ p: 2.25, borderRadius: '16px', bgcolor: 'background.surface', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}>
          {!isCreating ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar size="sm">{user.email?.[0]?.toUpperCase() || 'U'}</Avatar>
              <Input
                readOnly
                value=""
                placeholder="Start a discussion"
                onClick={() => setIsCreating(true)}
                sx={{ flex: 1, cursor: 'pointer', bgcolor: 'background.level1' }}
              />
              <Button
                variant="plain"
                color="neutral"
                onClick={() => {
                  setIsCreating(true);
                  setShowImageMock(true);
                }}
                startDecorator={<ImageIcon size={17} />}
              >
                Media
              </Button>
            </Stack>
          ) : (
            <Box component="form" onSubmit={handleCreatePost}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Plus size={16} />
                    <Typography level="title-sm" fontWeight="xl">
                      Create Post
                    </Typography>
                  </Stack>
                  <Select
                    size="sm"
                    placeholder="Choose community"
                    value={selectedCommunity}
                    onChange={(_, value) => setSelectedCommunity(value || '')}
                    sx={{ minWidth: 190 }}
                  >
                    <Option value="">Main feed</Option>
                    {communities.map((comm) => (
                      <Option key={comm.id} value={comm.id}>
                        r/{comm.name}
                      </Option>
                    ))}
                  </Select>
                </Stack>

                <Input
                  placeholder="Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={creatorLoading}
                />
                <Textarea
                  placeholder="What do you want to discuss?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  minRows={4}
                  disabled={creatorLoading}
                />

                {showImageMock && (
                  <Sheet variant="soft" sx={{ p: 2, borderRadius: '14px', textAlign: 'center' }}>
                    <Stack spacing={1} alignItems="center">
                      <ImageIcon size={24} />
                      <Typography level="body-sm" fontWeight="lg">
                        Attachment area
                      </Typography>
                      <Button type="button" size="sm" variant="plain" color="danger" onClick={() => setShowImageMock(false)}>
                        Remove attachment
                      </Button>
                    </Stack>
                  </Sheet>
                )}

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Stack direction="row" spacing={0.5}>
                    <Button type="button" size="sm" variant="plain" color="neutral" onClick={() => setShowImageMock(true)} startDecorator={<ImageIcon size={16} />} disabled={creatorLoading}>
                      Image
                    </Button>
                    <Button type="button" size="sm" variant="plain" color="neutral" startDecorator={<HelpCircle size={16} />} disabled={creatorLoading}>
                      Help
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button type="button" variant="plain" color="neutral" onClick={() => setIsCreating(false)} disabled={creatorLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={creatorLoading || !title.trim()} startDecorator={creatorLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}>
                      Post
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          )}
        </Card>
      )}

      <Sheet variant="outlined" sx={{ p: 0.75, borderRadius: '14px', bgcolor: 'background.surface' }}>
        <Tabs value={sortBy} onChange={(_, value) => setSortBy(value)} sx={{ bgcolor: 'transparent' }}>
          <TabList disableUnderline sx={{ gap: 0.5, bgcolor: 'transparent' }}>
            <Tab value="newest" indicatorInset startDecorator={<Clock size={15} />}>
              Newest
            </Tab>
            <Tab value="top" indicatorInset startDecorator={<Sparkles size={15} />}>
              Top
            </Tab>
            <Tab value="trending" indicatorInset startDecorator={<Flame size={15} />}>
              Trending
            </Tab>
          </TabList>
        </Tabs>
      </Sheet>

      <Stack spacing={2}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <Sheet variant="outlined" sx={{ py: 7, px: 3, borderRadius: '16px', textAlign: 'center', bgcolor: 'background.surface' }}>
            <Sparkles size={24} color="var(--joy-palette-text-tertiary)" />
            <Typography level="title-md" fontWeight="xl" sx={{ mt: 1.5 }}>
              Your feed is empty
            </Typography>
            <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
              Create the first post or join a community to get the conversation started.
            </Typography>
            {user && !isCreating && (
              <Button onClick={() => setIsCreating(true)} sx={{ mt: 2 }}>
                Publish First Post
              </Button>
            )}
          </Sheet>
        ) : (
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeletedLocal}
                onPostEdited={handlePostEditedLocal}
              />
            ))}
          </AnimatePresence>
        )}
      </Stack>
    </Stack>
  );
};

export default Home;

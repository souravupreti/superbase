import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notifications';
import { communityService } from '../services/community';
import { getDeterministicUser } from '../utils/userHelper';
import {
  Home,
  Bookmark,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  TrendingUp,
  Compass,
  Menu,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Dropdown,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Menu as JoyMenu,
  MenuButton,
  MenuItem,
  Sheet,
  Stack,
  Typography,
} from '@mui/joy';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/notifications', label: 'Notifications', icon: Bell, notifications: true },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const navButtonSx = {
  borderRadius: '12px',
  minHeight: 40,
  px: 1.5,
  color: 'text.secondary',
  bgcolor: 'transparent',
  fontWeight: 700,
  '&:hover': {
    bgcolor: 'neutral.softBg',
    color: 'text.primary',
  },
  '&.active': {
    color: 'primary.700',
    bgcolor: 'primary.50',
  },
  '&.active:hover': {
    color: 'primary.700',
    bgcolor: 'primary.100',
  },
  '[data-joy-color-scheme="dark"] &': {
    color: 'text.secondary',
  },
  '[data-joy-color-scheme="dark"] &.active': {
    bgcolor: 'rgba(96, 165, 250, 0.14)',
    color: 'primary.500',
  },
};

const BrandMark = () => (
  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <Sheet
      variant="solid"
      color="primary"
      sx={{
        width: 40,
        height: 40,
        borderRadius: '12px',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: 0,
        boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)',
      }}
    >
      AG
    </Sheet>
    <Typography level="title-lg" fontWeight="xl" sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.01em' }}>
      Agora
    </Typography>
  </Link>
);

const SidebarNav = ({ unreadCount, onNavigate }) => (
  <List size="sm" sx={{ '--ListItem-radius': '12px', gap: 0.5 }}>
    {navItems.map(({ to, label, icon: Icon, notifications }) => (
      <ListItem key={to}>
        <ListItemButton component={NavLink} to={to} onClick={onNavigate} sx={navButtonSx}>
          <Icon size={18} />
          <ListItemContent>{label}</ListItemContent>
          {notifications && unreadCount > 0 && (
            <Chip size="sm" color="danger" variant="solid">
              {unreadCount}
            </Chip>
          )}
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

const RootLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentCommunities, setRecentCommunities] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (err) {
        console.warn('Failed to fetch unread count:', err);
      }
    };

    const fetchCommunities = async () => {
      try {
        const list = await communityService.getCommunities();
        setCommunities(list);
      } catch (err) {
        console.warn('Failed to fetch communities:', err);
      }
    };

    fetchUnreadCount();
    fetchCommunities();

    const interval = setInterval(fetchUnreadCount, 30000);

    try {
      const savedRecents = JSON.parse(localStorage.getItem('recent_communities') || '[]');
      setRecentCommunities(savedRecents);
    } catch (e) {
      console.warn('Failed to load recent communities from localStorage:', e);
    }

    return () => clearInterval(interval);
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error('Failed to log out: ' + err.message);
    }
  };

  const profile = getDeterministicUser(user?.id, user);

  return (
    <Sheet sx={{ minHeight: '100vh', bgcolor: 'background.body', color: 'text.primary' }}>
      <Sheet
        component="header"
        variant="outlined"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderInline: 0,
          borderTop: 0,
          bgcolor: 'background.surface',
          borderColor: 'neutral.outlinedBorder',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 64,
            px: { xs: 2, md: 4 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton
            variant="plain"
            color="neutral"
            sx={{ display: { md: 'none' } }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </IconButton>

          <BrandMark />

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flex: '1 1 520px',
              maxWidth: 700,
              ml: { xs: 0, md: 3 },
              mr: { xs: 0, md: 2 },
            }}
          >
            <Input
              size="md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, communities, people"
              startDecorator={<Search size={17} />}
              sx={{
                bgcolor: 'background.level1',
                borderColor: 'neutral.outlinedBorder',
                borderRadius: '14px',
                boxShadow: 'inset 0 1px 0 rgba(15, 23, 42, 0.02)',
                '&:focus-within': {
                  bgcolor: 'background.surface',
                  borderColor: 'primary.300',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.10)',
                },
              }}
            />
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 'auto', flexShrink: 0 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/community/create"
                  size="sm"
                  color="primary"
                  startDecorator={<Plus size={16} />}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '12px', fontWeight: 700 }}
                >
                  Create
                </Button>
                <IconButton component={Link} to="/notifications" variant="plain" color="neutral" aria-label="Notifications">
                  <Badge badgeContent={unreadCount || null} color="danger" size="sm">
                    <Bell size={19} />
                  </Badge>
                </IconButton>
                <Dropdown>
                  <MenuButton
                    slots={{ root: Button }}
                    slotProps={{
                      root: {
                        variant: 'plain',
                        color: 'neutral',
                        size: 'sm',
                        sx: { p: 0.5, borderRadius: '14px', minHeight: 38 },
                        endDecorator: <ChevronDown size={14} />,
                      },
                    }}
                  >
                    <Avatar src={profile.avatar} alt={profile.username} size="sm" />
                  </MenuButton>
                  <JoyMenu placement="bottom-end" size="sm" sx={{ minWidth: 190, borderRadius: '14px', p: 0.75 }}>
                    <MenuItem component={Link} to="/profile">
                      <User size={16} />
                      Profile
                    </MenuItem>
                    <MenuItem component={Link} to="/settings">
                      <Settings size={16} />
                      Settings
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem color="danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      Log out
                    </MenuItem>
                  </JoyMenu>
                </Dropdown>
              </>
            ) : (
              <Button component={Link} to="/login" size="sm" variant="solid" color="primary">
                Sign in
              </Button>
            )}
          </Stack>
        </Box>
      </Sheet>

      <Box sx={{ mx: 'auto', maxWidth: 1280, display: 'flex', gap: 3, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          component="aside"
          sx={{
            width: 240,
            flexShrink: 0,
            py: 3,
            display: { xs: 'none', md: 'block' },
            position: 'sticky',
            top: 64,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={3}>
            <SidebarNav unreadCount={unreadCount} />

            <Divider />

            <Stack spacing={1.25}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
                <Typography level="body-xs" fontWeight="xl" textColor="text.tertiary">
                  COMMUNITIES
                </Typography>
                <IconButton component={Link} to="/community/create" size="sm" variant="plain" color="neutral" aria-label="Create community">
                  <Plus size={15} />
                </IconButton>
              </Stack>

              <List size="sm" sx={{ '--ListItem-radius': '12px', gap: 0.5 }}>
                {communities.length === 0 ? (
                  <Typography level="body-xs" textColor="text.tertiary" sx={{ px: 1.5, py: 1 }}>
                    No communities yet
                  </Typography>
                ) : (
                  communities.slice(0, 6).map((comm) => (
                    <ListItem key={comm.id}>
                      <ListItemButton
                        component={Link}
                        to={`/r/${comm.id}`}
                        sx={{ borderRadius: '12px', minHeight: 42, '&:hover': { bgcolor: 'background.level1' } }}
                      >
                        <Avatar size="sm" variant="soft" color="primary">
                          {comm.name.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <ListItemContent>
                          <Typography level="body-sm" fontWeight="lg" noWrap>
                            r/{comm.name}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            </Stack>
          </Stack>
        </Box>

        <Box component="main" sx={{ flex: 1, minWidth: 0, py: { xs: 2, md: 3 }, maxWidth: { xs: '100%', lg: 680 } }}>
          <Outlet />
        </Box>

        <Box
          component="aside"
          sx={{
            width: 300,
            flexShrink: 0,
            py: 3,
            display: { xs: 'none', lg: 'block' },
            position: 'sticky',
            top: 64,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2}>
            {user && (
              <Sheet
                variant="outlined"
                sx={{
                  p: 2.25,
                  borderRadius: '16px',
                  bgcolor: 'background.surface',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={profile.avatar} alt={profile.username} size="lg" />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography level="title-sm" fontWeight="xl" noWrap>
                      {profile.username}
                    </Typography>
                    <Typography level="body-xs" textColor="text.tertiary" noWrap>
                      {user?.email}
                    </Typography>
                  </Box>
                </Stack>
                <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 1.5 }}>
                  {profile.bio}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2.25 }}>
                  <Button component={Link} to="/profile" size="sm" variant="soft" color="neutral" fullWidth>
                    Profile
                  </Button>
                  <Button component={Link} to="/settings" size="sm" variant="soft" color="neutral" fullWidth>
                    Settings
                  </Button>
                </Stack>
              </Sheet>
            )}

            <Sheet
              variant="outlined"
              sx={{
                p: 2.25,
                borderRadius: '16px',
                bgcolor: 'background.surface',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.035)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <TrendingUp size={16} color="var(--joy-palette-primary-500)" />
                <Typography level="title-sm" fontWeight="xl">
                  Popular Communities
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {communities.length === 0 ? (
                  <Typography level="body-sm" textColor="text.secondary">
                    Create the first community to start the feed.
                  </Typography>
                ) : (
                  communities.slice(0, 4).map((comm) => (
                    <Stack
                      key={comm.id}
                      component={Link}
                      to={`/r/${comm.id}`}
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      sx={{ p: 0.75, mx: -0.75, borderRadius: '12px', '&:hover': { bgcolor: 'background.level1' } }}
                    >
                      <Avatar size="sm" variant="soft" color="primary">
                        {comm.name.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography level="body-sm" fontWeight="lg" noWrap>
                          r/{comm.name}
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary" noWrap>
                          Created {new Date(comm.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </Typography>
                      </Box>
                    </Stack>
                  ))
                )}
              </Stack>
            </Sheet>

            {recentCommunities.length > 0 && (
              <Sheet variant="outlined" sx={{ p: 2.25, borderRadius: '16px', bgcolor: 'background.surface' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <Compass size={16} color="var(--joy-palette-text-secondary)" />
                  <Typography level="title-sm" fontWeight="xl">
                    Recent
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  {recentCommunities.map((item) => (
                    <Typography key={item.id} component={Link} to={`/r/${item.id}`} level="body-sm" textColor="text.secondary" noWrap>
                      r/{item.name}
                    </Typography>
                  ))}
                </Stack>
              </Sheet>
            )}
          </Stack>
        </Box>
      </Box>

      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} size="sm">
        <Sheet sx={{ height: '100%', p: 2, bgcolor: 'background.surface' }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <BrandMark />
              <IconButton variant="plain" color="neutral" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation">
                <Menu size={20} />
              </IconButton>
            </Stack>
            {user && (
              <Sheet variant="soft" sx={{ p: 1.5, borderRadius: '14px' }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar src={profile.avatar} alt={profile.username} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography level="title-sm" noWrap>{profile.username}</Typography>
                    <Typography level="body-xs" textColor="text.tertiary" noWrap>{user.email}</Typography>
                  </Box>
                </Stack>
              </Sheet>
            )}
            <SidebarNav unreadCount={unreadCount} onNavigate={() => setMobileMenuOpen(false)} />
            {user && (
              <Button onClick={handleLogout} variant="plain" color="danger" startDecorator={<LogOut size={17} />} sx={{ justifyContent: 'flex-start' }}>
                Log out
              </Button>
            )}
          </Stack>
        </Sheet>
      </Drawer>

      <Sheet
        component="nav"
        variant="outlined"
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 35,
          display: { xs: 'grid', md: 'none' },
          gridTemplateColumns: 'repeat(5, 1fr)',
          borderInline: 0,
          borderBottom: 0,
          bgcolor: 'background.surface',
          px: 0.75,
          py: 0.75,
        }}
      >
        {navItems.map(({ to, label, icon: Icon, notifications }) => (
          <IconButton
            key={to}
            component={NavLink}
            to={to}
            variant="plain"
            color="neutral"
            sx={{
              minHeight: 46,
              flexDirection: 'column',
              gap: 0.25,
              color: 'text.secondary',
              '&.active': {
                color: 'primary.600',
              },
            }}
          >
            <Badge badgeContent={notifications ? unreadCount || null : null} color="danger" size="sm">
              <Icon size={18} />
            </Badge>
            <Typography level="body-xs" fontWeight="lg">
              {label === 'Notifications' ? 'Alerts' : label}
            </Typography>
          </IconButton>
        ))}
      </Sheet>
    </Sheet>
  );
};

export default RootLayout;

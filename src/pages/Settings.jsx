import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Moon, Sun, Save, Shuffle, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Stack,
  Switch,
  Textarea,
  Typography,
} from '@mui/joy';

const Settings = () => {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setUsername(meta.username || user.email?.split('@')[0] || '');
    setAvatarUrl(meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || 'user'}`);
    setBio(meta.bio || '');

    const currentTheme = localStorage.getItem('theme');
    setIsDarkMode(currentTheme !== 'light');
  }, [user]);

  const handleToggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    if (newIsDark) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode activated');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode activated');
    }
  };

  const handleRandomizeAvatar = () => {
    const styles = ['bottts', 'lorelei', 'micah', 'shapes', 'personas', 'fun-emoji'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.floor(Math.random() * 100000);
    const newUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
    setAvatarUrl(newUrl);
    toast.success('Randomized avatar template!');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        username: username.replace(/\s+/g, ''),
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim(),
      });
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Sheet variant="outlined" sx={{ py: 7, px: 3, borderRadius: '16px', textAlign: 'center', bgcolor: 'background.surface' }}>
        <Typography level="title-md" fontWeight="xl">
          Access Denied
        </Typography>
        <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
          Please authenticate your session to view and modify user settings.
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography level="h2" fontWeight="xl">
          Settings
        </Typography>
        <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
          Manage your profile, avatar, and appearance preferences.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ p: 0, overflow: 'hidden', borderRadius: '16px', bgcolor: 'background.surface', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ p: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Sheet variant="soft" color="primary" sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </Sheet>
            <Box>
              <Typography level="title-sm" fontWeight="xl">
                Appearance
              </Typography>
              <Typography level="body-sm" textColor="text.secondary">
                Follow your preferred light or dark workspace.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography level="body-sm" textColor="text.secondary">
              {isDarkMode ? 'Dark' : 'Light'}
            </Typography>
            <Switch checked={isDarkMode} onChange={handleToggleTheme} color="primary" />
          </Stack>
        </Stack>

        <Divider />

        <Box component="form" onSubmit={handleUpdate} sx={{ p: 2.5 }}>
          <Stack spacing={2.25}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Sheet variant="soft" color="neutral" sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <UserRound size={18} />
              </Sheet>
              <Box>
                <Typography level="title-sm" fontWeight="xl">
                  Profile
                </Typography>
                <Typography level="body-sm" textColor="text.secondary">
                  This information appears across posts and comments.
                </Typography>
              </Box>
            </Stack>

            <Sheet variant="soft" sx={{ p: 2, borderRadius: '14px' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Avatar src={avatarUrl} alt="Preview Avatar" sx={{ width: 64, height: 64 }} />
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel>Avatar URL</FormLabel>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://api.dicebear.com/..."
                    disabled={loading}
                    endDecorator={
                      <IconButton type="button" variant="plain" color="neutral" onClick={handleRandomizeAvatar} disabled={loading} aria-label="Randomize avatar">
                        <Shuffle size={16} />
                      </IconButton>
                    }
                  />
                  <FormHelperText>Paste a direct image URL or randomize a DiceBear avatar.</FormHelperText>
                </FormControl>
              </Stack>
            </Sheet>

            <FormControl required>
              <FormLabel>Display Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tech_wiz"
                disabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                minRows={4}
                placeholder="Share details about what you build..."
                disabled={loading}
              />
            </FormControl>

            <Button
              type="submit"
              color="primary"
              disabled={loading}
              startDecorator={loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' } }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
};

export default Settings;

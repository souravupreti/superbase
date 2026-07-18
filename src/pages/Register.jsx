import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Box, Divider, Sheet, Stack, Typography } from '@mui/joy';
import { Button } from '../design-system/components/Button';
import { Input, PasswordInput } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';
import { NexusIcon } from '../design-system/components/Icon';

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error('All fields are required');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      toast.success('Registration successful! Please check your email for verification link.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.body',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        <Card variant="elevated" padding="lg">
          <Stack spacing={3}>
            <Stack spacing={1} alignItems="center">
              <NexusIcon size="xl" sx={{ color: 'primary.500' }} />
              <Typography level="h2" fontWeight="xl">
                Create Account
              </Typography>
              <Typography level="body-sm" textAlign="center" textColor="text.secondary">
                Create an account to join focused professional communities.
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startDecorator={<Mail size={18} />}
                  required
                  disabled={loading}
                />
                <Input
                  label="Username"
                  placeholder="tech_wiz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                  startDecorator={<User size={18} />}
                  required
                  disabled={loading}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button type="submit" loading={loading} fullWidth size="lg" startIcon={<UserPlus size={18} />}>
                  Sign Up
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Stack spacing={2} alignItems="center">
              <Typography level="body-sm" textColor="text.secondary">
                Already have an account?
              </Typography>
              <Button component={Link} to="/login" variant="ghost" fullWidth>
                Log In
              </Button>
            </Stack>
          </Stack>
        </Card>
      </motion.div>
    </Sheet>
  );
};

export default Register;

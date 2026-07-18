import { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Mail, ArrowLeft, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Box, Sheet, Stack, Typography } from '@mui/joy';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (error) throw error;
      setSuccess(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.body' }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        <Card variant="elevated" padding="lg">
          <Stack spacing={3}>
            <Stack spacing={1} alignItems="center">
              <Typography component={Link} to="/login" level="body-sm" color="primary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, textDecoration: 'none', fontWeight: 700 }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Typography>
              <Typography level="h2" fontWeight="xl">
                Reset Password
              </Typography>
              <Typography level="body-sm" textAlign="center" textColor="text.secondary">
                Enter your email to receive a recovery link.
              </Typography>
            </Stack>

            {success ? (
              <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 1 }}>
                <Sheet variant="soft" color="success" sx={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                  <Mail size={22} />
                </Sheet>
                <Typography level="title-md" fontWeight="xl">
                  Check Your Inbox
                </Typography>
                <Typography level="body-sm" textColor="text.secondary">
                  We sent a secure password-reset link to <Typography fontWeight="lg">{email}</Typography>.
                </Typography>
              </Stack>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    startDecorator={<Mail size={18} />}
                    disabled={loading}
                  />
                  <Button type="submit" loading={loading} fullWidth size="lg" startIcon={<Key size={18} />} disabled={!email}>
                    Send Reset Link
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Card>
      </motion.div>
    </Sheet>
  );
};

export default ForgotPassword;

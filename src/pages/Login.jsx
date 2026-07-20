import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Box,
  Stack,
  Typography,
  Sheet,
  Divider,
} from "@mui/joy";

import {
  Mail,
  LogIn,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

import { Button } from "../design-system/components/Button";
import {
  Input,
  PasswordInput,
} from "../design-system/components/Input";
import { Card } from "../design-system/components/Card";
import { NexusIcon } from "../design-system/components/Icon";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Navigate to redirect page or root feed
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter all credentials");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      toast.success("Logged in successfully!");

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      toast.error(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Sheet
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 3,
      bgcolor: "background.body",
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        width: "100%",
        maxWidth: 460,
      }}
    >
      <Card variant="elevated" padding="lg">
        <Stack spacing={3}>
          {/* Logo */}

          <Stack
            spacing={1}
            alignItems="center"
          >
            <NexusIcon
              size="xl"
              sx={{
                color: "primary.500",
              }}
            />

            <Typography
              level="h2"
              fontWeight="lg"
            >
              Welcome Back
            </Typography>

            <Typography
              level="body-sm"
              textAlign="center"
              color="neutral"
            >
              Log in to continue to your account.
            </Typography>
          </Stack>

          {/* Form */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              <Input
                label="Email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startDecorator={<Mail size={18} />}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Box
                display="flex"
                justifyContent="flex-end"
              >
                <Typography
                  component={Link}
                  to="/forgot-password"
                  level="body-sm"
                  color="primary"
                  sx={{
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                startIcon={<LogIn size={18} />}
              >
                Log In
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Stack
            spacing={2}
            alignItems="center"
          >
            <Typography
              level="body-sm"
              color="neutral"
            >
              Don't have an account?
            </Typography>

            <Button
              component={Link}
              to="/register"
              variant="ghost"
              fullWidth
            >
              Create Account
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Typography
        level="body-xs"
        textAlign="center"
        sx={{
          mt: 3,
          color: "text.tertiary",
        }}
      >
        © {new Date().getFullYear()} Agora · Community
      </Typography>
    </motion.div>
  </Sheet>
);
};

export default Login;

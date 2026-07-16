import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  refreshUser: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, freshSession) => {
      setSession(freshSession);
      setUser(freshSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setLoading(false);
      throw error;
    }
    
    setSession(data.session);
    setUser(data.user);
    setLoading(false);
    return data;
  };

  const signUp = async (email, password, username) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username.trim())}`,
          bio: 'Hey there! I am new here.'
        }
      }
    });

    if (error) {
      setLoading(false);
      throw error;
    }
    
    setSession(data.session);
    setUser(data.user);
    setLoading(false);
    return data;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setSession(null);
    setUser(null);
    setLoading(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async ({ username, avatarUrl, bio }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        username: username?.trim(),
        avatar_url: avatarUrl?.trim(),
        bio: bio?.trim()
      }
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const refreshUser = async () => {
    const { data: { user: freshUser }, error } = await supabase.auth.getUser();
    if (error) throw error;
    setUser(freshUser);
  };

  const value = {
    user,
    session,
    loading,
    login,
    signUp,
    logout,
    updateProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

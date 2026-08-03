import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../api/authAPI';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify({
      id: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
    }));
    setUser({ id: data.userId, username: data.username, email: data.email, role: data.role });
  };

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      saveSession(res.data.data);
      toast.success(`Welcome, ${res.data.data.username}! 🏆`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      saveSession(res.data.data);
      toast.success(`Welcome back, ${res.data.data.username}! 🔥`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    toast('Logged out. See you on the track! 👋', { icon: '🏃' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

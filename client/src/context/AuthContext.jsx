import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // পেজ লোড হলে চেক করা যে ইউজার ইতিমধ্যে লগইন আছে কি না
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // লগইন ফাংশন
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success(res.data.message || 'Logged in successfully!');
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // রেজিস্ট্রেশন ফাংশন
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success(res.data.message || 'Account created successfully!');
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // লগআউট ফাংশন
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore server errors during logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. Initialize user from localStorage safely
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);

  // 2. Check token validity on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error("Session expired or invalid. Clearing tokens.");
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false); 
    };
    
    initAuth();
  }, []);

  // 3. Multi-tab Logout Synchronization
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'access' && event.newValue === null) {
        setUser(null);
        // .replace() is better than .href because it doesn't leave a broken "back" button trail
        window.location.replace('/login');
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  // 4. Login Function (Memoized)
  const login = useCallback(async (email, password) => {
    // Await the tokens
    const tokenRes = await authAPI.login({ email, password });
    localStorage.setItem('access', tokenRes.data.access);
    localStorage.setItem('refresh', tokenRes.data.refresh);

    // Fetch user details with the newly set tokens
    const userRes = await authAPI.getMe();
    setUser(userRes.data);
    localStorage.setItem('user', JSON.stringify(userRes.data));

    return userRes.data; 
  }, []);

  // 5. Logout Function (Memoized)
  const logout = useCallback(() => {
    // Clear all credentials
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    // Clear React state
    setUser(null);
    
    // Instantly redirect and replace history so they can't click "back" to a protected page
    window.location.replace('/login'); 
  }, []);

  // 6. Bulletproof Role Checkers (Memoized)
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return user.is_superuser === true || user.role?.toLowerCase() === 'admin';
  }, [user]);

  const isMember = useCallback(() => {
    if (!user) return false;
    if (user.is_superuser === true) return true; 
    
    const validRoles = ['admin', 'executive', 'junior_executive', 'member'];
    return validRoles.includes(user.role?.toLowerCase());
  }, [user]);

  // 7. Memoize the context value to prevent unnecessary app-wide re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading,
    login,
    logout,
    isAdmin,
    isMember
  }), [user, loading, login, logout, isAdmin, isMember]);

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div className="flex h-screen items-center justify-center bg-base-100">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
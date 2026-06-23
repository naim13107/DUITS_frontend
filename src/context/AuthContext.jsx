// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. Initialize user from localStorage
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
          console.error("Session expired or invalid");
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
  // If a user logs out in Tab A, this instantly logs them out in Tab B
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'access' && event.newValue === null) {
        setUser(null);
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  // 4. Login Function (Memoized)
  const login = useCallback(async (email, password) => {
    const tokenRes = await authAPI.login({ email, password });
    localStorage.setItem('access', tokenRes.data.access);
    localStorage.setItem('refresh', tokenRes.data.refresh);

    const userRes = await authAPI.getMe();
    setUser(userRes.data);
    localStorage.setItem('user', JSON.stringify(userRes.data));

    return userRes.data; 
  }, []);

  // 5. Logout Function (Memoized)
  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; 
  }, []);

  // 6. Bulletproof Role Checkers (Memoized)
  const isAdmin = useCallback(() => {
    if (!user) return false;
    // Checks Django's built-in admin flag OR your custom role string
    return user.is_superuser === true || user.role?.toLowerCase() === 'admin';
  }, [user]);

  const isMember = useCallback(() => {
    if (!user) return false;
    if (user.is_superuser === true) return true; // Admins are always members
    
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
        <div className="flex h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
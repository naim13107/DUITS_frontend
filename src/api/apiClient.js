import axios from 'axios';

// 1. Create the base instance
const apiClient = axios.create({
  baseURL: 'https://duits-backend.vercel.app/api/v1/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 error and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) throw new Error("No refresh token");

        // FIX: Use apiClient (which uses baseURL) instead of hardcoded axios.post
        const res = await apiClient.post('/auth/jwt/refresh/', { 
          refresh: refreshToken 
        });
        
        localStorage.setItem('access', res.data.access);
        
        originalRequest.headers.Authorization = `JWT ${res.data.access}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        // Use replace to avoid infinite loops and 404s
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
// src/api/apiClient.js
import axios from 'axios';

// 1. Create the base instance
const apiClient = axios.create({
  baseURL: 'https://duits-backend.vercel.app/api/v1/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach the access token if the user is logged in
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

// 3. Response Interceptor: Handle expired tokens smoothly
apiClient.interceptors.response.use(
  (response) => response, // If the response is good, just return it
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 Unauthorized, and we haven't already tried to retry this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        
        // If there's no refresh token, they aren't logged in at all
        if (!refreshToken) throw new Error("No refresh token");

        // Ask Django for a new access token
        const res = await axios.post('https://duits-backend.vercel.app/api/v1/auth/jwt/refresh/', { 
          refresh: refreshToken 
        });
        
        // Save the new token
        localStorage.setItem('access', res.data.access);
        
        // Update the failed request with the new token and try again!
        originalRequest.headers.Authorization = `JWT ${res.data.access}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // If the refresh token is also dead, kick them out to the login screen
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
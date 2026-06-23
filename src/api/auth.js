// src/api/auth.js
import apiClient from './apiClient';

export const authAPI = {
  register: async (userData) => {
    return await apiClient.post('/auth/users/', userData);
  },
  
  login: async (credentials) => {
    return await apiClient.post('/auth/jwt/create/', credentials);
  },
  
  getMe: async () => {
    return await apiClient.get('/auth/users/me/');
  },
  
  // This is the upgraded updateMe that handles both text and images
  updateMe: async (updateData) => {
    const isFormData = updateData instanceof FormData;
    return await apiClient.patch('/auth/users/me/', updateData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },
  
  resetPassword: async (email) => {
    return await apiClient.post('/auth/users/reset_password/', { email });
  },
  
  resetPasswordConfirm: async (data) => {
    return await apiClient.post('/auth/users/reset_password_confirm/', data);
  },
  
  activateAccount: async (data) => {
    return await apiClient.post('/auth/users/activation/', data);
  }, // <--- Comma correctly placed here!
  
  // NEW: Fetch all users (Only works for Admins!)
  getAllUsers: async () => {
    return await apiClient.get('/auth/users/');
  }
};
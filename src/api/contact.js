import apiClient from './apiClient';

export const contactAPI = {
  sendMessage: (data) => apiClient.post('/contact/', data),
};
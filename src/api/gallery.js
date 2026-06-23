import apiClient from './apiClient';

export const galleryAPI = {
  getGallery: () => apiClient.get('/gallery/'),
};
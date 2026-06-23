import apiClient from './apiClient';

export const eventsAPI = {
  getEvents: () => apiClient.get('/events/'),
};
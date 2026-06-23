import apiClient from './apiClient';

export const panelAPI = {
  getPanelMembers: () => apiClient.get('/panel-members/'),
};
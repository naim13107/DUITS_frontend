// src/api/recruitment.js
import apiClient from './apiClient';

export const recruitmentAPI = {
  // Settings (Session Management)
  getSettings: async () => {
    return await apiClient.get('/recruitment-settings/');
  },
  updateSetting: async (id, data) => {
    return await apiClient.patch(`/recruitment-settings/${id}/`, data);
  },
  createSetting: async (data) => {
    return await apiClient.post('/recruitment-settings/', data);
  },
  deleteSetting: async (id) => {
    return await apiClient.delete(`/recruitment-settings/${id}/`);
  },
  
  // Applications
  getApplications: async (searchQuery = '') => {
    return await apiClient.get(`/recruitment-applications/?search=${searchQuery}`);
  },
 
  // ==========================================
  // NEW: Get a single application's status (Fixes the TypeError!)
  // ==========================================
  getApplicationStatus: async (id) => {
    return await apiClient.get(`/recruitment-applications/${id}/`);
  },

  // Download PDF
  downloadPdf: async (id) => {
    return await apiClient.get(`/recruitment-applications/${id}/download_pdf/`, {
      responseType: 'blob',
    });
  },

  // Submit a recruitment application form
  submitApplication: async (data) => {
    return await apiClient.post('/recruitment-applications/', data);
  }
};
// src/api/articles.js
import apiClient from './apiClient';

export const articlesAPI = {
  getArticles: () => apiClient.get('/articles/'),
  getArticle: (id) => apiClient.get(`/articles/${id}/`),
  
  // FIXED: Explicitly overriding the global JSON header so Axios sends the physical file
  submitArticle: (data) => apiClient.post('/articles/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  updateArticleStatus: (id, statusData) => apiClient.patch(`/articles/${id}/`, statusData), 
  
  // Category Endpoints
  getCategories: () => apiClient.get('/categories/'),
  createCategory: (data) => apiClient.post('/categories/', data),
};
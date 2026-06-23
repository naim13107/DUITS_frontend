// src/api/payment.js
import apiClient from './apiClient';

export const paymentAPI = {
  // Fetch all payment records (For Admin Dashboard)
  getPayments: () => apiClient.get('/payment/'),
  
  // Fetch specific transaction details (For Admin Dashboard)
  getTransactions: () => apiClient.get('/transactions/'),
  
  // If your backend requires manual initiation instead of doing it inside the recruitment form:
  initiatePayment: (data) => apiClient.post('/payment/initiate/', data),
};
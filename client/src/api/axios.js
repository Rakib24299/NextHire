import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // কুকি স্বয়ংক্রিয়ভাবে পাঠাতে সাহায্য করবে
});

// লোকালস্টোরেজে টোকেন থাকলে স্বয়ংক্রিয়ভাবে Authorization হেডারে পাঠানো হবে
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

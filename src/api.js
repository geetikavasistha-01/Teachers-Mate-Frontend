import axios from 'axios';

// Check if Vite is building for production
const isProduction = import.meta.env.MODE === 'production';

// Force the Railway URL in production to prevent misconfigured Vercel variables
const baseURL = isProduction 
  ? 'https://sams-backend-production-86ab.up.railway.app/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5002/api');

const API = axios.create({ 
  baseURL
});

export default API;
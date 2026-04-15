import axios from 'axios';

const API = axios.create({ 
  // To use the Railway URL on Vercel and localhost on your Mac
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api' 
});

export default API;
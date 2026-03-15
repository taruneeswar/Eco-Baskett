import axios from 'axios'

const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  || window.location.hostname.startsWith('192.168.')

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalHost ? 'http://localhost:5000/api' : 'https://eco-basket-backend.onrender.com/api'),
  withCredentials: true
})

export default api

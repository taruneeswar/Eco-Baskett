import axios from 'axios'

const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  || window.location.hostname.startsWith('192.168.')

function normalizeApiBaseUrl(rawUrl) {
  if (!rawUrl) return ''

  const trimmed = rawUrl.trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const resolvedBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

const api = axios.create({
  baseURL: resolvedBaseUrl || (isLocalHost ? 'http://localhost:5000/api' : 'https://eco-basket-backend.onrender.com/api'),
  withCredentials: true
})

export default api

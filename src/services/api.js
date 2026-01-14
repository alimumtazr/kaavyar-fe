import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const NEUTRAL_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=1000&fit=crop',
]

const normalizeImages = (product) => {
  if (!product) return product
  return {
    ...product,
    images: NEUTRAL_IMAGES,
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    return data
  },
  
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
  
  updateMe: async (userData) => {
    const { data } = await api.put('/auth/me', userData)
    return data
  },
  
  addAddress: async (address) => {
    const { data } = await api.post('/auth/me/addresses', address)
    return data
  },
  
  toggleWishlist: async (productId) => {
    const { data } = await api.post(`/auth/me/wishlist/${productId}`)
    return data
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
    return data
  }
}

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params })
    return {
      ...data,
      products: data.products?.map(normalizeImages) ?? []
    }
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return normalizeImages(data)
  },
  
  getFeatured: async (limit = 8) => {
    const { data } = await api.get('/products/featured', { params: { limit } })
    return data.map(normalizeImages)
  },
  
  getNewArrivals: async (limit = 8) => {
    const { data } = await api.get('/products/new-arrivals', { params: { limit } })
    return data.map(normalizeImages)
  },
  
  getRelated: async (id, limit = 4) => {
    const { data } = await api.get(`/products/${id}/related`, { params: { limit } })
    return data.map(normalizeImages)
  },
  
  getCategories: async () => {
    const { data } = await api.get('/products/categories')
    return data
  }
}

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const { data } = await api.post('/orders', orderData)
    return data
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },
  
  getMyOrders: async (page = 1, pageSize = 10) => {
    const { data } = await api.get('/orders', { params: { page, page_size: pageSize } })
    return data
  },
  
  track: async (orderNumber, email) => {
    const { data } = await api.get(`/orders/track/${orderNumber}`, { params: { email } })
    return data
  },
  
  cancel: async (id) => {
    const { data } = await api.post(`/orders/${id}/cancel`)
    return data
  }
}

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard')
    return data
  },
  
  // Products
  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData)
    return data
  },
  
  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  },
  
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`)
  },
  
  uploadProductImage: async (productId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },
  
  deleteProductImage: async (productId, imageUrl) => {
    const { data } = await api.delete(`/products/${productId}/images`, {
      params: { image_url: imageUrl }
    })
    return data
  },
  
  // Orders
  getAllOrders: async (params = {}) => {
    const { data } = await api.get('/orders/admin/all', { params })
    return data
  },
  
  updateOrder: async (id, orderData) => {
    const { data } = await api.put(`/orders/${id}`, orderData)
    return data
  },
  
  getOrderStats: async () => {
    const { data } = await api.get('/orders/admin/stats')
    return data
  },
  
  // Customers
  getCustomers: async (params = {}) => {
    const { data } = await api.get('/admin/customers', { params })
    return data
  },
  
  getCustomerDetails: async (id) => {
    const { data } = await api.get(`/admin/customers/${id}`)
    return data
  },
  
  toggleCustomerStatus: async (id, isActive) => {
    const { data } = await api.put(`/admin/customers/${id}/status`, null, {
      params: { is_active: isActive }
    })
    return data
  },
  
  // Seed admin
  seedAdmin: async () => {
    const { data } = await api.post('/admin/seed-admin')
    return data
  }
}

export default api



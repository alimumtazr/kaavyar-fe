import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore, useWishlistStore } from '../store/useStore'
import { authAPI, ordersAPI, productsAPI } from '../services/api'
import { formatPrice } from '../utils/helpers'
import ProductCard from '../components/ui/ProductCard'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin }
]

export default function Account() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthenticated, logout, updateUser } = useAuthStore()
  const { items: wishlistItems } = useWishlistStore()
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')
  const [orders, setOrders] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setSearchParams({ tab: activeTab })
  }, [activeTab, setSearchParams])

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders()
    }
  }, [activeTab, isAuthenticated])

  useEffect(() => {
    if (activeTab === 'wishlist') {
      fetchWishlistProducts()
    }
  }, [activeTab, wishlistItems])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await ordersAPI.getMyOrders()
      setOrders(data.orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWishlistProducts = async () => {
    if (wishlistItems.length === 0) {
      setWishlistProducts([])
      return
    }
    
    setLoading(true)
    try {
      const products = await Promise.all(
        wishlistItems.map(id => productsAPI.getById(id).catch(() => null))
      )
      setWishlistProducts(products.filter(Boolean))
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="pt-[110px] min-h-screen bg-background">
      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 mb-4">
              <p className="font-display text-xl">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>

            <nav className="bg-white">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-display text-2xl mb-6">Profile Information</h2>
                  <div className="grid gap-4 max-w-md">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                        First Name
                      </label>
                      <p className="text-gray-900">{user.first_name}</p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                        Last Name
                      </label>
                      <p className="text-gray-900">{user.last_name}</p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                        Phone
                      </label>
                      <p className="text-gray-900">{user.phone || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-display text-2xl mb-6">Order History</h2>
                  {loading ? (
                    <p className="text-gray-500">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-500">No orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border p-4">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                              <p className="font-medium">{order.order_number}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 text-xs uppercase tracking-wider ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status}
                              </span>
                              <p className="mt-2 font-medium">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto">
                            {order.items.map((item, i) => (
                              <img
                                key={i}
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-20 object-cover flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="font-display text-2xl mb-6">Wishlist</h2>
                  {loading ? (
                    <p className="text-gray-500">Loading wishlist...</p>
                  ) : wishlistProducts.length === 0 ? (
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {wishlistProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-display text-2xl mb-6">Saved Addresses</h2>
                  {user.addresses?.length === 0 ? (
                    <p className="text-gray-500">No saved addresses.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {user.addresses?.map((address, i) => (
                        <div key={i} className="border p-4">
                          <p className="font-medium">{address.first_name} {address.last_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address}<br />
                            {address.city}, {address.country}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                          {address.is_default && (
                            <span className="inline-block mt-2 text-xs text-secondary">Default</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}








import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/useStore'
import { adminAPI, productsAPI } from '../services/api'
import { formatPrice } from '../utils/helpers'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users }
]

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

const CATEGORIES = [
  'kurtas', 'kaftans', 'tops', 'pants', 'sets', 'anarkalis', 
  'kurta-sets', 'sarees', 'jackets', 'lehengas', 'gowns', 
  'sherwanis', 'kurta-shalwar', 'waistcoats', 'bridal-lehengas', 
  'bridal-sarees', 'formal-kurtas', 'accessories'
]

const SUBCATEGORIES = ['ready-to-wear', 'couture', 'menswear', 'accessories', 'bridal']

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  
  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState(null)
  
  // Products state
  const [products, setProducts] = useState([])
  const [productsTotal, setProductsTotal] = useState(0)
  const [productsPage, setProductsPage] = useState(1)
  const [productSearch, setProductSearch] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Customers state
  const [customers, setCustomers] = useState([])
  const [customersTotal, setCustomersTotal] = useState(0)
  const [customersPage, setCustomersPage] = useState(1)
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/admin' } } })
      return
    }
    if (user && !user.is_admin) {
      toast.error('Access denied. Admin only.')
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (user?.is_admin) {
      fetchTabData()
    }
  }, [activeTab, user])

  useEffect(() => {
    if (activeTab === 'products' && user?.is_admin) {
      fetchProducts()
    }
  }, [productsPage, productSearch])

  useEffect(() => {
    if (activeTab === 'orders' && user?.is_admin) {
      fetchOrders()
    }
  }, [ordersPage, orderStatusFilter])

  useEffect(() => {
    if (activeTab === 'customers' && user?.is_admin) {
      fetchCustomers()
    }
  }, [customersPage, customerSearch])

  const fetchTabData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'dashboard':
          await fetchDashboard()
          break
        case 'products':
          await fetchProducts()
          break
        case 'orders':
          await fetchOrders()
          break
        case 'customers':
          await fetchCustomers()
          break
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboard = async () => {
    const data = await adminAPI.getDashboard()
    setDashboardStats(data)
  }

  const fetchProducts = async () => {
    const params = { page: productsPage, page_size: 10 }
    if (productSearch) params.search = productSearch
    const data = await productsAPI.getAll(params)
    setProducts(data.products)
    setProductsTotal(data.total)
  }

  const fetchOrders = async () => {
    const params = { page: ordersPage, page_size: 10 }
    if (orderStatusFilter) params.status = orderStatusFilter
    const data = await adminAPI.getAllOrders(params)
    setOrders(data.orders)
    setOrdersTotal(data.total)
  }

  const fetchCustomers = async () => {
    const params = { page: customersPage, page_size: 10 }
    if (customerSearch) params.search = customerSearch
    const data = await adminAPI.getCustomers(params)
    setCustomers(data.customers)
    setCustomersTotal(data.total)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await adminAPI.deleteProduct(productId)
      toast.success('Product deleted')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrder(orderId, { status })
      toast.success('Order status updated')
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status }))
      }
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await adminAPI.updateOrder(orderId, { payment_status: paymentStatus })
      toast.success('Payment status updated')
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, payment_status: paymentStatus }))
      }
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const handleToggleCustomerStatus = async (customerId, currentStatus) => {
    try {
      await adminAPI.toggleCustomerStatus(customerId, !currentStatus)
      toast.success(`Customer ${currentStatus ? 'disabled' : 'enabled'}`)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to update customer status')
    }
  }

  if (!user?.is_admin) {
    return null
  }

  return (
    <div className="pt-[110px] min-h-screen bg-[#f8f6f3]">
      <div className="container py-8">
        <h1 className="font-display text-3xl mb-8">Admin Panel</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="bg-white shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-sm p-6"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && dashboardStats && (
                    <DashboardTab stats={dashboardStats} />
                  )}

                  {/* Products Tab */}
                  {activeTab === 'products' && (
                    <ProductsTab
                      products={products}
                      total={productsTotal}
                      page={productsPage}
                      setPage={setProductsPage}
                      search={productSearch}
                      setSearch={setProductSearch}
                      onEdit={(product) => {
                        setEditingProduct(product)
                        setShowProductModal(true)
                      }}
                      onDelete={handleDeleteProduct}
                      onCreate={() => {
                        setEditingProduct(null)
                        setShowProductModal(true)
                      }}
                    />
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <OrdersTab
                      orders={orders}
                      total={ordersTotal}
                      page={ordersPage}
                      setPage={setOrdersPage}
                      statusFilter={orderStatusFilter}
                      setStatusFilter={setOrderStatusFilter}
                      selectedOrder={selectedOrder}
                      setSelectedOrder={setSelectedOrder}
                      onUpdateStatus={handleUpdateOrderStatus}
                      onUpdatePayment={handleUpdatePaymentStatus}
                    />
                  )}

                  {/* Customers Tab */}
                  {activeTab === 'customers' && (
                    <CustomersTab
                      customers={customers}
                      total={customersTotal}
                      page={customersPage}
                      setPage={setCustomersPage}
                      search={customerSearch}
                      setSearch={setCustomerSearch}
                      selectedCustomer={selectedCustomer}
                      setSelectedCustomer={setSelectedCustomer}
                      onToggleStatus={handleToggleCustomerStatus}
                    />
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <ProductModal
            product={editingProduct}
            onClose={() => {
              setShowProductModal(false)
              setEditingProduct(null)
            }}
            onSave={() => {
              setShowProductModal(false)
              setEditingProduct(null)
              fetchProducts()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Dashboard Tab Component
function DashboardTab({ stats }) {
  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.total_revenue), icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.total_products, icon: Package, color: 'bg-purple-500' },
    { label: 'Total Customers', value: stats.total_customers, icon: Users, color: 'bg-amber-500' }
  ]

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-50 p-5 rounded-lg"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {stats.pending_orders > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800">
              <strong>{stats.pending_orders}</strong> orders pending
            </span>
          </div>
        )}
        {stats.out_of_stock_products > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">
              <strong>{stats.out_of_stock_products}</strong> products out of stock
            </span>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="font-medium text-lg mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-medium">Order #</th>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders?.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3 font-mono text-xs">{order.order_number}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Products Tab Component
function ProductsTab({ products, total, page, setPage, search, setSearch, onEdit, onDelete, onCreate }) {
  const totalPages = Math.ceil(total / 10)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-2xl">Products ({total})</h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium">Product</th>
              <th className="text-left p-3 font-medium">SKU</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Stock</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-14 object-cover"
                      />
                    )}
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-xs">{product.sku}</td>
                <td className="p-3 capitalize">{product.category}</td>
                <td className="p-3">{formatPrice(product.price)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

// Orders Tab Component
function OrdersTab({ 
  orders, total, page, setPage, statusFilter, setStatusFilter, 
  selectedOrder, setSelectedOrder, onUpdateStatus, onUpdatePayment 
}) {
  const totalPages = Math.ceil(total / 10)

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Orders ({total})</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 focus:outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Orders Table */}
        <div className={`flex-1 ${selectedOrder ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Order #</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{order.order_number}</td>
                    <td className="p-3">{order.email}</td>
                    <td className="p-3">{formatPrice(order.total)}</td>
                    <td className="p-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-3">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>

        {/* Order Details Panel */}
        {selectedOrder && (
          <div className="w-full lg:w-96 bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Order Number</p>
                <p className="font-mono text-sm">{selectedOrder.order_number}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Customer</p>
                <p className="text-sm">{selectedOrder.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Shipping Address</p>
                <p className="text-sm">
                  {selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}<br />
                  {selectedOrder.shipping_address.address}<br />
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.country}<br />
                  {selectedOrder.shipping_address.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover" />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-gray-500">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <p className="ml-auto">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => onUpdateStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-primary"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Payment Status</p>
                <select
                  value={selectedOrder.payment_status}
                  onChange={(e) => onUpdatePayment(selectedOrder.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-primary"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Customers Tab Component
function CustomersTab({ 
  customers, total, page, setPage, search, setSearch,
  selectedCustomer, setSelectedCustomer, onToggleStatus 
}) {
  const totalPages = Math.ceil(total / 10)
  const [customerOrders, setCustomerOrders] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchCustomerDetails = async (customerId) => {
    setLoadingDetails(true)
    try {
      const data = await adminAPI.getCustomerDetails(customerId)
      setSelectedCustomer(data.customer)
      setCustomerOrders(data.orders)
    } catch (error) {
      toast.error('Failed to load customer details')
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Customers ({total})</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-6">
        {/* Customers Table */}
        <div className={`flex-1 ${selectedCustomer ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Orders</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="p-3">{customer.email}</td>
                    <td className="p-3">{customer.order_count}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchCustomerDetails(customer.id)}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onToggleStatus(customer.id, customer.is_active)}
                          className={`p-2 rounded ${
                            customer.is_active 
                              ? 'text-gray-600 hover:text-red-600 hover:bg-red-50' 
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={customer.is_active ? 'Disable' : 'Enable'}
                        >
                          {customer.is_active ? <X size={16} /> : <Check size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>

        {/* Customer Details Panel */}
        {selectedCustomer && (
          <div className="w-full lg:w-96 bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                  <p className="font-medium">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                  <p className="text-sm">{selectedCustomer.phone || '-'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Saved Addresses</p>
                  {selectedCustomer.addresses?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomer.addresses.map((addr, i) => (
                        <div key={i} className="text-sm bg-white p-2 rounded">
                          <p>{addr.address}</p>
                          <p className="text-gray-500">{addr.city}, {addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No addresses saved</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Order History</p>
                  {customerOrders.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="bg-white p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs">{order.order_number}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Product Modal Component
function ProductModal({ product, onClose, onSave }) {
  const isEditing = !!product
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    category: product?.category || 'kurtas',
    subcategory: product?.subcategory || 'ready-to-wear',
    description: product?.description || '',
    fabric: product?.fabric || '',
    care: product?.care || '',
    sku: product?.sku || '',
    sizes: product?.sizes?.join(', ') || 'XS, S, M, L, XL',
    colors: product?.colors?.join(', ') || '',
    badges: product?.badges?.join(', ') || '',
    in_stock: product?.in_stock ?? true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        price: parseInt(formData.price),
        original_price: formData.original_price ? parseInt(formData.original_price) : null,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
        badges: formData.badges.split(',').map(b => b.trim()).filter(Boolean)
      }

      if (isEditing) {
        await adminAPI.updateProduct(product.id, data)
        toast.success('Product updated')
      } else {
        await adminAPI.createProduct(data)
        toast.success('Product created')
      }
      onSave()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Original Price (if on sale)
              </label>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Subcategory *
              </label>
              <select
                required
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary capitalize"
              >
                {SUBCATEGORIES.map((sub) => (
                  <option key={sub} value={sub} className="capitalize">
                    {sub.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Fabric *
              </label>
              <input
                type="text"
                required
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Care Instructions *
              </label>
              <input
                type="text"
                required
                value={formData.care}
                onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Sizes (comma separated) *
              </label>
              <input
                type="text"
                required
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                placeholder="XS, S, M, L, XL"
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Colors (comma separated) *
              </label>
              <input
                type="text"
                required
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Red, Blue, Green"
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Badges (comma separated)
              </label>
              <input
                type="text"
                value={formData.badges}
                onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                placeholder="new, sale, artisanal"
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="in_stock"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="in_stock" className="text-sm">
                In Stock
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Pagination Component
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="p-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm px-4">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="p-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

// Payment Badge Component
function PaymentBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700'
  }

  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}






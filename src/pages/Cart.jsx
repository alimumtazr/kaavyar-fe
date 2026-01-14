import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, X, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '../store/useStore'
import { formatPrice } from '../utils/helpers'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  
  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 1500
  const total = subtotal + shipping

  const handleRemove = (productId, size) => {
    removeItem(productId, size)
    toast.success('Item removed from cart')
  }

  if (!items || items.length === 0) {
    return (
      <div className="pt-[110px] min-h-screen">
        <div className="container py-20 text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300" strokeWidth={1} />
          <h2 className="mt-6 font-display text-3xl text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn btn-primary mt-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[110px]">
      {/* Page Header */}
      <div className="bg-background-alt py-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-primary">Shopping Cart</h1>
        <p className="mt-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Cart</span>
        </p>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-6 pb-4 border-b text-xs font-medium tracking-wider uppercase text-gray-500">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span className="w-6"></span>
              </div>

              {/* Items */}
              <div className="divide-y">
                {(items || []).map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="py-6 grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 md:gap-6 items-center"
                  >
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <Link to={`/products/${item.productId}`} className="w-24 h-32 bg-gray-100 flex-shrink-0">
                        <img src={item.image || 'https://placehold.co/240x320/f5f5f5/8B0000?text=KAVYAAR'} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-display text-lg hover:text-secondary transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                        <p className="text-sm text-gray-900 md:hidden mt-2">{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden md:block text-sm">
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity >= 10}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.productId, item.size)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-background-alt p-8">
                <h2 className="font-display text-2xl mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Free shipping on orders over Rs. 50,000
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="btn btn-primary w-full mt-6 py-4 justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="ml-2" />
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-sm text-gray-500 hover:text-primary mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



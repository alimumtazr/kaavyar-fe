import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartStore, useWishlistStore } from '../../store/useStore'
import { formatPrice } from '../../utils/helpers'

const badgeStyles = {
  new: 'bg-primary text-white',
  sale: 'bg-secondary text-white',
  artisanal: 'bg-amber-600 text-white',
  'sold-out': 'bg-gray-400 text-white'
}

const badgeLabels = {
  new: 'New',
  sale: 'Sale',
  artisanal: 'Artisanal',
  'sold-out': 'Sold Out'
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem)
  const { toggle, has } = useWishlistStore()
  const isInWishlist = has(product.id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]
    addItem(product, defaultSize, 1)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggle(product.id)
    toast.success(added ? 'Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x533/f5f5f5/8B0000?text=KAVYAAR'
            }}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}

          {/* Badges */}
          {product.badges?.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${badgeStyles[badge] || 'bg-gray-700 text-white'}`}
                >
                  {badgeLabels[badge] || badge}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isInWishlist ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleQuickAdd}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
              aria-label="Quick add to cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 text-center">
          <h3 className="font-display text-lg text-gray-900 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="mt-1.5 text-sm text-gray-600">
            {product.original_price && (
              <span className="line-through text-gray-400 mr-2">
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className={product.original_price ? 'text-primary font-medium' : ''}>
              {formatPrice(product.price)}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

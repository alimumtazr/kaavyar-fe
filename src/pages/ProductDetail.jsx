import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Minus, Plus, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductCard from '../components/ui/ProductCard'
import { productsAPI } from '../services/api'
import { useCartStore, useWishlistStore } from '../store/useStore'
import { formatPrice } from '../utils/helpers'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [openAccordion, setOpenAccordion] = useState(null)

  const addItem = useCartStore(state => state.addItem)
  const { toggle, has } = useWishlistStore()
  const isInWishlist = product ? has(product.id) : false

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const [productData, relatedData] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getRelated(id, 4)
        ])
        setProduct(productData)
        setRelated(relatedData)
        setSelectedSize(productData.sizes[0])
        setActiveImage(0)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    addItem(product, selectedSize, quantity)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = () => {
    const added = toggle(product.id)
    toast.success(added ? 'Added to wishlist' : 'Removed from wishlist')
  }

  if (loading) {
    return (
      <div className="pt-[110px] min-h-screen">
        <div className="container py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse w-3/4" />
              <div className="h-6 bg-gray-100 animate-pulse w-1/4" />
              <div className="h-24 bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-[110px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl">Product not found</h2>
          <Link to="/products" className="btn btn-primary mt-4">Back to Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[110px]">
      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="sticky top-32">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 border-2 transition-colors ${
                      activeImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-8">
            <h1 className="font-display text-3xl md:text-4xl text-primary">{product.name}</h1>
            
            <p className="mt-4 text-xl text-gray-600">
              {product.original_price && (
                <span className="line-through text-gray-400 mr-3">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className={product.original_price ? 'text-red-700' : ''}>
                {formatPrice(product.price)}
              </span>
            </p>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mt-8">
              <label className="text-xs font-medium tracking-wider uppercase text-gray-500 block mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border text-sm transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-xs font-medium tracking-wider uppercase text-gray-500 block mb-3">
                Quantity
              </label>
              <div className="flex items-center border border-gray-200 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-16 h-12 text-center border-x border-gray-200 focus:outline-none"
                  min="1"
                  max="10"
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full py-4"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`btn w-full py-4 border ${
                  isInWishlist ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} className="mr-2" />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Meta */}
            <div className="mt-8 pt-8 border-t space-y-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">SKU:</span> {product.sku}</p>
              <p><span className="text-gray-500 w-24 inline-block">Fabric:</span> {product.fabric}</p>
              <p><span className="text-gray-500 w-24 inline-block">Colors:</span> {product.colors.join(', ')}</p>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t">
              {[
                { key: 'care', title: 'Details & Care', content: `Care Instructions: ${product.care}. For best results, store in a cool, dry place away from direct sunlight.` },
                { key: 'shipping', title: 'Shipping & Returns', content: 'Free shipping on orders over Rs. 50,000. Standard delivery takes 3-5 business days. We accept returns within 14 days of delivery.' }
              ].map((item) => (
                <div key={item.key} className="border-b">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium tracking-wider uppercase">{item.title}</span>
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform ${openAccordion === item.key ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openAccordion === item.key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="pb-4 text-sm text-gray-600 leading-relaxed"
                    >
                      {item.content}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section border-t">
          <div className="container">
            <h2 className="font-display text-3xl text-primary mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}








import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/useStore'
import { productsAPI } from '../../services/api'
import { formatPrice } from '../../utils/helpers'

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await productsAPI.getAll({ search: query, page_size: 6 })
        setResults(data.products || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleClose = () => {
    setQuery('')
    setResults([])
    closeSearch()
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/98 z-50 flex items-start justify-center pt-32"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2"
            aria-label="Close search"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-2xl px-6">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full border-b-2 border-primary bg-transparent py-4 font-display text-3xl outline-none placeholder:text-gray-400"
            />

            <div className="mt-8">
              {loading && (
                <p className="text-gray-500">Searching...</p>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-20 object-cover"
                      />
                      <div>
                        <h4 className="font-display text-lg">{product.name}</h4>
                        <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-gray-500">No products found</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}








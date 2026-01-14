import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { productsAPI } from '../services/api'
import { getCategoryLabel } from '../utils/helpers'

const sortOptions = [
  { value: 'created_at:desc', label: 'Newest' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name: A-Z' }
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  const badges = searchParams.get('badges')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'created_at:desc'

  const pageTitle = category 
    ? getCategoryLabel(category)
    : subcategory 
      ? getCategoryLabel(subcategory)
      : badges === 'new'
        ? 'New Arrivals'
        : 'Shop All'

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const [sortBy, sortOrder] = sort.split(':')
        const params = {
          page,
          page_size: 20,
          sort_by: sortBy,
          sort_order: sortOrder
        }
        
        if (category) params.category = category
        if (subcategory) params.subcategory = subcategory
        if (badges) params.badges = badges
        if (search) params.search = search

        const data = await productsAPI.getAll(params)
        setProducts(data.products)
        setTotal(data.total)
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, subcategory, badges, search, sort, page])

  const handleSortChange = (value) => {
    searchParams.set('sort', value)
    setSearchParams(searchParams)
  }

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 py-16 text-center border-b">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl text-primary">{pageTitle}</h1>
          <p className="mt-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{pageTitle}</span>
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">
            {total} {total === 1 ? 'Product' : 'Products'}
          </p>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-transparent pr-8 py-2 text-sm cursor-pointer focus:outline-none border-b border-transparent hover:border-primary transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-100 animate-pulse w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-100 animate-pulse w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-display text-2xl text-gray-400">No products found</h2>
              <p className="mt-2 text-gray-400">Try adjusting your filters</p>
              <Link to="/products" className="btn btn-primary mt-6">
                View All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

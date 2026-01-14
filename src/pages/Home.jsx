import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { productsAPI } from '../services/api'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [featuredData, newData] = await Promise.all([
          productsAPI.getFeatured(8),
          productsAPI.getNewArrivals(4)
        ])
        setFeatured(featuredData)
        setNewArrivals(newData)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-gradient-to-br from-rose-50 via-red-100/80 to-rose-200/60">
        <div className="absolute inset-0">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          {/* Large watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="font-display text-[30vw] font-medium tracking-[0.1em] text-primary/[0.07] select-none">
              KAVYAAR
            </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary/70 font-medium">Winter 2025</span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl font-light tracking-wide text-primary">
            The Signature Collection
          </h1>
          <p className="mt-4 text-lg font-light text-gray-600">
            Modern silhouettes, refined fabrics, effortless luxury
          </p>
          <Link 
            to="/products" 
            className="btn mt-8 border-2 border-primary text-primary hover:bg-primary hover:text-white"
          >
            Explore Collection
          </Link>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-primary/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="mt-2 w-px h-10 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Curated Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-primary">Curated For You</h2>
            <Link to="/products" className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gray-600 hover:text-primary transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                  <div className="mt-4 h-4 bg-gray-100 animate-pulse w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {featured.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[280px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
          <Link to="/products?subcategory=ready-to-wear" className="group relative aspect-[3/4] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop"
              alt="Ready to Wear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/800x1000/f5f5f5/8B0000?text=Ready+to+Wear' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs tracking-widest uppercase opacity-80 font-medium">Collection</span>
              <h3 className="font-display text-2xl mt-1">Ready to Wear</h3>
            </div>
          </Link>

          <Link to="/products?subcategory=couture" className="group relative aspect-[3/4] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=1000&fit=crop"
              alt="Couture"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/800x1000/f5f5f5/8B0000?text=Couture' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs tracking-widest uppercase opacity-80 font-medium">Collection</span>
              <h3 className="font-display text-2xl mt-1">Couture</h3>
            </div>
          </Link>

          <Link to="/products?category=bridal-lehengas" className="group relative aspect-[3/4] md:col-span-2 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&h=800&fit=crop"
              alt="Bridal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/1600x800/f5f5f5/8B0000?text=The+Bridal+Edit' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs tracking-widest uppercase opacity-80 font-medium">Bridal Season</span>
              <h3 className="font-display text-3xl mt-1">The Bridal Edit</h3>
            </div>
          </Link>

          <Link to="/products?subcategory=menswear" className="group relative aspect-[3/4] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=1000&fit=crop"
              alt="Menswear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/800x1000/f5f5f5/8B0000?text=Menswear' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs tracking-widest uppercase opacity-80 font-medium">Collection</span>
              <h3 className="font-display text-2xl mt-1">Menswear</h3>
            </div>
          </Link>

          <Link to="/products?subcategory=accessories" className="group relative aspect-[3/4] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=1000&fit=crop"
              alt="Accessories"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/800x1000/f5f5f5/8B0000?text=Accessories' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs tracking-widest uppercase opacity-80 font-medium">Collection</span>
              <h3 className="font-display text-2xl mt-1">Accessories</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Signature Section */}
      <section className="bg-primary text-white">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          <div className="flex flex-col justify-center p-10 md:p-16 lg:p-24">
            <span className="text-white/70 text-xs tracking-[0.2em] uppercase font-medium">Signature Craft</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-light">Designed for the Modern Wardrobe</h2>
            <p className="mt-6 text-white/80 leading-relaxed">
              Elevated essentials and statement pieces cut in premium fabrics, tailored for versatility and ease. Thoughtful detailing, precise construction, and refined palettes anchor every drop.
            </p>
            <Link to="#" className="btn mt-8 border-2 border-white/50 text-white hover:bg-white hover:text-primary w-fit">
              Discover the Edit
            </Link>
          </div>
          <div className="relative h-[400px] md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=1000&fit=crop"
              alt="Tailored Craft"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/800x1000/5C0000/ffffff?text=Craftsmanship' }}
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-primary">New Arrivals</h2>
              <Link to="/products?badges=new" className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gray-600 hover:text-primary transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <span className="text-sm text-primary font-medium">@kavyaar.official</span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-gray-900">Follow Our Journey</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop'
            ].map((src, i) => (
              <a 
                key={i} 
                href="#" 
                className="group relative aspect-square overflow-hidden"
              >
                <img 
                  src={src} 
                  alt="Instagram" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x400/f5f5f5/8B0000?text=Instagram' }}
                />
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white" size={32} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

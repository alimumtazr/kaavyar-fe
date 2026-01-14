import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Heart, ShoppingBag, User, Shield } from 'lucide-react'
import { useCartStore, useUIStore, useAuthStore } from '../../store/useStore'

const navLinks = [
  { name: 'New Arrivals', href: '/products?badges=new' },
  { name: 'Ready to Wear', href: '/products?subcategory=ready-to-wear' },
  { name: 'Couture', href: '/products?subcategory=couture' },
  { name: 'Menswear', href: '/products?subcategory=menswear' },
  { name: 'Accessories', href: '/products?subcategory=accessories' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const cartCount = useCartStore(state => state.getCount())
  const { openMobileMenu, openSearch } = useUIStore()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      {/* Top Row - Logo and Actions */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={openMobileMenu}
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo - Center */}
            <Link 
              to="/" 
              className="absolute left-1/2 -translate-x-1/2 font-display text-3xl md:text-4xl font-medium tracking-[0.2em]"
              style={{ color: '#8B0000' }}
            >
              KAVYAAR
            </Link>

            {/* Actions - Right */}
            <div className="flex items-center gap-5 ml-auto">
              <button 
                onClick={openSearch}
                className="p-2 text-gray-700 hover:text-primary transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              
              {user?.is_admin && (
                <Link 
                  to="/admin"
                  className="p-2 text-amber-600 hover:text-amber-700 transition-colors hidden sm:block"
                  aria-label="Admin Panel"
                  title="Admin Panel"
                >
                  <Shield size={20} />
                </Link>
              )}
              
              <Link 
                to={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-gray-700 hover:text-primary transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              
              <Link 
                to="/account?tab=wishlist"
                className="p-2 text-gray-700 hover:text-primary transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
              
              <Link 
                to="/cart"
                className="p-2 text-gray-700 hover:text-primary transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-6 lg:gap-10 h-[50px]">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.href}
                className={`text-[13px] font-medium tracking-wide uppercase transition-colors ${
                  location.pathname + location.search === link.href 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
